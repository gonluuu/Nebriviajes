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

      
      <section className="section" id="faq">
        <h2>Preguntas frecuentes</h2>

        <div className="faq">
          <details className="faq-item">
            <summary>¿Cómo funciona la reserva en Nebrivajes?</summary>
            <p className="muted">
              Solo tienes que buscar (hotel, vuelo, tren o paquete), comparar resultados y
              seleccionar la opción que más te convenga. Durante la reserva verás el
              precio final, condiciones (cancelación, cambios, equipaje, etc.) y los datos
              del proveedor. Al confirmar, recibirás un correo con el resumen y podrás
              consultar tus reservas desde “Mi Cuenta”.
            </p>
          </details>

          <details className="faq-item">
            <summary>¿Puedo cancelar gratis?</summary>
            <p className="muted">
              Depende del producto y la tarifa. En hoteles, verás la etiqueta
              “Cancelación gratuita” cuando aplique y también la fecha límite para cancelar
              sin coste. En vuelos y trenes, algunas tarifas permiten cambios o reembolso,
              mientras que otras tienen penalización. Te mostramos siempre las condiciones
              antes de pagar para que sepas exactamente qué incluye tu reserva.
            </p>
          </details>

          <details className="faq-item">
            <summary>¿Qué métodos de pago aceptáis?</summary>
            <p className="muted">
              Normalmente puedes pagar con tarjeta (débito/crédito). En algunas ofertas
              también puede haber opciones de pago flexible o pago en el alojamiento.
              En el proceso de compra se te mostrarán las opciones disponibles según el
              proveedor y el tipo de reserva.
            </p>
          </details>

          <details className="faq-item">
            <summary>¿Es seguro pagar en la web?</summary>
            <p className="muted">
              Sí. Usamos conexión segura (HTTPS) y no almacenamos tu contraseña en texto
              plano: se guarda cifrada. Además, revisamos proveedores y condiciones para
              reducir riesgos. Si detectas algún error en tu reserva o un cobro inesperado,
              contacta con soporte para revisarlo cuanto antes.
            </p>
          </details>

          <details className="faq-item">
            <summary>¿Cómo creo una cuenta y qué ventajas tengo?</summary>
            <p className="muted">
              Pulsa en “Crear Cuenta”, introduce tus datos y confirma. Con una cuenta
              puedes guardar preferencias, tener acceso rápido a tus reservas, recibir
              ofertas personalizadas y completar futuras compras más rápido. Si olvidas
              la contraseña, podrás recuperarla desde la pantalla de inicio de sesión
              (cuando esté habilitada la opción).
            </p>
          </details>

          <details className="faq-item">
            <summary>¿Cómo puedo contactar con soporte?</summary>
            <p className="muted">
              Puedes usar la sección “Contacto” para enviar tu consulta. También estamos
              preparando un sistema de soporte 24/7 con chat y correo. Para que podamos
              ayudarte más rápido, incluye: número de reserva (si existe), fechas del viaje
              y el correo con el que hiciste la compra.
            </p>
          </details>
        </div>
      </section>


    </div>
  );
}

export default HomePage;