import { Link } from "react-router-dom";
import { PATHS } from "../../routes/paths";

function Header() {
  return (
    <header className="header">
      <Link to={PATHS.HOME} className="brand">
        <div className="logo-circle">✈️</div>
        <div className="brand-name">Nebrivajes</div>
      </Link>

      <nav className="header-actions">
        <Link className="header-btn" to={PATHS.HOME}>Inicio</Link>
        <span className="divider" />
        <Link className="header-link" to={PATHS.REGISTRO}>Crear Cuenta</Link>
        <span className="divider" />
        <Link className="header-link" to={PATHS.LOGIN}>Mi Cuenta</Link>
        <div className="user-icon">👤</div>
      </nav>
    </header>
  );
}

export default Header;
