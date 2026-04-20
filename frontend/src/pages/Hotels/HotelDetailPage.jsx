import { useEffect, useState } from "react";
import { useParams, Link, useLocation, Navigate, useNavigate } from "react-router-dom";
import { getHotelById } from "../../api/hotels";
import { createReserva } from "../../api/reservas";
import { PATHS } from "../../routes/paths";
import { resolveImageUrl } from "../../utils/resolveImageUrl";

function HotelDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [error, setError] = useState("");


  if (!location.state?.fromDetailsButton) {
    return <Navigate to={PATHS.HOTELES} replace />;
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getHotelById(id);
        if (mounted) setHotel(data);
      } catch (e) {
        if (mounted) setError("No se pudo cargar el hotel");
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (error) return <div className="container"><p>{error}</p></div>;
  if (!hotel) return <div className="container"><p>Cargando...</p></div>;

  async function onReserve() {
    try {
      await createReserva({ type: "hotel", itemId: id });
      navigate(PATHS.HOTELES);
    } catch (err) {
      const msg = err?.response?.data?.message || "No se pudo completar la reserva. Inténtalo otra vez.";
      console.error(err);
      alert(msg);
    }
  }

  return (
    <div className="container">
      <Link to={PATHS.HOTELES} className="muted">← Volver a hoteles</Link>

      <h2 style={{ marginTop: 12 }}>{hotel.name}</h2>
      <p className="muted">{hotel.city} · Fecha: {hotel.date}</p>

      
      <div className="grid-cards" style={{ marginTop: 12 }}>
        <article className="deal-card card">
          <div className="deal-img">
            <img
              src={resolveImageUrl(hotel.imageUrl)}
              alt={hotel.name}
              loading="lazy"
            />
          </div>

          <div className="deal-info">
            <h3>Resumen</h3>
            <p className="muted">
              {hotel.available === false ? "No disponible" : "Disponible"} · {hotel.city}
            </p>
            <div className="detail-chips">
              <span className="badge">Cancelación gratis</span>
              <span className="badge">Pago en el hotel</span>
            </div>
          </div>

          <div className="deal-price">
            <div className="price">{hotel.price} €</div>
            <div className="muted">por noche</div>
            <button type="button" className="reserve-btn" onClick={onReserve}>
              Reservar
            </button>
          </div>
        </article>
      </div>

      
      <div className="detail-grid">
        <p><b>Ciudad:</b> {hotel.city ?? "—"}</p>
        <p><b>Fecha:</b> {hotel.date ?? "—"}</p>
        <p><b>Disponible:</b> {hotel.available === false ? "No" : "Sí"}</p>
        <p><b>Precio:</b> {hotel.price ?? "—"} € / noche</p>
      </div>

      <div className="detail-box">
        <h3>Información</h3>
        <p className="muted">
          Dirección: {hotel.address ?? "—"}
          <br />
          Estrellas: {hotel.stars ?? "—"}
          <br />
          Check-in: {hotel.checkIn ?? "—"} · Check-out: {hotel.checkOut ?? "—"}
        </p>
      </div>
    </div>
  );
}

export default HotelDetailPage;
