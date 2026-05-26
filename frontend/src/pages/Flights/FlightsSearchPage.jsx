import { useEffect, useMemo, useState } from "react";
import FlightsSearchBar from "../../components/search/FlightsSearchBar";
import FlightsFiltersPanel, { DEFAULT_FLIGHTS_FILTERS } from "../../components/search/FlightsFiltersPanel";
import { getFlights } from "../../api/flights";
import { Link } from "react-router-dom";
import { PATHS } from "../../routes/paths";
import { resolveImageUrl, imageFallback } from "../../utils/resolveImageUrl";

function parseDurationToMinutes(value) {
  if (value == null) return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  const str = String(value);
  let total = 0;
  const h = str.match(/(\d+)\s*h/i);
  if (h) total += Number(h[1]) * 60;
  const m = str.match(/(\d+)\s*m/i);
  if (m) total += Number(m[1]);
  return total || null;
}

function FlightsSearchPage() {
  const [filters, setFilters] = useState({
    origin: "",
    destination: "",
    departureDate: "",
    returnDate: "",
    maxPrice: "",
  });

  const [advancedFilters, setAdvancedFilters] = useState(DEFAULT_FLIGHTS_FILTERS);
  const [flights, setFlights] = useState([]);

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
      startDate: nextFilters.departureDate,
      endDate: nextFilters.returnDate,
      maxPrice: nextFilters.maxPrice,
    });

    const data = await getFlights(params);

    const mapped = (data?.results || []).map((f) => {
      const dep = f.departureDate ? new Date(f.departureDate).toLocaleDateString("es-ES") : "";
      const ret = f.dateReturn ? new Date(f.dateReturn).toLocaleDateString("es-ES") : "";
      const stopsRaw = typeof f.stops === "number" ? f.stops
        : typeof f.transfers === "number" ? f.transfers
        : null;
      return {
        id: f._id,
        from: f.origin,
        to: f.destination,
        date: ret ? `${dep} - ${ret}` : dep,
        type: f.duration || "Vuelo",
        passengers: "1 pasajero",
        flex: f.available === false ? "No disponible" : "Disponible",
        price: f.price,
        company: f.airline || "Aerolínea",
        imageUrl: f.imageUrl,
        _departureHour: f.departureDate ? new Date(f.departureDate).getHours() : null,
        _durationMinutes: parseDurationToMinutes(f.duration ?? f.durationMinutes),
        _stops: stopsRaw,
        _baggage: f.luggageIncluded ?? f.baggageIncluded ?? null,
      };
    });

    setFlights(shuffle(mapped));
  }

  useEffect(() => {
    load();
  }, []);

  const visibleFlights = useMemo(() => {
    return flights.filter((f) => {
      if (advancedFilters.timeSlots.length > 0) {
        if (f._departureHour == null) return false;
        const matches = advancedFilters.timeSlots.some((slot) => {
          if (slot === "morning") return f._departureHour >= 6 && f._departureHour < 12;
          if (slot === "afternoon") return f._departureHour >= 12 && f._departureHour < 18;
          if (slot === "night") return f._departureHour >= 18 || f._departureHour < 6;
          return false;
        });
        if (!matches) return false;
      }

      if (advancedFilters.airlines.length > 0) {
        const airline = String(f.company || "").toLowerCase();
        const ok = advancedFilters.airlines.some((a) => airline.includes(a.toLowerCase()));
        if (!ok) return false;
      }

      if (advancedFilters.maxDuration < 1440 && f._durationMinutes != null) {
        if (f._durationMinutes > advancedFilters.maxDuration) return false;
      }

      if (advancedFilters.stops.length > 0 && f._stops != null) {
        const bucket = f._stops === 0 ? "direct" : f._stops === 1 ? "1" : "2plus";
        if (!advancedFilters.stops.includes(bucket)) return false;
      }

      if (advancedFilters.baggageIncluded && f._baggage !== true) return false;

      return true;
    });
  }, [flights, advancedFilters]);


  return (
    <div className="container">
      <FlightsSearchBar
        value={filters}
        onChange={(patch) => setFilters((f) => ({ ...f, ...patch }))}
        onSearch={() => load()}
      />

      <div className="search-layout">
        <aside className="filters">
          <FlightsFiltersPanel
            value={advancedFilters}
            onChange={(patch) => setAdvancedFilters((f) => ({ ...f, ...patch }))}
            onReset={() => setAdvancedFilters(DEFAULT_FLIGHTS_FILTERS)}
          />
        </aside>

        <div className="results">
          {visibleFlights.map((f) => (
            <article key={f.id} className="transport-card card">
              <div className="deal-img">
                <img src={resolveImageUrl(f.imageUrl)} alt={`${f.from} a ${f.to}`} loading="lazy"   onError={imageFallback}
                  />
              </div>

              <div className="transport-main">
                <h3 className="transport-title">
                  {f.from} → {f.to}
                </h3>
                <p className="muted">
                  {f.date} · {f.type} · {f.passengers}
                </p>
                <span className="badge">{f.flex}</span>
              </div>

              <div className="transport-side">
                <div className="price">{f.price} €</div>
                <div className="muted">{f.company}</div>
                <Link
                  to={`${PATHS.VUELOS}/${f.id}`}
                  state={{ fromDetailsButton: true }}
                  className="hotel-btn"
                >
                  Ver detalles
                </Link>
              </div>
            </article>
          ))}
          {visibleFlights.length === 0 && flights.length > 0 ? (
            <p className="muted">No hay vuelos que cumplan los filtros seleccionados.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default FlightsSearchPage;
