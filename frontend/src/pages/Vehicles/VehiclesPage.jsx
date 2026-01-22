import { CARS } from "../../data/mockVehicles";

function VehiclesPage() {
  return (
    <div className="container">
      <h2>Vehículos</h2>
      <p className="muted">Alquila coche al mejor precio.</p>

      <div className="grid-cards">
        {CARS.map((c) => (
          <article className="deal-card" key={c.id}>
            <div className="deal-img" />
            <div className="deal-info">
              <h3>{c.model}</h3>
              <p className="muted">{c.city} · {c.days} días</p>
              <span className="badge">{c.policy}</span>
            </div>
            <div className="deal-price">
              <div className="price">{c.price} €</div>
              <div className="muted">total</div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default VehiclesPage;
