import { useEffect, useState } from "react";
import { useParams, Link, useLocation, Navigate, useNavigate } from "react-router-dom";
import { getCruiseById } from "../../api/cruises";
import { createReserva } from "../../api/reservas";
import { PATHS } from "../../routes/paths";
import { resolveImageUrl } from "../../utils/resolveImageUrl";

function CruiseDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [cruise, setCruise] = useState(null);
  const [error, setError] = useState("");

  if (!location.state?.fromDetailsButton) {
    return <Navigate to={PATHS.CRUCEROS} replace />;
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getCruiseById(id);
        if (mounted) setCruise(data);
      } catch (e) {
        if (mounted) setError("No se pudo cargar el crucero");
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (error) return <div className="container"><p>{error}</p></div>;
  if (!cruise) return <div className="container"><p>Cargando...</p></div>;

  async function onReserve() {
    try {
      await createReserva({ type: "cruise", itemId: id });
      navigate(PATHS.CRUCEROS);
    } catch (err) {
      const msg = err?.response?.data?.message || "No se pudo completar la reserva. Inténtalo otra vez.";
      console.error(err);
      alert(msg);
    }
  }

  return (
    <div className="container">
      <Link to={PATHS.CRUCEROS} className="muted">← Volver a cruceros</Link>

      <h2 style={{ marginTop: 12 }}>{cruise.name}</h2>
      <p className="muted">
        {cruise.origin} → {cruise.destination} · {cruise.durationDays} días
      </p>

      <div className="grid-cards">
        <article className="deal-card card">
          <div className="deal-img">
            <img
              src={resolveImageUrl(cruise.imageUrl)}
              alt={cruise.name}
              loading="lazy"
            />
          </div>
          <div className="deal-info">
            <h3>Detalles</h3>
            <p className="muted">Tipo: {cruise.type}</p>
            <p className="muted">Disponibilidad: {cruise.available === false ? "No disponible" : "Disponible"}</p>
            {Array.isArray(cruise.countries) && cruise.countries.length ? (
              <p className="muted">Países: {cruise.countries.join(", ")}</p>
            ) : null}
          </div>
          <div className="deal-price">
            <div className="price">{cruise.priceFrom} €</div>
            <div className="muted">desde</div>
            <button type="button" className="reserve-btn" onClick={onReserve}>
              Reservar
            </button>
          </div>
        </article>
      </div>

      <div className="detail-grid">
        <p><b>Origen:</b> {cruise.origin ?? "—"}</p>
        <p><b>Destino:</b> {cruise.destination ?? "—"}</p>
        <p><b>Duración:</b> {cruise.durationDays ?? "—"} días</p>
        <p><b>Tipo:</b> {cruise.type ?? "—"}</p>
        <p><b>Disponible:</b> {cruise.available === false ? "No" : "Sí"}</p>
        <p><b>Precio desde:</b> {cruise.priceFrom ?? "—"} €</p>
      </div>
    </div>
  );
}

export default CruiseDetailPage;
