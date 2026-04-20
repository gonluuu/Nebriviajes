import { useEffect, useState } from "react";
import { Link, useParams, useLocation, Navigate, useNavigate } from "react-router-dom";
import { getOfferById } from "../../api/offers";
import { createReserva } from "../../api/reservas";
import { resolveImageUrl } from "../../utils/resolveImageUrl";
import { PATHS } from "../../routes/paths";

export default function OfferDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [offer, setOffer] = useState(null);
  const [error, setError] = useState("");

  if (!location.state?.fromDetailsButton) {
    return <Navigate to={PATHS.OFERTAS} replace />;
  }

  useEffect(() => {
    setError("");
    getOfferById(id)
      .then(setOffer)
      .catch(() => setError("No se pudo cargar la oferta."));
  }, [id]);

  if (error) return <div className="container"><p>{error}</p><Link to={PATHS.OFERTAS}>← Volver</Link></div>;
  if (!offer) return <div className="container"><p>Cargando...</p></div>;

  async function onReserve() {
    try {
      await createReserva({ type: "offer", itemId: id });
      navigate(PATHS.OFERTAS);
    } catch (err) {
      const msg = err?.response?.data?.message || "No se pudo completar la reserva. Inténtalo otra vez.";
      console.error(err);
      alert(msg);
    }
  }

  return (
    <div className="container">
      <Link to={PATHS.OFERTAS}>← Volver</Link>
      <h2>{offer.title ?? offer.name ?? "Oferta"}</h2>

      <div className="grid-cards" style={{ marginTop: 12 }}>
        <article className="deal-card card">
          <div className="deal-img">
            <img
              src={resolveImageUrl(offer.imageUrl)}
              alt={offer.title ?? offer.name ?? "Oferta"}
              loading="lazy"
            />
          </div>
          <div className="deal-info">
            <h3>Resumen</h3>
            <p className="muted">{offer.description ?? "—"}</p>
          </div>
          <div className="deal-price">
            <div className="price">{offer.price ?? "—"} €</div>
            <div className="muted">precio</div>
            <button type="button" className="reserve-btn" onClick={onReserve}>
              Reservar
            </button>
          </div>
        </article>
      </div>

      <div className="detail-grid">
        <p><b>Destino:</b> {offer.destination ?? offer.city ?? "—"}</p>
        <p><b>Descuento:</b> {offer.discount ?? "—"}</p>
        <p><b>Precio:</b> {offer.price ?? "—"} €</p>
        <p><b>Válida hasta:</b> {offer.validUntil ? new Date(offer.validUntil).toLocaleDateString("es-ES") : "—"}</p>
      </div>

      <div className="detail-box">
        <h3>Descripción</h3>
        <p className="muted">{offer.description ?? "—"}</p>
      </div>
    </div>
  );
}
