import { useEffect, useState } from "react";
import { Link, useParams, useLocation, Navigate, useNavigate } from "react-router-dom";
import { getPackageById } from "../../api/packages";
import { createReserva } from "../../api/reservas";
import { resolveImageUrl } from "../../utils/resolveImageUrl";
import { PATHS } from "../../routes/paths";

export default function PackageDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [error, setError] = useState("");

  if (!location.state?.fromDetailsButton) {
    return <Navigate to={PATHS.PAQUETES} replace />;
  }

  useEffect(() => {
    setError("");
    getPackageById(id)
      .then(setPkg)
      .catch(() => setError("No se pudo cargar el paquete."));
  }, [id]);

  if (error) return <div className="container"><p>{error}</p><Link to={PATHS.PAQUETES}>← Volver</Link></div>;
  if (!pkg) return <div className="container"><p>Cargando...</p></div>;

  async function onReserve() {
    try {
      await createReserva({ type: "package", itemId: id });
      navigate(PATHS.PAQUETES);
    } catch (err) {
      const msg = err?.response?.data?.message || "No se pudo completar la reserva. Inténtalo otra vez.";
      console.error(err);
      alert(msg);
    }
  }

  return (
    <div className="container">
      <Link to={PATHS.PAQUETES}>← Volver</Link>
      <h2>{pkg.title ?? pkg.name ?? "Paquete"}</h2>

      <div className="grid-cards" style={{ marginTop: 12 }}>
        <article className="deal-card card">
          <div className="deal-img">
            <img
              src={resolveImageUrl(pkg.imageUrl)}
              alt={pkg.title ?? pkg.name ?? "Paquete"}
              loading="lazy"
            />
          </div>
          <div className="deal-info">
            <h3>Resumen</h3>
            <p className="muted">{pkg.description ?? "—"}</p>
          </div>
          <div className="deal-price">
            <div className="price">{pkg.price ?? "—"} €</div>
            <div className="muted">por persona</div>
            <button type="button" className="reserve-btn" onClick={onReserve}>
              Reservar
            </button>
          </div>
        </article>
      </div>

      <div className="detail-grid">
        <p><b>Destino:</b> {pkg.destination ?? pkg.city ?? "—"}</p>
        <p><b>Duración:</b> {pkg.durationDays ?? "—"} dias</p>
        <p><b>Precio:</b> {pkg.price ?? "—"} €</p>
        <p><b>Disponible:</b> {pkg.available === false ? "No" : "Sí"}</p>
      </div>

      <div className="detail-box">
        <h3>Incluye</h3>
        <ul>
          {(pkg.includes || []).length ? pkg.includes.map((x, i) => <li key={i}>{x}</li>) : <li>—</li>}
        </ul>
      </div>

      <div className="detail-box">
        <h3>Descripción</h3>
        <p className="muted">{pkg.description ?? "—"}</p>
      </div>
    </div>
  );
}
