import { useEffect, useState } from "react";
import { useParams, Link, useLocation, Navigate, useNavigate } from "react-router-dom";
import { getFlightById } from "../../api/flights";
import { PATHS } from "../../routes/paths";
import { resolveImageUrl, imageFallback } from "../../utils/resolveImageUrl";
import { useCartStore } from "../../store/useCartStore";
import { buildCartItem } from "../../utils/cartItems";
import { showToast } from "../../utils/notify";

function FlightDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);
  const [flight, setFlight] = useState(null);
  const [error, setError] = useState("");

  if (!location.state?.fromDetailsButton) {
    return <Navigate to={PATHS.VUELOS} replace />;
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getFlightById(id);
        if (mounted) setFlight(data);
      } catch (e) {
        if (mounted) setError("No se pudo cargar el vuelo");
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  if (error) return <div className="container"><p>{error}</p></div>;
  if (!flight) return <div className="container"><p>Cargando...</p></div>;

  function onReserve() {
    const added = addItem(buildCartItem({ type: "flight", item: flight, path: PATHS.VUELOS }));
    if (!added) showToast("Este vuelo ya está en el carrito.", "info");
    navigate(PATHS.CARRITO);
  }

  const dep = flight.departureDate ? new Date(flight.departureDate).toLocaleDateString("es-ES") : "";
  const ret = flight.dateReturn ? new Date(flight.dateReturn).toLocaleDateString("es-ES") : "";

  return (
    <div className="container">
      <Link to={PATHS.VUELOS} className="muted">← Volver a vuelos</Link>

      <h2 style={{ marginTop: 12 }}>
        {flight.origin} → {flight.destination}
      </h2>
      <p className="muted">
        {dep}{ret ? ` - ${ret}` : ""} · {flight.airline || "Aerolínea"} · {flight.duration || "Vuelo"}
      </p>

      <div className="grid-cards" style={{ marginTop: 12 }}>
        <article className="deal-card card">
          <div className="deal-img">
            <img
              src={resolveImageUrl(flight.imageUrl) || "/placeholder.jpg"}
              alt={`${flight.origin} a ${flight.destination}`}
              loading="lazy"
              onError={imageFallback}
            />
          </div>

          <div className="deal-info">
            <h3>Resumen</h3>
            <p className="muted">
              {flight.airline || "Aerolínea"} · {flight.duration || "—"}
            </p>
            <div className="detail-chips">
              <span className="badge">Equipaje cabina</span>
              <span className="badge">Cambios flexibles</span>
            </div>
          </div>

          <div className="deal-price">
            <div className="price">{flight.price ?? "—"} €</div>
            <div className="muted">precio</div>
            <button type="button" className="reserve-btn" onClick={onReserve}>
              Añadir al carrito
            </button>
          </div>
        </article>
      </div>

      <div className="detail-grid">
        <p><b>Origen:</b> {flight.origin ?? "—"}</p>
        <p><b>Destino:</b> {flight.destination ?? "—"}</p>
        <p><b>Salida:</b> {flight.departureDate ? new Date(flight.departureDate).toLocaleString("es-ES") : (flight.date ?? "—")}</p>
        <p><b>Vuelta:</b> {flight.dateReturn ? new Date(flight.dateReturn).toLocaleString("es-ES") : "—"}</p>
        <p><b>Aerolínea:</b> {flight.airline ?? "—"}</p>
        <p><b>Duración:</b> {flight.duration ?? "—"}</p>
      </div>
    </div>
  );
}

export default FlightDetailPage;