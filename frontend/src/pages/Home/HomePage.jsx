import { Link } from "react-router-dom";
import { PATHS } from "../../routes/paths";

function HomePage() {
  const destinations = [
    { id: 1, city: "París", tag: "Escapada romántica", price: "desde 99€" },
    { id: 2, city: "Roma", tag: "Historia y comida", price: "desde 89€" },
    { id: 3, city: "Londres", tag: "City break", price: "desde 110€" },
    { id: 4, city: "Mallorca", tag: "Sol y playa", price: "desde 75€" },
  ];

  const perks = [
    { id: 1, title: "Ofertas reales", text: "Precios competitivos y promos semanales." },
    { id: 2, title: "Cancelación flexible", text: "Opciones con cancelación gratuita." },
    { id: 3, title: "Atención 24/7", text: "Te ayudamos antes y durante el viaje." },
  ];

  return (
    <div className="container">
      {/* HERO */}
      <section className="home-hero">
        <div className="home-hero-card">
          <h1>Encuentra tu próximo viaje</h1>
          <p className="muted">
            Vuelos, hoteles, paquetes y ofertas en un solo lugar.
          </p>

          <div className="home-quick-actions">
            <Link className="btn" to={PATHS.HOTELES}>Buscar Hoteles</Link>
            <Link className="btn secondary" to={PATHS.VUELOS}>Buscar Vuelos</Link>
            <Link className="btn ghost" to={PATHS.OFERTAS}>Ver Ofertas</Link>
          </div>

          {/* Buscador rápido */}
          <div className="home-search">
            <input className="input" placeholder="Destino (ej: Madrid)" />
            <input className="input" type="date" />
            <input className="input" type="date" />
            <button className="btn">Buscar</button>
          </div>

          <div className="home-chips">
            <span className="chip2">Cancelación gratis</span>
            <span className="chip2">Pago flexible</span>
            <span className="chip2">Mejor precio</span>
          </div>
        </div>

        <aside className="home-hero-aside">
          <div className="promo-card">
            <h3>Oferta destacada</h3>
            <p className="muted">Hotel 4★ en Madrid Centro</p>
            <div className="promo-price">58€</div>
            <Link className="btn" to={PATHS.HOTELES}>Ver hoteles</Link>
          </div>

          <div className="promo-card alt">
            <h3>Semana de vuelos</h3>
            <p className="muted">Europa desde</p>
            <div className="promo-price">29€</div>
            <Link className="btn secondary" to={PATHS.VUELOS}>Buscar vuelos</Link>
          </div>
        </aside>
      </section>

      {/* DESTINOS */}
      <section className="section">
        <div className="section-head">
          <h2>Destinos populares</h2>
          <Link className="link-mini" to={PATHS.OFERTAS}>Ver todas las ofertas →</Link>
        </div>

        <div className="dest-grid">
          {destinations.map((d) => (
            <article key={d.id} className="dest-card">
              <div className="dest-img" />
              <div className="dest-info">
                <h3>{d.city}</h3>
                <p className="muted">{d.tag}</p>
                <div className="dest-bottom">
                  <span className="badge">{d.price}</span>
                  <Link className="link-mini" to={PATHS.OFERTAS}>Ver</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* POR QUÉ NOSOTROS */}
      <section className="section">
        <h2>¿Por qué confiar en nosotros?</h2>
        <div className="cards">
          {perks.map((p) => (
            <div key={p.id} className="card card-pro">
              <div className="card-title">{p.title}</div>
              <div className="muted">{p.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="section">
        <div className="newsletter">
          <div>
            <h2>Recibe ofertas en tu correo</h2>
            <p className="muted">Promos semanales y descuentos exclusivos.</p>
          </div>
          <div className="newsletter-form">
            <input className="input" type="email" placeholder="tuemail@ejemplo.com" />
            <button className="btn">Suscribirme</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;