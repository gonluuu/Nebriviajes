import { useEffect, useState } from "react";
import { useParams, Link, useLocation, Navigate, useNavigate } from "react-router-dom";
import { getVehicleById } from "../../api/vehicles";
import { createReserva } from "../../api/reservas";
import { PATHS } from "../../routes/paths";
import { resolveImageUrl } from "../../utils/resolveImageUrl";

function VehicleDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
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
    return () => {
      mounted = false;
    };
  }, [id]);

  if (error) return <div className="container"><p>{error}</p></div>;
  if (!vehicle) return <div className="container"><p>Cargando...</p></div>;

  async function onReserve() {
    try {
      await createReserva({ type: "vehicle", itemId: id });
      navigate(PATHS.VEHICULOS);
    } catch (err) {
      const msg = err?.response?.data?.message || "No se pudo completar la reserva. Inténtalo otra vez.";
      console.error(err);
      alert(msg);
    }
  }

  return (
    <div className="container">
      <Link to={PATHS.VEHICULOS} className="muted">← Volver a vehículos</Link>

      <h2 style={{ marginTop: 12 }}>{vehicle.type}</h2>
      <p className="muted">Ciudad: {vehicle.city} · Fecha: {vehicle.date}</p>

      <div className="grid-cards">
        <article className="deal-card card">
          <div className="deal-img">
            <img
              src={resolveImageUrl(vehicle.imageUrl)}
              alt={`${vehicle.type} en ${vehicle.city}`}
              loading="lazy"
            />
          </div>
          <div className="deal-info">
            <h3>Detalles</h3>
            <p className="muted">Disponibilidad: {vehicle.available === false ? "No disponible" : "Disponible"}</p>
          </div>
          <div className="deal-price">
            <div className="price">{vehicle.price} €</div>
            <div className="muted">total</div>
            <button type="button" className="reserve-btn" onClick={onReserve}>
              Reservar
            </button>
          </div>
        </article>
      </div>

      <div className="detail-grid">
        <p><b>Tipo:</b> {vehicle.type ?? "—"}</p>
        <p><b>Ciudad:</b> {vehicle.city ?? "—"}</p>
        <p><b>Fecha:</b> {vehicle.date ?? "—"}</p>
        <p><b>Disponible:</b> {vehicle.available === false ? "No" : "Sí"}</p>
        <p><b>Precio:</b> {vehicle.price ?? "—"} €</p>
      </div>
    </div>
  );
}

export default VehicleDetailPage;
