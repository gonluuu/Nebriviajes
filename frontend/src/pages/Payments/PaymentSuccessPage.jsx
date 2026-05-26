import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { PATHS } from "../../routes/paths";
import { confirmCheckout } from "../../api/payments";
import { useCartStore } from "../../store/useCartStore";
import "../../styles/Checkout.css";

export default function PaymentSuccessPage() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const clearCart = useCartStore((s) => s.clearCart);
  const [status, setStatus] = useState("confirming");
  const [message, setMessage] = useState("Confirmando pago y creando reservas...");
  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    async function confirm() {
      if (!sessionId) {
        setStatus("error");
        setMessage("No se encontro la sesion de Stripe.");
        return;
      }

      try {
        const data = await confirmCheckout({ sessionId });
        clearCart();
        setStatus("ok");
        setMessage(`Pago confirmado. Se han creado ${data.count} reserva(s).`);
      } catch (err) {
        setStatus("error");
        setMessage(err?.response?.data?.message || "No se pudo confirmar el pago.");
      }
    }

    confirm();
  }, [clearCart, sessionId]);

  return (
    <div className="checkout-page">
      <section className={`checkout-result ${status}`}>
        <h1>{status === "ok" ? "Pago completado" : "Pago en proceso"}</h1>
        <p className="muted">{message}</p>
        <div className="checkout-empty-actions">
          <Link className="reserve-btn checkout-inline-btn" to={PATHS.PERFIL}>
            Ver mis reservas
          </Link>
          <Link className="profile-link" to={PATHS.HOME}>
            Volver al inicio
          </Link>
        </div>
      </section>
    </div>
  );
}
