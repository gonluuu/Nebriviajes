import { useEffect, useState } from "react";
import { getPackages } from "../../api/packages";
import { Link } from "react-router-dom";
import { PATHS } from "../../routes/paths";
import { resolveImageUrl, imageFallback } from "../../utils/resolveImageUrl";

function PackagesPage() {
  const [packages, setPackages] = useState([]);
  const [filters, setFilters] = useState({ startDate: "", endDate: "" });


function shuffle(list) {
  const result = [];

  while (list.length > 0) {
    const randomIndex = Math.floor(Math.random() * list.length);
    result.push(list[randomIndex]);
    list.splice(randomIndex, 1);
  }

  return result;
}

  const cleanParams = (obj) =>
    Object.fromEntries(
      Object.entries(obj).filter(([, v]) => String(v ?? "").trim() !== "")
    );

  async function load(nextFilters = filters) {
    try {
      const params = cleanParams({
        startDate: nextFilters.startDate,
        endDate: nextFilters.endDate,
      });
      const data = await getPackages(params);
      const mapped = (data?.results || []).map((p) => ({
        id: p._id,
        title: p.title,
        city: p.destination,
        days: p.durationDays,
        tag: p.available === false ? "No disponible" : "Disponible",
        price: p.price,
        imageUrl: p.imageUrl,
      }));
      setPackages(shuffle(mapped));
    } catch (e) {
      setPackages([]);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container">
      <h2>Paquetes</h2>
      <p className="muted">Vuelo + hotel + actividades, al mejor precio.</p>

      <div className="searchbar flightsbar">
        <label className="searchfield">
          <input
            className="input"
            type="date"
            aria-label="Desde"
            value={filters.startDate}
            onChange={(e) => setFilters((f) => ({ ...f, startDate: e.target.value }))}
          />
        </label>
        <label className="searchfield">
          <input
            className="input"
            type="date"
            aria-label="Hasta"
            value={filters.endDate}
            onChange={(e) => setFilters((f) => ({ ...f, endDate: e.target.value }))}
          />
        </label>
        <button type="button" className="searchbtn maroon" onClick={() => load()}>
          Buscar
        </button>
      </div>

      <div className="grid-cards">
        {packages.map((p) => (
            <article key={p.id} className="deal-card card">
              <div className="deal-img">
                <img
                  src={resolveImageUrl(p.imageUrl)}
                  alt={p.title}
                  loading="lazy"
                  onError={imageFallback}
                />
              </div>
              <div className="deal-info">
                <h3>{p.title}</h3>
                <p className="muted">{p.city} · {p.days} días</p>
                <span className="badge">{p.tag}</span>
              </div>
              <div className="deal-price">
                <div className="price">{p.price} €</div>
                <div className="muted">por persona</div>
                <Link
                  to={`${PATHS.PAQUETES}/${p.id}`}
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

export default PackagesPage;
