import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PATHS } from "../../routes/paths";
import CruisesSearchBar from "../../components/search/CruisesSearchBar";
import CruisesFiltersPanel, {
  DEFAULT_CRUISES_FILTERS,
  MAX_DURATION_DAYS,
} from "../../components/search/CruisesFiltersPanel";
import { getCruises } from "../../api/cruises";
import { resolveImageUrl, imageFallback } from "../../utils/resolveImageUrl";
import { normalize } from "../../utils/filterHelpers";

function CruisesPage() {
  const [filters, setFilters] = useState({
    origin: "",
    destination: "",
    startDate: "",
    endDate: "",
    minDuration: "",
    maxPrice: "",
  });

  const [advancedFilters, setAdvancedFilters] = useState(DEFAULT_CRUISES_FILTERS);
  const [cruises, setCruises] = useState([]);
  const [error, setError] = useState("");

  const cleanParams = (obj) =>
    Object.fromEntries(
      Object.entries(obj).filter(([, v]) => String(v ?? "").trim() !== "")
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
    try {
      setError("");
      const params = cleanParams({
        origin: nextFilters.origin,
        destination: nextFilters.destination,
        startDate: nextFilters.startDate,
        endDate: nextFilters.endDate,
        minDuration: nextFilters.minDuration,
        maxPrice: nextFilters.maxPrice,
      });

      const data = await getCruises(params);

      const mapped = (data?.results || []).map((c) => {
        const id = c?._id || c?.id;

        const title = c?.name || c?.title || c?.type || "Crucero";

        const origin = c?.origin || c?.from || "";
        const destination = c?.destination || c?.to || "";

        const route =
          origin && destination ? `${origin} → ${destination}` : (c?.route || "");

        const durationDays = c?.durationDays ?? c?.duration_days ?? null;
        const nights = durationDays ?? c?.nights ?? c?.duration ?? "";

        const ship = c?.ship || c?.company || c?.boat || "";

        const tag =
          c?.available === false ? "No disponible" : (c?.type || "Disponible");

        const price = c?.priceFrom ?? c?.price ?? c?.price_per_person ?? "";

        const cruiseLineRaw = c?.cruiseLine ?? c?.cruise_line ?? c?.ship ?? null;

        return {
          id,
          title,
          route,
          nights,
          ship,
          tag,
          price,
          imageUrl: c?.imageUrl,
          _searchableType: normalize(
            [c?.name, c?.destination, c?.region, c?.type, c?.origin].filter(Boolean).join(" ")
          ),
          _amenities: Array.isArray(c?.amenities)
            ? c.amenities.map(normalize)
            : null,
          _durationDays: typeof durationDays === "number" ? durationDays : null,
          _cruiseLine: cruiseLineRaw != null ? normalize(cruiseLineRaw) : null,
        };
      }).filter(x => x.id); // por si viene algún item sin id

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

  const visibleCruises = useMemo(() => {
    return cruises.filter((c) => {
      if (advancedFilters.cruiseTypes.length > 0) {
        const ok = advancedFilters.cruiseTypes.some((t) => c._searchableType.includes(t));
        if (!ok) return false;
      }

      if (advancedFilters.amenities.length > 0 && c._amenities != null) {
        const hasAll = advancedFilters.amenities.every((a) =>
          c._amenities.some((rowAmenity) => rowAmenity.includes(a))
        );
        if (!hasAll) return false;
      }

      if (advancedFilters.maxDurationDays < MAX_DURATION_DAYS && c._durationDays != null) {
        if (c._durationDays > advancedFilters.maxDurationDays) return false;
      }

      if (advancedFilters.cruiseLines.length > 0 && c._cruiseLine != null) {
        const ok = advancedFilters.cruiseLines.some((line) => c._cruiseLine.includes(normalize(line)));
        if (!ok) return false;
      }

      return true;
    });
  }, [cruises, advancedFilters]);

  return (
    <div className="container">
      <h2>Cruceros</h2>
      <p className="muted">Rutas por el Mediterráneo, Caribe y más.</p>

      <CruisesSearchBar
        value={filters}
        onChange={(patch) => setFilters((f) => ({ ...f, ...patch }))}
        onSearch={() => load()}
      />

      {error ? <p>{error}</p> : null}

      <div className="search-layout">
        <aside className="filters">
          <CruisesFiltersPanel
            value={advancedFilters}
            onChange={(patch) => setAdvancedFilters((f) => ({ ...f, ...patch }))}
            onReset={() => setAdvancedFilters(DEFAULT_CRUISES_FILTERS)}
          />
        </aside>

        <div className="grid-cards">
          {visibleCruises.map((c) => (
              <article key={c.id} className="deal-card card">
                <div className="deal-img">
                  <img
                    src={resolveImageUrl(c.imageUrl) || "/placeholder.jpg"}
                    alt={c.title}
                    loading="lazy"
                    onError={imageFallback}
                  />
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
          {visibleCruises.length === 0 && cruises.length > 0 ? (
            <p className="muted">No hay cruceros que cumplan los filtros seleccionados.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default CruisesPage;
