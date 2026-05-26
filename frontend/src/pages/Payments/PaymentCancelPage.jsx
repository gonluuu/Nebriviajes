import { Link } from "react-router-dom";
import { PATHS } from "../../routes/paths";
import "../../styles/Checkout.css";

export default function PaymentCancelPage() {
  return (
    <div className="checkout-page">
      <section className="checkout-result">
        <h1>Pago cancelado</h1>
        <p className="muted">
          No se ha realizado ningun cargo. Tus productos siguen guardados en el carrito.
        </p>
        <div className="checkout-empty-actions">
          <Link className="reserve-btn checkout-inline-btn" to={PATHS.CARRITO}>
            Volver al carrito
          </Link>
          <Link className="profile-link" to={PATHS.HOME}>
            Seguir buscando
          </Link>
        </div>
      </section>
    </div>
  );
}
