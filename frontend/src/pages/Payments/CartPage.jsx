import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { PATHS } from "../../routes/paths";
import { useAuthStore } from "../../store/useAuthStore";
import { useCartStore } from "../../store/useCartStore";
import { startCheckout } from "../../api/payments";
import { resolveImageUrl, imageFallback } from "../../utils/resolveImageUrl";
import { formatType } from "../../utils/cartItems";
import "../../styles/Checkout.css";

export default function CartPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { items, removeItem, clearCart } = useCartStore();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const total = items.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

  async function handleCheckout() {
    setError("");

    if (!user) {
      navigate(PATHS.LOGIN);
      return;
    }

    if (!items.length) {
      setError("Tu carrito esta vacio.");
      return;
    }

    try {
      setBusy(true);
      await startCheckout(items);
    } catch (err) {
      setError(err?.message || "No se pudo iniciar el pago con Stripe.");
      setBusy(false);
    }
  }

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <div>
          <h1 className="checkout-title">Carrito</h1>
          <p className="checkout-subtitle">
            Revisa tus selecciones antes de pasar al pago seguro de Stripe.
          </p>
        </div>
        <Link className="profile-link" to={PATHS.PERFIL}>
          Mis reservas
        </Link>
      </div>

      {items.length === 0 ? (
        <section className="checkout-empty">
          <h2>Tu carrito esta vacio</h2>
          <p className="muted">Elige un vuelo, hotel, crucero, tren, vehiculo, paquete u oferta para pagarlo aqui.</p>
          <div className="checkout-empty-actions">
            <Link className="reserve-btn checkout-inline-btn" to={PATHS.VUELOS}>Buscar vuelos</Link>
            <Link className="profile-link" to={PATHS.OFERTAS}>Ver ofertas</Link>
          </div>
        </section>
      ) : (
        <div className="checkout-layout">
          <section className="checkout-list">
            {items.map((item) => (
              <article key={`${item.type}-${item.itemId}`} className="checkout-card">
                <img
                  className="checkout-img"
                  src={resolveImageUrl(item.imageUrl) || "https://picsum.photos/400/300"}
                  alt={item.title}
                  loading="lazy"
                  onError={imageFallback}
                />
                <div className="checkout-card-body">
                  <div className="checkout-card-top">
                    <div>
                      <span className="reservation-type">{formatType(item.type)}</span>
                      <h2>{item.title}</h2>
                    </div>
                    <div className="checkout-price">{item.price} EUR</div>
                  </div>
                  {item.subtitle ? <p className="muted">{item.subtitle}</p> : null}
                  <div className="checkout-card-actions">
                    {item.linkUrl ? (
                      <Link
                        className="profile-link"
                        to={item.linkUrl}
                        state={{ fromDetailsButton: true }}
                      >
                        Ver detalle
                      </Link>
                    ) : null}
                    <button
                      type="button"
                      className="checkout-link-btn"
                      onClick={() => removeItem(item.type, item.itemId)}
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>

          <aside className="checkout-summary">
            <h2>Resumen</h2>
            <div className="checkout-summary-row">
              <span>Productos</span>
              <strong>{items.length}</strong>
            </div>
            <div className="checkout-summary-row total">
              <span>Total</span>
              <strong>{total.toFixed(2)} EUR</strong>
            </div>
            {error ? <p className="checkout-error">{error}</p> : null}
            <button
              type="button"
              className="reserve-btn"
              disabled={busy}
              onClick={handleCheckout}
            >
              {busy ? "Abriendo Stripe..." : "Pagar con Stripe"}
            </button>
            <button
              type="button"
              className="checkout-secondary-btn"
              disabled={busy}
              onClick={clearCart}
            >
              Vaciar carrito
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}
