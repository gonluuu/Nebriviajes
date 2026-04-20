import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { PATHS } from "../../routes/paths";
import TrainsSearchBar from "../../components/search/TrainsSearchBar";
import FiltersSidebar from "../../components/search/FiltersSidebar";
import FavoriteButton from "../../components/common/FavoriteButton";
import { getTrains } from "../../api/trains";
import { resolveImageUrl } from "../../utils/resolveImageUrl";

function shuffle(list) {
  const result = [];
  const copy = [...list];
  while (copy.length > 0) {
    const randomIndex = Math.floor(Math.random() * copy.length);
    result.push(copy[randomIndex]);
    copy.splice(randomIndex, 1);
  }
  return result;
}

function TrainsPage() {
  const [filters, setFilters] = useState({
    origin: "",
    destination: "",
    date: "",
    maxPrice: "",
    direct: false,
  });

  const [advFilters, setAdvFilters] = useState({});
  const [trains, setTrains] = useState([]);

  const cleanParams = (obj) =>
    Object.fromEntries(
      Object.entries(obj).filter(([, v]) => String(v).trim() !== "")
    );

  const handleAdvFiltersChange = useCallback((newAdvFilters) => {
    setAdvFilters(newAdvFilters);
  }, []);

  async function load(nextFilters = filters, nextAdv = advFilters) {
    // Serialize advanced filter arrays to comma-separated strings
    const serializedAdv = {};
    for (const [key, value] of Object.entries(nextAdv)) {
      if (Array.isArray(value)) {
        serializedAdv[key] = value.join(",");
      } else {
        serializedAdv[key] = String(value);
      }
    }

    const params = cleanParams({
      origin: nextFilters.origin,
      destination: nextFilters.destination,
      date: nextFilters.date,
      maxPrice: nextFilters.maxPrice,
      direct: nextFilters.direct ? "true" : "",
      ...serializedAdv,
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
    }));

    setTrains(shuffle(mapped));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-fetch when advanced filters change
  useEffect(() => {
    load(filters, advFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [advFilters]);

  const totalResults = trains.length;

  return (
    <div className="container">
      <h2>Trenes</h2>
      <p className="muted">Viaja cómodo y rápido por Europa y España.</p>

      <TrainsSearchBar
        value={filters}
        onChange={(patch) => setFilters((f) => ({ ...f, ...patch }))}
        onSearch={() => load()}
      />

      <FiltersSidebar
        category="trains"
        onFiltersChange={handleAdvFiltersChange}
      />

      <p className="muted" style={{ marginTop: "12px" }}>
        Mostrando <strong>{totalResults}</strong> resultado{totalResults !== 1 ? "s" : ""}
      </p>

      <div className="results">
        {trains.map((t) => (
            <article key={t.id} className="transport-card card">
              <div className="deal-img" style={{ position: "relative" }}>
                <img src={resolveImageUrl(t.imageUrl)} alt={`${t.from} a ${t.to}`} loading="lazy" />
                <FavoriteButton item={{
                  id: t.id,
                  type: "train",
                  title: `${t.from} → ${t.to}`,
                  subtitle: t.date,
                  price: t.price,
                  imageUrl: t.imageUrl,
                  linkUrl: `${PATHS.TRENES}/${t.id}`
                }} />
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
      </div>
    </div>
  );
}

export default TrainsPage;
