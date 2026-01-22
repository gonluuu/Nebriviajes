import HotelsSearchBar from "../../components/search/HotelsSearchBar.jsx";
import FiltersPanel from "../../components/search/FiltersPanel.jsx";
import { HOTELS } from "../../data/mockHotels.js";

function HotelsSearchPage() {
  return (
    <div className="container">
      <HotelsSearchBar />

      <div className="search-grid">
        <aside>
          <FiltersPanel />
        </aside>

        <section className="results">
          {HOTELS.map((h) => (
            <article className="hotel-card" key={h.id}>
              <div className="hotel-img" />
              <div className="hotel-info">
                <h3>
                  {h.name} <span className="stars">{h.stars}</span>
                </h3>
                <p className="muted">{h.city} · {h.distance}</p>
                <span className="badge">Cancelación gratuita</span>
              </div>
              <div className="hotel-price">
                <div className="price">{h.price} €</div>
                <div className="muted">{h.priceNight} € por noche</div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}

export default HotelsSearchPage;