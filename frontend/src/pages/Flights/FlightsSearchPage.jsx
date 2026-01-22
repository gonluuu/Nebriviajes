import FlightsSearchBar from "../../components/search/FlightsSearchBar";
import { FLIGHTS } from "../../data/mockFlights";

function FlightsSearchPage() {
  return (
    <div className="container">
      <FlightsSearchBar />

      <div className="results">
        {FLIGHTS.map((f) => (
          <article className="flight-card" key={f.id}>
            <div className="flight-main">
              <h3 className="flight-title">
                {f.from} → {f.to}
              </h3>
              <p className="muted">
                {f.date} · {f.type} · {f.passengers}
              </p>
              <span className="badge">{f.flex}</span>
            </div>

            <div className="flight-price">
              <div className="price">{f.price} €</div>
              <div className="muted">{f.company}</div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default FlightsSearchPage;
