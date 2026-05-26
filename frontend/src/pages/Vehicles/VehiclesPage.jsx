import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PATHS } from "../../routes/paths";
import VehiclesSearchBar from "../../components/search/VehiclesSearchBar";
import VehiclesFiltersPanel, {
  DEFAULT_VEHICLES_FILTERS,
} from "../../components/search/VehiclesFiltersPanel";
import { getVehicles } from "../../api/vehicles";
import { resolveImageUrl, imageFallback } from "../../utils/resolveImageUrl";
import { normalize } from "../../utils/filterHelpers";

function VehiclesPage() {
  const [filters, setFilters] = useState({
    city: "",
    startDate: "",
    endDate: "",
    type: "",
    maxPrice: "",
  });

  const [advancedFilters, setAdvancedFilters] = useState(DEFAULT_VEHICLES_FILTERS);
  const [cars, setCars] = useState([]);

  const cleanParams = (obj) =>
    Object.fromEntries(
      Object.entries(obj).filter(([, v]) => String(v).trim() !== "")
    );

function shuffle(list) {
  const result = [];

  while (list.length > 0) {
    const randomIndex = Math.floor(Math.random() * list.length);
    result.push(list[randomIndex]);
    list.splice(randomIndex, 1);
  }

  return result;
}


  async function load(nextFilters = filters) {
    const params = cleanParams({
      city: nextFilters.city,
      startDate: nextFilters.startDate,
      endDate: nextFilters.endDate,
      type: nextFilters.type,
      maxPrice: nextFilters.maxPrice,
    });

    const data = await getVehicles(params);
    const mapped = (data?.results || []).map((c) => ({
      id: c._id,
      model: c.type,
      city: c.city,
      date: c.date,
      policy: c.available === false ? "No disponible" : "Disponible",
      price: c.price,
      imageUrl: c.imageUrl,
      _fuel: c.fuel != null ? normalize(c.fuel) : null,
      _type: c.type != null ? normalize(c.type) : null,
      _company: c.company != null ? normalize(c.company) : null,
      _transmission: c.transmission != null ? normalize(c.transmission) : null,
      _unlimitedMileage: typeof c.unlimitedMileage === "boolean" ? c.unlimitedMileage : null,
    }));
    setCars(shuffle(mapped));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visibleCars = useMemo(() => {
    return cars.filter((c) => {
      if (advancedFilters.fuels.length > 0 && c._fuel != null) {
        const ok = advancedFilters.fuels.some((f) => c._fuel.includes(f));
        if (!ok) return false;
      }

      if (advancedFilters.vehicleTypes.length > 0 && c._type != null) {
        const ok = advancedFilters.vehicleTypes.some((vt) => c._type.includes(vt));
        if (!ok) return false;
      }

      if (advancedFilters.companies.length > 0 && c._company != null) {
        const ok = advancedFilters.companies.some((co) => c._company.includes(normalize(co)));
        if (!ok) return false;
      }

      if (advancedFilters.transmissions.length > 0 && c._transmission != null) {
        const ok = advancedFilters.transmissions.some((t) => c._transmission.includes(t));
        if (!ok) return false;
      }

      if (advancedFilters.unlimitedMileage && c._unlimitedMileage !== true) return false;

      return true;
    });
  }, [cars, advancedFilters]);

  return (
    <div className="container">
      <h2>Vehículos</h2>
      <p className="muted">Alquila coche al mejor precio.</p>

      <VehiclesSearchBar
        value={filters}
        onChange={(patch) => setFilters((f) => ({ ...f, ...patch }))}
        onSearch={() => load()}
      />

      <div className="search-layout">
        <aside className="filters">
          <VehiclesFiltersPanel
            value={advancedFilters}
            onChange={(patch) => setAdvancedFilters((f) => ({ ...f, ...patch }))}
            onReset={() => setAdvancedFilters(DEFAULT_VEHICLES_FILTERS)}
          />
        </aside>

        <div className="grid-cards">
          {visibleCars.map((c) => (
              <article key={c.id} className="deal-card card">
                <div className="deal-img">
                  <img
                    src={resolveImageUrl(c.imageUrl)}
                    alt={`${c.model} en ${c.city}`}
                    loading="lazy"
                    onError={imageFallback}
                  />
                </div>
                <div className="deal-info">
                  <h3>{c.model}</h3>
                  <p className="muted">
                    {c.city} · {c.date || ""}
                  </p>
                  <span className="badge">{c.policy}</span>
                </div>
                <div className="deal-price">
                  <div className="price">{c.price} €</div>
                  <div className="muted">total</div>
                  <Link
                    to={`${PATHS.VEHICULOS}/${c.id}`}
                    state={{ fromDetailsButton: true }}
                    className="hotel-btn"
                  >
                    Ver detalles
                  </Link>
                </div>
              </article>
          ))}
          {visibleCars.length === 0 && cars.length > 0 ? (
            <p className="muted">No hay vehículos que cumplan los filtros seleccionados.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default VehiclesPage;
