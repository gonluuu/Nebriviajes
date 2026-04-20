import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { PATHS } from "../../routes/paths";
import CruisesSearchBar from "../../components/search/CruisesSearchBar";
import FiltersSidebar from "../../components/search/FiltersSidebar";
import FavoriteButton from "../../components/common/FavoriteButton";
import { getCruises } from "../../api/cruises";
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

function CruisesPage() {
  const [filters, setFilters] = useState({
    origin: "",
    destination: "",
    minDuration: "",
    maxPrice: "",
  });

  const [advFilters, setAdvFilters] = useState({});
  const [cruises, setCruises] = useState([]);
  const [error, setError] = useState("");

  const cleanParams = (obj) =>
    Object.fromEntries(
      Object.entries(obj).filter(([, v]) => String(v ?? "").trim() !== "")
    );

  const handleAdvFiltersChange = useCallback((newAdvFilters) => {
    setAdvFilters(newAdvFilters);
  }, []);

  async function load(nextFilters = filters, nextAdv = advFilters) {
    try {
      setError("");

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
        minDuration: nextFilters.minDuration,
        maxPrice: nextFilters.maxPrice,
        ...serializedAdv,
      });

      const data = await getCruises(params);

      const mapped = (data?.results || []).map((c) => {
        const id = c?._id || c?.id;
        const title = c?.name || c?.title || c?.type || "Crucero";
        const origin = c?.origin || c?.from || "";
        const destination = c?.destination || c?.to || "";
        const route =
          origin && destination ? `${origin} → ${destination}` : (c?.route || "");
        const nights = c?.durationDays ?? c?.nights ?? c?.duration ?? "";
        const ship = c?.ship || c?.company || c?.boat || "";
        const tag =
          c?.available === false ? "No disponible" : (c?.type || "Disponible");
        const price = c?.priceFrom ?? c?.price ?? c?.price_per_person ?? "";

        return {
          id,
          title,
          route,
          nights,
          ship,
          tag,
          price,
          imageUrl: c?.imageUrl,
        };
      }).filter(x => x.id);

      setCruises(shuffle(mapped));
    } catch (e) {
      console.error(e);
      setError("No se pudieron cargar los cruceros");
    }
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

  const totalResults = cruises.length;

  return (
    <div className="container">
      <h2>Cruceros</h2>
      <p className="muted">Rutas por el Mediterráneo, Caribe y más.</p>

      <CruisesSearchBar
        value={filters}
        onChange={(patch) => setFilters((f) => ({ ...f, ...patch }))}
        onSearch={() => load()}
      />

      <FiltersSidebar
        category="cruises"
        onFiltersChange={handleAdvFiltersChange}
      />

      <p className="muted" style={{ marginTop: "12px" }}>
        Mostrando <strong>{totalResults}</strong> resultado{totalResults !== 1 ? "s" : ""}
      </p>

      {error ? <p>{error}</p> : null}

      <div className="grid-cards">
        {cruises.map((c) => (
            <article key={c.id} className="deal-card card">
              <div className="deal-img" style={{ position: "relative" }}>
                <img
                  src={resolveImageUrl(c.imageUrl) || "/placeholder.jpg"}
                  alt={c.title}
                  loading="lazy"
                />
                <FavoriteButton item={{
                  id: c.id,
                  type: "cruise",
                  title: c.title,
                  subtitle: c.route,
                  price: c.price,
                  imageUrl: c.imageUrl,
                  linkUrl: `${PATHS.CRUCEROS}/${c.id}`
                }} />
              </div>

              <div className="deal-info">
                <h3>{c.title}</h3>
                <p className="muted">
                  {c.route ? `${c.route} · ` : ""}
                  {c.nights ? `${c.nights} noches` : ""}
                  {c.ship ? ` · ${c.ship}` : ""}
                </p>
                <span className="badge">{c.tag}</span>
              </div>

              <div className="deal-price">
                <div className="price">{c.price !== "" ? `${c.price} €` : "—"}</div>
                <div className="muted">por persona</div>
                <Link
                  to={`${PATHS.CRUCEROS}/${c.id}`}
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

export default CruisesPage;
