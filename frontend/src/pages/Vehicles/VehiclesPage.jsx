import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PATHS } from "../../routes/paths";
import VehiclesSearchBar from "../../components/search/VehiclesSearchBar";
import { getVehicles } from "../../api/vehicles";
import { resolveImageUrl } from "../../utils/resolveImageUrl";
import FiltersSidebar from "../../components/search/FiltersSidebar";
import FavoriteButton from "../../components/common/FavoriteButton";

function VehiclesPage() {
  const [filters, setFilters] = useState({
    city: "",
    date: "",
    type: "",
    maxPrice: "",
  });

  const [advFilters, setAdvFilters] = useState({});

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
      date: nextFilters.date,
      type: nextFilters.type,
      maxPrice: nextFilters.maxPrice,
      // Map advanced filters
      transmission: (advFilters.transmission || []).join(","),
      unlimitedMileage: advFilters.unlimitedMileage ? "true" : "",
    });

    const data = await getVehicles(params);
    const mapped = (data?.results || []).map((c) => ({
      id: c._id,
      model: c.type,
      type: "vehicle",
      title: c.type,
      subtitle: c.city,
      linkUrl: `${PATHS.VEHICULOS}/${c._id}`,
      city: c.city,
      date: c.date,
      policy: c.available === false ? "No disponible" : "Disponible",
      price: c.price,
      imageUrl: c.imageUrl,
    }));
    setCars(shuffle(mapped));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [advFilters]);

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
          <FiltersSidebar
            category="vehicles"
            onFiltersChange={setAdvFilters}
            initialFilters={advFilters}
          />
        </aside>

        <div className="results">
          {cars.map((c) => (
            <article key={c.id} className="deal-card card" style={{ position: "relative" }}>
              <FavoriteButton item={c} />
              <div className="deal-img">
                <img
                  src={resolveImageUrl(c.imageUrl)}
                  alt={`${c.model} en ${c.city}`}
                  loading="lazy"
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
        </div>
      </div>
    </div>
  );
}

export default VehiclesPage;
