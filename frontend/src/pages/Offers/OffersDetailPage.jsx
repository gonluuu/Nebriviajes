import { useEffect, useState } from "react";
import { Link, useParams, useLocation, Navigate, useNavigate } from "react-router-dom";
import { getOfferById } from "../../api/offers";
import { resolveImageUrl, imageFallback } from "../../utils/resolveImageUrl";
import { PATHS } from "../../routes/paths";
import { useCartStore } from "../../store/useCartStore";
import { buildCartItem } from "../../utils/cartItems";
import { showToast } from "../../utils/notify";

export default function OfferDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);
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

  function onReserve() {
    const added = addItem(buildCartItem({ type: "offer", item: offer, path: PATHS.OFERTAS }));
    if (!added) showToast("Esta oferta ya está en el carrito.", "info");
    navigate(PATHS.CARRITO);
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
              onError={imageFallback}
            />
          </div>
          <div className="deal-info">
            <h3>Resumen</h3>
            <p className="muted">{offer.description ?? "—"}</p>
          </div>
          <div className="deal-price">
            <div className="price">{offer.priceCurrent ?? "—"} €</div>
            <div className="muted">precio</div>
            <button type="button" className="reserve-btn" onClick={onReserve}>
              Añadir al carrito
            </button>
          </div>
        </article>
      </div>

      <div className="detail-grid">
        <p><b>Destino:</b> {offer.destination ?? "—"}</p>
        <p><b>Descuento:</b> {offer.discountPercentage ? `${offer.discountPercentage}%` : "—"}</p>
        <p><b>Precio:</b> {offer.priceCurrent ?? "—"} €</p>
        <p><b>Válida hasta:</b> {offer.travelEnd ? new Date(offer.travelEnd).toLocaleDateString("es-ES") : "—"}</p>
      </div>

      <div className="detail-box">
        <h3>Descripción</h3>
        <p className="muted">{offer.description ?? "—"}</p>
      </div>
    </div>
  );
}