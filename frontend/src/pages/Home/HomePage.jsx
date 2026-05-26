import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PATHS } from "../../routes/paths";
import { getOffers } from "../../api/offers";
import { resolveImageUrl, imageFallback } from "../../utils/resolveImageUrl";
import "../../styles/HomeOffers.css";

import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import { showToast } from "../../utils/notify";

function HomePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [offers, setOffers] = useState([]);

  const [homeDestination, setHomeDestination] = useState("");
  const [homeStart, setHomeStart] = useState("");
  const [homeEnd, setHomeEnd] = useState("");

  const perks = [
    { id: 1, title: "Ofertas reales", text: "Precios competitivos y promos semanales." },
    { id: 2, title: "Cancelación flexible", text: "Opciones con cancelación gratuita." },
    { id: 3, title: "Atención 24/7", text: "Te ayudamos antes y durante el viaje." },
  ];

  useEffect(() => {
    async function load() {
      try {
        setError("");
        setLoading(true);
        const data = await getOffers();
        setOffers(data?.results || []);
      } catch (e) {
        setError(e?.response?.data?.message || "Error cargando ofertas");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Ofertas destacadas para Home (máx 6) -> mismas cards que la página de Ofertas
  const homeOffers = useMemo(() => {
    const mapped = (offers || []).map((o) => ({
      id: o._id,
      title: o.title,
      desc: o.description || "",
      tag: o.destination || o.type || "Oferta",
      price: o.price,
      imageUrl: o.imageUrl,
    }));

    // Prioriza las más baratas
    mapped.sort((a, b) => (a.price ?? 999999) - (b.price ?? 999999));
    return mapped.slice(0, 8);
  }, [offers]);

  // Promo: oferta destacada (la más barata)
  const featuredOffer = useMemo(() => {
    if (offers.length === 0) return null;
    const sorted = [...offers].sort((a, b) => (a.price ?? 999999) - (b.price ?? 999999));
    return sorted[0];
  }, [offers]);

  // Promo: “Semana de vuelos” (la más barata de tipo flight si existe)
  const weeklyFlight = useMemo(() => {
    const flights = offers.filter((o) => String(o.type || "").toLowerCase() === "flight");
    if (flights.length === 0) return null;
    const sorted = [...flights].sort((a, b) => (a.price ?? 999999) - (b.price ?? 999999));
    return sorted[0];
  }, [offers]);

  return (
    <div className="container">
      <section className="home-hero">
        <div className="home-hero-card">
          <h1>Encuentra tu próximo viaje</h1>
          <p className="muted">Vuelos, hoteles, paquetes y ofertas en un solo lugar.</p>

          <div className="home-quick-actions">
            <Link className="btn" to={PATHS.HOTELES}>Buscar Hoteles</Link>
            <Link className="btn secondary" to={PATHS.VUELOS}>Buscar Vuelos</Link>
            <Link className="btn ghost" to={PATHS.OFERTAS}>Ver Ofertas</Link>
          </div>

          <div className="home-search">
            <input
              className="input"
              placeholder="Destino (ej: Madrid)"
              value={homeDestination}
              onChange={(e) => setHomeDestination(e.target.value)}
            />
            <input
              className="input"
              type="date"
              value={homeStart}
              onChange={(e) => setHomeStart(e.target.value)}
            />
            <input
              className="input"
              type="date"
              value={homeEnd}
              onChange={(e) => setHomeEnd(e.target.value)}
            />
            <button
              className="btn"
              onClick={() => {
                // Búsqueda general del Home: por defecto enviamos al buscador de hoteles
                navigate(PATHS.HOTELES, {
                  state: {
                    prefill: {
                      city: homeDestination,
                      checkIn: homeStart,
                      checkOut: homeEnd,
                    },
                    autoSearch: true,
                  },
                });
              }}
            >
              Buscar
            </button>
          </div>

          <div className="home-chips">
            <span className="chip2">Cancelación gratis</span>
            <span className="chip2">Pago flexible</span>
            <span className="chip2">Mejor precio</span>
          </div>

          {loading && <p className="muted" style={{ marginTop: 10 }}>Cargando datos…</p>}
          {error && <p className="muted" style={{ marginTop: 10, color: "crimson" }}>{error}</p>}
        </div>

        <aside className="home-hero-aside">
          <div className="promo-card">
            <h3>Oferta destacada</h3>
            <p className="muted">
              {featuredOffer
                ? `${featuredOffer.title || "Oferta"}${featuredOffer.destination ? ` · ${featuredOffer.destination}` : ""}`
                : "Hotel 4★ en Madrid Centro"}
            </p>
            <div className="promo-price">
              {featuredOffer?.price != null ? `${featuredOffer.price}€` : "58€"}
            </div>
            <Link className="btn" to={PATHS.OFERTAS}>Ver ofertas</Link>
          </div>

          <div className="promo-card alt">
            <h3>Semana de vuelos</h3>
            <p className="muted">Europa desde</p>
            <div className="promo-price">
              {weeklyFlight?.price != null ? `${weeklyFlight.price}€` : "29€"}
            </div>
            <Link className="btn secondary" to={PATHS.VUELOS}>Buscar vuelos</Link>
          </div>
        </aside>
      </section>

      <section className="home-offers">
        <div className="home-offers-head">
          <h2 className="home-offers-title">Destinos populares</h2>
          <Link className="home-offers-link" to={PATHS.OFERTAS}>Ver todas las ofertas →</Link>
        </div>

        <div className="home-offers-grid">
          {(homeOffers.length ? homeOffers : []).slice(0, 8).map((o) => (
            <div className="home-offer-card" key={o.id}>
              <img
                className="home-offer-img"
                src={resolveImageUrl(o.imageUrl)}
                alt={o.title}
                loading="lazy"
                onError={imageFallback}
                />
              <div className="home-offer-body">
                <h3 className="home-offer-title">{o.tag}</h3>
                <p className="home-offer-desc">{o.desc || o.title}</p>

                <div className="home-offer-footer">
                  <span className="home-offer-price">desde {o.price}€</span>
                  <Link
                    className="home-offer-cta"
                    to={`${PATHS.OFERTAS}/${o.id}`}
                    state={{ fromDetailsButton: true }}
                  >
                    Ver
                  </Link>
                </div>
              </div>
            </div>
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
        <div className="newsletter-card">
          <div className="newsletter-left">
            <h2 className="newsletter-title">Recibe ofertas en tu correo</h2>
            <p className="newsletter-subtitle">Promos semanales y descuentos exclusivos.</p>
          </div>

          <form
            className="newsletter-form"
            onSubmit={(e) => {
              e.preventDefault();
              showToast("¡Suscripción enviada!", "success");
            }}
          >
            <Input
              className="newsletter-input"
              type="email"
              placeholder="tuemail@ejemplo.com"
              required
            />
            <Button className="btn newsletter-btn" type="submit">
              Suscribirme
            </Button>
          </form>
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
