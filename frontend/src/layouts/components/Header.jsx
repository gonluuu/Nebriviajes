import { Link } from "react-router-dom";
import { PATHS } from "../../routes/paths";
import logo from "../../assets/logo1.png";
import { useAuthStore } from "../../store/useAuthStore";
import { useCartStore } from "../../store/useCartStore";

function Header() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const cartCount = useCartStore((s) => s.items.length);
  const isAdmin = Boolean(user?.isAdmin || user?.role === "admin");

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
            {isAdmin ? (
              <>
                <span className="divider" />
                <Link className="header-link" to={PATHS.ADMIN}>Admin</Link>
              </>
            ) : null}
            <span className="divider" />
            <button
              className="header-link"
              onClick={logout}
            >
              Cerrar sesión
            </button>
          </>
        )}
        <span className="divider" />
        <Link className="header-link" to={PATHS.CARRITO}>
          Carrito{cartCount > 0 ? ` (${cartCount})` : ""}
        </Link>
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
