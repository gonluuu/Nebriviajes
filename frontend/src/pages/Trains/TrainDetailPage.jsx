import { useEffect, useState } from "react";
import { useParams, Link, useLocation, Navigate, useNavigate } from "react-router-dom";
import { getTrainById } from "../../api/trains";
import { createReserva } from "../../api/reservas";
import { PATHS } from "../../routes/paths";
import { resolveImageUrl } from "../../utils/resolveImageUrl";

function TrainDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
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
    return () => {
      mounted = false;
    };
  }, [id]);

  if (error) return <div className="container"><p>{error}</p></div>;
  if (!train) return <div className="container"><p>Cargando...</p></div>;

  async function onReserve() {
    try {
      await createReserva({ type: "train", itemId: id });
      navigate(PATHS.TRENES);
    } catch (err) {
      const msg = err?.response?.data?.message || "No se pudo completar la reserva. Inténtalo otra vez.";
      console.error(err);
      alert(msg);
    }
  }

  return (
    <div className="container">
      <Link to={PATHS.TRENES} className="muted">← Volver a trenes</Link>

      <h2 style={{ marginTop: 12 }}>
        {train.origin} → {train.destination}
      </h2>
      <p className="muted">Fecha: {train.date} · {train.duration}</p>

      <div className="grid-cards" style={{ marginTop: 12 }}>
        <article className="deal-card card">
          <div className="deal-img">
            <img
              src={resolveImageUrl(train.imageUrl) || "/placeholder.jpg"}
              alt={`${train.origin} a ${train.destination}`}
              loading="lazy"
            />
          </div>

          <div className="deal-info">
            <h3>Resumen</h3>
            <p className="muted">
              {train.direct ? "Directo" : "Con paradas"} · {train.duration || "—"} · {train.available === false ? "No disponible" : "Disponible"}
            </p>
            <div className="detail-chips">
              <span className="badge">Asiento incluido</span>
              <span className="badge">Cambios flexibles</span>
            </div>
          </div>

          <div className="deal-price">
            <div className="price">{train.price} €</div>
            <div className="muted">precio</div>
            <button type="button" className="reserve-btn" onClick={onReserve}>
              Reservar
            </button>
          </div>
        </article>
      </div>

      <div className="detail-grid">
        <p><b>Origen:</b> {train.origin ?? "—"}</p>
        <p><b>Destino:</b> {train.destination ?? "—"}</p>
        <p><b>Fecha:</b> {train.date ?? "—"}</p>
        <p><b>Duración:</b> {train.duration ?? "—"}</p>
        <p><b>Tipo:</b> {train.direct ? "Directo" : "Con paradas"}</p>
        <p><b>Disponible:</b> {train.available === false ? "No" : "Sí"}</p>
      </div>
    </div>
  );
}

export default TrainDetailPage;
