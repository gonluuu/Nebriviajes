import { OFFERS } from "../../data/mockOffers";

function OffersPage() {
  return (
    <div className="container">
      <h2>Ofertas</h2>
      <p className="muted">Descuentos y promociones por tiempo limitado.</p>

      <div className="grid-cards">
        {OFFERS.map((o) => (
          <article className="deal-card" key={o.id}>
            <div className="deal-img" />
            <div className="deal-info">
              <h3>{o.title}</h3>
              <p className="muted">{o.desc}</p>
              <span className="badge">{o.tag}</span>
            </div>
            <div className="deal-price">
              <div className="price">{o.price} €</div>
              <div className="muted">desde</div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default OffersPage;