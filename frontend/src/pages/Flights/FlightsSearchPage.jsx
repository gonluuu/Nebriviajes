import { useEffect, useState } from "react";
import FlightsSearchBar from "../../components/search/FlightsSearchBar";
import { getFlights } from "../../api/flights";
import { Link } from "react-router-dom";
import { PATHS } from "../../routes/paths";
import { resolveImageUrl } from "../../utils/resolveImageUrl";
import FiltersSidebar from "../../components/search/FiltersSidebar";
import FavoriteButton from "../../components/common/FavoriteButton";

function FlightsSearchPage() {
  const [filters, setFilters] = useState({
    origin: "",
    destination: "",
    departureDate: "",
    returnDate: "",
    maxPrice: "",
  });

  const [advFilters, setAdvFilters] = useState({});

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
      departureDate: nextFilters.departureDate,
      returnDate: nextFilters.returnDate,
      maxPrice: nextFilters.maxPrice,
      // Map advanced filters:
      stops: (advFilters.stops || []).join(","),
      includesLuggage: advFilters.includesLuggage ? "true" : "",
    });

    const data = await getFlights(params);

    const mapped = (data?.results || []).map((f) => {
      const dep = f.departureDate ? new Date(f.departureDate).toLocaleDateString("es-ES") : "";
      const ret = f.dateReturn ? new Date(f.dateReturn).toLocaleDateString("es-ES") : "";
      return {
        id: f._id,
        from: f.origin,
        to: f.destination,
        date: ret ? `${dep} - ${ret}` : dep,
        transportType: f.duration || "Vuelo",
        type: "flight",
        title: `${f.origin} a ${f.destination}`,
        subtitle: "Ida y vuelta",
        linkUrl: `${PATHS.VUELOS}/${f._id}`,
        passengers: "1 pasajero",
        flex: f.available === false ? "No disponible" : "Disponible",
        price: f.price,
        company: f.airline || "Aerolínea",
        imageUrl: f.imageUrl,
      };
    });

    setFlights(shuffle(mapped));
  }

  useEffect(() => {
    load();
  }, [advFilters]);


  return (
    <div className="container">
      <FlightsSearchBar
        value={filters}
        onChange={(patch) => setFilters((f) => ({ ...f, ...patch }))}
        onSearch={() => load()}
      />

      <div className="search-layout">
        <aside className="filters">
          <FiltersSidebar
            category="flights"
            onFiltersChange={setAdvFilters}
            initialFilters={advFilters}
          />
        </aside>

        <div className="results">
          {flights.map((f) => (
            <article key={f.id} className="transport-card card" style={{ position: "relative" }}>
              <FavoriteButton item={f} />
              <div className="deal-img">
                <img src={resolveImageUrl(f.imageUrl)} alt={`${f.from} a ${f.to}`} loading="lazy" />
              </div>

              <div className="transport-main">
                <h3 className="transport-title">
                  {f.from} → {f.to}
                </h3>
                <p className="muted">
                  {f.date} · {f.transportType} · {f.passengers}
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
        </div>
      </div>
    </div>
  );
}

export default FlightsSearchPage;
