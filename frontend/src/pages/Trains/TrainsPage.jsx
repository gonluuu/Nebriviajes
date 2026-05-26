import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PATHS } from "../../routes/paths";
import TrainsSearchBar from "../../components/search/TrainsSearchBar";
import TrainsFiltersPanel, {
  DEFAULT_TRAINS_FILTERS,
  MAX_DURATION_MINUTES,
} from "../../components/search/TrainsFiltersPanel";
import { getTrains } from "../../api/trains";
import { resolveImageUrl, imageFallback } from "../../utils/resolveImageUrl";
import { normalize } from "../../utils/filterHelpers";

function TrainsPage() {
  const [filters, setFilters] = useState({
    origin: "",
    destination: "",
    startDate: "",
    endDate: "",
    maxPrice: "",
    direct: false,
  });

  const [advancedFilters, setAdvancedFilters] = useState(DEFAULT_TRAINS_FILTERS);
  const [trains, setTrains] = useState([]);

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
      origin: nextFilters.origin,
      destination: nextFilters.destination,
      startDate: nextFilters.startDate,
      endDate: nextFilters.endDate,
      maxPrice: nextFilters.maxPrice,
      direct: nextFilters.direct ? "true" : "",
    });

    const data = await getTrains(params);

    const mapped = (data?.results || []).map((t) => ({
      id: t._id,
      from: t.origin,
      to: t.destination,
      date: t.date || "",
      class: "Estándar",
      duration: t.duration || "",
      tag: t.direct ? "Directo" : "Con paradas",
      price: t.price,
      company: t.available === false ? "No disponible" : "Disponible",
      imageUrl: t.imageUrl,
      _classes: Array.isArray(t.classes) ? t.classes.map(normalize) : null,
      _company: t.railCompany != null ? normalize(t.railCompany) : null,
      _direct: typeof t.direct === "boolean"
        ? t.direct
        : typeof t.transfers === "number"
          ? t.transfers === 0
          : null,
      _durationMinutes: typeof t.durationMinutes === "number" ? t.durationMinutes : null,
    }));

    setTrains(shuffle(mapped));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visibleTrains = useMemo(() => {
    const directRequired = advancedFilters.onlyDirect || filters.direct;

    return trains.filter((t) => {
      if (advancedFilters.classes.length > 0 && t._classes != null) {
        const hasAny = advancedFilters.classes.some((id) =>
          t._classes.some((cls) => cls.includes(id))
        );
        if (!hasAny) return false;
      }

      if (advancedFilters.companies.length > 0 && t._company != null) {
        const ok = advancedFilters.companies.some((co) => t._company.includes(normalize(co)));
        if (!ok) return false;
      }

      if (directRequired && t._direct === false) return false;

      if (advancedFilters.maxDurationMinutes < MAX_DURATION_MINUTES && t._durationMinutes != null) {
        if (t._durationMinutes > advancedFilters.maxDurationMinutes) return false;
      }

      return true;
    });
  }, [trains, advancedFilters, filters.direct]);

  return (
    <div className="container">
      <h2>Trenes</h2>
      <p className="muted">Viaja cómodo y rápido por Europa y España.</p>

      <TrainsSearchBar
        value={filters}
        onChange={(patch) => setFilters((f) => ({ ...f, ...patch }))}
        onSearch={() => load()}
      />

      <div className="search-layout">
        <aside className="filters">
          <TrainsFiltersPanel
            value={advancedFilters}
            onChange={(patch) => setAdvancedFilters((f) => ({ ...f, ...patch }))}
            onReset={() => setAdvancedFilters(DEFAULT_TRAINS_FILTERS)}
          />
        </aside>

        <div className="results">
          {visibleTrains.map((t) => (
              <article key={t.id} className="transport-card card">
                <div className="deal-img">
                  <img src={resolveImageUrl(t.imageUrl)} alt={`${t.from} a ${t.to}`} loading="lazy"   onError={imageFallback}
                  />
                </div>

                <div className="transport-main">
                  <h3 className="transport-title">
                    {t.from} → {t.to}
                  </h3>
                  <p className="muted">
                    {t.date} · {t.class} · {t.duration}
                  </p>
                  <span className="badge">{t.tag}</span>
                </div>
                <div className="transport-side">
                  <div className="price">{t.price} €</div>
                  <div className="muted">{t.company}</div>
                  <Link
                    to={`${PATHS.TRENES}/${t.id}`}
                    state={{ fromDetailsButton: true }}
                    className="hotel-btn"
                  >
                    Ver detalles
                  </Link>
                </div>
              </article>
          ))}
          {visibleTrains.length === 0 && trains.length > 0 ? (
            <p className="muted">No hay trenes que cumplan los filtros seleccionados.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default TrainsPage;
