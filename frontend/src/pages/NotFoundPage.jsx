import { Link } from "react-router-dom";
import { PATHS } from "../routes/paths";

function NotFoundPage() {
  return (
    <div className="container">
      <h2>404</h2>
      <p className="muted">Página no encontrada.</p>
      <Link className="btn" to={PATHS.HOME}>Volver al inicio</Link>
    </div>
  );
}

export default NotFoundPage;
