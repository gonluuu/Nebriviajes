import { useEffect, useState } from "react";
import { useParams, Link, useLocation, Navigate, useNavigate } from "react-router-dom";
import { getTrainById } from "../../api/trains";
import { PATHS } from "../../routes/paths";
import { resolveImageUrl, imageFallback } from "../../utils/resolveImageUrl";
import { useCartStore } from "../../store/useCartStore";
import { buildCartItem } from "../../utils/cartItems";
import { showToast } from "../../utils/notify";

function TrainDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);
  const [train, setTrain] = useState(null);
  const [error, setError] = useState("");

  if (!location.state?.fromDetailsButton) {
    return <Navigate to={PATHS.TRENES} replace />;
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getTrainById(id);
        if (mounted) setTrain(data);
      } catch (e) {
        if (mounted) setError("No se pudo cargar el tren");
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  if (error) return <div className="container"><p>{error}</p></div>;
  if (!train) return <div className="container"><p>Cargando...</p></div>;

  function onReserve() {
    const added = addItem(buildCartItem({ type: "train", item: train, path: PATHS.TRENES }));
    if (!added) showToast("Este tren ya está en el carrito.", "info");
    navigate(PATHS.CARRITO);
  }

  const durationLabel = train.durationMinutes
    ? train.durationMinutes >= 60
      ? `${Math.floor(train.durationMinutes / 60)}h ${train.durationMinutes % 60}min`
      : `${train.durationMinutes} min`
    : "—";

  return (
    <div className="container">
      <Link to={PATHS.TRENES} className="muted">← Volver a trenes</Link>

      <h2 style={{ marginTop: 12 }}>
        {train.origin} → {train.destination}
      </h2>
      <p className="muted">Fecha: {train.date ?? "—"} · {durationLabel}</p>

      <div className="grid-cards" style={{ marginTop: 12 }}>
        <article className="deal-card card">
          <div className="deal-img">
            <img
              src={resolveImageUrl(train.imageUrl) || "/placeholder.jpg"}
              alt={`${train.origin} a ${train.destination}`}
              loading="lazy"
              onError={imageFallback}
            />
          </div>

          <div className="deal-info">
            <h3>Resumen</h3>
            <p className="muted">
              {train.direct ? "Directo" : "Con paradas"} · {durationLabel} · {train.available === false ? "No disponible" : "Disponible"}
            </p>
            <div className="detail-chips">
              <span className="badge">Asiento incluido</span>
              <span className="badge">Cambios flexibles</span>
            </div>
          </div>

          <div className="deal-price">
            <div className="price">{train.price ?? "—"} €</div>
            <div className="muted">precio</div>
            <button type="button" className="reserve-btn" onClick={onReserve}>
              Añadir al carrito
            </button>
          </div>
        </article>
      </div>

      <div className="detail-grid">
        <p><b>Origen:</b> {train.origin ?? "—"}</p>
        <p><b>Destino:</b> {train.destination ?? "—"}</p>
        <p><b>Fecha:</b> {train.date ?? "—"}</p>
        <p><b>Salida:</b> {train.departureTime ?? "—"}</p>
        <p><b>Llegada:</b> {train.arrivalTime ?? "—"}</p>
        <p><b>Duración:</b> {durationLabel}</p>
        <p><b>Tipo tren:</b> {train.trainType ?? "—"}</p>
        <p><b>Compañía:</b> {train.railCompany ?? "—"}</p>
        <p><b>Tipo:</b> {train.direct ? "Directo" : "Con paradas"}</p>
        <p><b>Disponible:</b> {train.available === false ? "No" : "Sí"}</p>
      </div>
    </div>
  );
}

export default TrainDetailPage;