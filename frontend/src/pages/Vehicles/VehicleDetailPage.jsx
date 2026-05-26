import { useEffect, useState } from "react";
import { useParams, Link, useLocation, Navigate, useNavigate } from "react-router-dom";
import { getVehicleById } from "../../api/vehicles";
import { PATHS } from "../../routes/paths";
import { resolveImageUrl, imageFallback } from "../../utils/resolveImageUrl";
import { useCartStore } from "../../store/useCartStore";
import { buildCartItem } from "../../utils/cartItems";
import { showToast } from "../../utils/notify";

function VehicleDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);
  const [vehicle, setVehicle] = useState(null);
  const [error, setError] = useState("");

  if (!location.state?.fromDetailsButton) {
    return <Navigate to={PATHS.VEHICULOS} replace />;
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getVehicleById(id);
        if (mounted) setVehicle(data);
      } catch (e) {
        if (mounted) setError("No se pudo cargar el vehículo");
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  if (error) return <div className="container"><p>{error}</p></div>;
  if (!vehicle) return <div className="container"><p>Cargando...</p></div>;

  function onReserve() {
    const added = addItem(buildCartItem({ type: "vehicle", item: vehicle, path: PATHS.VEHICULOS }));
    if (!added) showToast("Este vehículo ya está en el carrito.", "info");
    navigate(PATHS.CARRITO);
  }

  return (
    <div className="container">
      <Link to={PATHS.VEHICULOS} className="muted">← Volver a vehículos</Link>

      <h2 style={{ marginTop: 12 }}>{vehicle.brand && vehicle.model ? `${vehicle.brand} ${vehicle.model}` : (vehicle.type ?? "Vehículo")}</h2>
      <p className="muted">Ciudad: {vehicle.city} · Fecha: {vehicle.date}</p>

      <div className="grid-cards">
        <article className="deal-card card">
          <div className="deal-img">
            <img
              src={resolveImageUrl(vehicle.imageUrl)}
              alt={`${vehicle.type} en ${vehicle.city}`}
              loading="lazy"
              onError={imageFallback}
            />
          </div>
          <div className="deal-info">
            <h3>Detalles</h3>
            <p className="muted">Disponibilidad: {vehicle.available === false ? "No disponible" : "Disponible"}</p>
          </div>
          <div className="deal-price">
            <div className="price">{vehicle.price ?? "—"} €</div>
            <div className="muted">total</div>
            <button type="button" className="reserve-btn" onClick={onReserve}>
              Añadir al carrito
            </button>
          </div>
        </article>
      </div>

      <div className="detail-grid">
        <p><b>Tipo:</b> {vehicle.type ?? "—"}</p>
        <p><b>Marca:</b> {vehicle.brand ?? "—"}</p>
        <p><b>Modelo:</b> {vehicle.model ?? "—"}</p>
        <p><b>Combustible:</b> {vehicle.fuel ?? "—"}</p>
        <p><b>Plazas:</b> {vehicle.passengers ?? "—"}</p>
        <p><b>Transmisión:</b> {vehicle.transmission ?? "—"}</p>
        <p><b>Ciudad:</b> {vehicle.city ?? "—"}</p>
        <p><b>Fecha:</b> {vehicle.date ?? "—"}</p>
        <p><b>Disponible:</b> {vehicle.available === false ? "No" : "Sí"}</p>
        <p><b>Precio:</b> {vehicle.price ?? "—"} €</p>
      </div>
    </div>
  );
}

export default VehicleDetailPage;