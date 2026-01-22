import { CRUISES } from "../../data/mockCruises";

function CruisesPage() {
  return (
    <div className="container">
      <h2>Cruceros</h2>
      <p className="muted">Rutas por el Mediterráneo, Caribe y más.</p>

      <div className="grid-cards">
        {CRUISES.map((c) => (
          <article className="deal-card" key={c.id}>
            <div className="deal-img" />
            <div className="deal-info">
              <h3>{c.route}</h3>
              <p className="muted">{c.nights} noches · {c.ship}</p>
              <span className="badge">{c.tag}</span>
            </div>
            <div className="deal-price">
              <div className="price">{c.price} €</div>
              <div className="muted">por persona</div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default CruisesPage;