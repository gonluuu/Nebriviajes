import { useEffect, useState } from "react";
import { useParams, Link, useLocation, Navigate, useNavigate } from "react-router-dom";
import { getCruiseById } from "../../api/cruises";
import { PATHS } from "../../routes/paths";
import { resolveImageUrl, imageFallback } from "../../utils/resolveImageUrl";
import { useCartStore } from "../../store/useCartStore";
import { buildCartItem } from "../../utils/cartItems";
import { showToast } from "../../utils/notify";

function CruiseDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);
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
    return () => { mounted = false; };
  }, [id]);

  if (error) return <div className="container"><p>{error}</p></div>;
  if (!cruise) return <div className="container"><p>Cargando...</p></div>;

  function onReserve() {
    const added = addItem(buildCartItem({ type: "cruise", item: cruise, path: PATHS.CRUCEROS }));
    if (!added) showToast("Este crucero ya está en el carrito.", "info");
    navigate(PATHS.CARRITO);
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
              onError={imageFallback}
            />
          </div>
          <div className="deal-info">
            <h3>Detalles</h3>
            <p className="muted">Tipo: {cruise.type ?? "—"}</p>
            <p className="muted">Disponibilidad: {cruise.available === false ? "No disponible" : "Disponible"}</p>
            {Array.isArray(cruise.ports) && cruise.ports.length ? (
              <p className="muted">Puertos: {cruise.ports.join(", ")}</p>
            ) : null}
          </div>
          <div className="deal-price">
            <div className="price">{cruise.priceFrom ?? "—"} €</div>
            <div className="muted">desde</div>
            <button type="button" className="reserve-btn" onClick={onReserve}>
              Añadir al carrito
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