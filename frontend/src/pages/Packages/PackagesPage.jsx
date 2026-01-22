import { PACKAGES } from "../../data/mockPackages";

function PackagesPage() {
  return (
    <div className="container">
      <h2>Paquetes</h2>
      <p className="muted">Vuelo + hotel + actividades, al mejor precio.</p>

      <div className="grid-cards">
        {PACKAGES.map((p) => (
          <article className="deal-card" key={p.id}>
            <div className="deal-img" />
            <div className="deal-info">
              <h3>{p.title}</h3>
              <p className="muted">{p.city} · {p.days} días</p>
              <span className="badge">{p.tag}</span>
            </div>
            <div className="deal-price">
              <div className="price">{p.price} €</div>
              <div className="muted">por persona</div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default PackagesPage;