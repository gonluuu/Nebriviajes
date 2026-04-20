import { Link } from "react-router-dom";
import { PATHS } from "../../routes/paths";
import logo from "../../assets/logo1.png";
import { useAuthStore } from "../../store/useAuthStore";

function Header() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <header className="header">
      <Link to={PATHS.HOME} className="brand">
        <img
          src={logo}
          alt="Logo de Nebriviajes"
          className="brand-logo"
        />
        <div className="brand-name brand-name--font">Nebriviajes</div>
      </Link>

      <nav className="header-actions">
        <Link className="header-btn" to={PATHS.HOME}>Inicio</Link>
        <span className="divider" />
        {!user ? (
          <>
            <Link className="header-link" to={PATHS.REGISTRO}>Crear Cuenta</Link>
            <span className="divider" />
            <Link className="header-link" to={PATHS.LOGIN}>Mi Cuenta</Link>
          </>
        ) : (
          <>
            <span className="header-link">Hola, {user.name}</span>
            <span className="divider" />
            <button
              className="header-link"
              style={{ background: "transparent", border: 0, cursor: "pointer" }}
              onClick={logout}
            >
              Cerrar sesión
            </button>
          </>
        )}
        <Link
          to={user ? PATHS.PERFIL : PATHS.LOGIN}
          className="user-icon"
          title={user ? "Mis Reservas" : "Iniciar sesión"}
          aria-label={user ? "Mis Reservas" : "Iniciar sesión"}
        >
          {user ? "Mis Reservas" : "Mi Cuenta"}
        </Link>
      </nav>
    </header>
  );
}

export default Header;
