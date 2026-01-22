import { TRAINS } from "../../data/mockTrains";

function TrainsPage() {
  return (
    <div className="container">
      <h2>Trenes</h2>
      <p className="muted">Viaja cómodo y rápido por Europa y España.</p>

      <div className="results">
        {TRAINS.map((t) => (
          <article className="flight-card" key={t.id}>
            <div className="flight-main">
              <h3 className="flight-title">{t.from} → {t.to}</h3>
              <p className="muted">{t.date} · {t.class} · {t.duration}</p>
              <span className="badge">{t.tag}</span>
            </div>
            <div className="flight-price">
              <div className="price">{t.price} €</div>
              <div className="muted">{t.company}</div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default TrainsPage;