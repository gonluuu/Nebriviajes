import { useEffect, useState } from "react";
import { Link, useParams, useLocation, Navigate, useNavigate } from "react-router-dom";
import { getPackageById } from "../../api/packages";
import { resolveImageUrl, imageFallback } from "../../utils/resolveImageUrl";
import { PATHS } from "../../routes/paths";
import { useCartStore } from "../../store/useCartStore";
import { buildCartItem } from "../../utils/cartItems";
import { showToast } from "../../utils/notify";

export default function PackageDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);
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

  function onReserve() {
    const added = addItem(buildCartItem({ type: "package", item: pkg, path: PATHS.PAQUETES }));
    if (!added) showToast("Este paquete ya está en el carrito.", "info");
    navigate(PATHS.CARRITO);
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
              onError={imageFallback}
            />
          </div>
          <div className="deal-info">
            <h3>Resumen</h3>
            <p className="muted">{pkg.destination ?? "—"}</p>
          </div>
          <div className="deal-price">
            <div className="price">{pkg.pricePerPerson ?? "—"} €</div>
            <div className="muted">por persona</div>
            <button type="button" className="reserve-btn" onClick={onReserve}>
              Añadir al carrito
            </button>
          </div>
        </article>
      </div>

      <div className="detail-grid">
        <p><b>Destino:</b> {pkg.destination ?? "—"}</p>
        <p><b>Duración:</b> {pkg.durationDays ?? "—"} días</p>
        <p><b>Precio:</b> {pkg.pricePerPerson ?? "—"} € / persona</p>
        <p><b>Disponible:</b> {pkg.available === false ? "No" : "Sí"}</p>
      </div>

      <div className="detail-box">
        <h3>Incluye</h3>
        <ul>
          {(pkg.includes || []).length ? pkg.includes.map((x, i) => <li key={i}>{x}</li>) : <li>—</li>}
        </ul>
      </div>

      <div className="detail-box">
        <h3>Información adicional</h3>
        <p className="muted">
          Plan de comidas: {pkg.mealPlan ?? "—"}
          <br />
          Categoría hotel: {pkg.hotelCategory ? `${pkg.hotelCategory} estrellas` : "—"}
          <br />
          Cancelación gratuita: {pkg.freeCancellation ? "Sí" : "No"}
        </p>
      </div>
    </div>
  );
}