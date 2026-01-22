import { NavLink } from "react-router-dom";
import { PATHS } from "../../routes/paths";

function CategoryNav() {
  const linkClass = ({ isActive }) => "catlink" + (isActive ? " active" : "");

  return (
    <div className="catnav">
      <NavLink className={linkClass} to={PATHS.VUELOS}>Vuelos</NavLink>
      <NavLink className={linkClass} to={PATHS.HOTELES}>Hoteles</NavLink>
      <NavLink className={linkClass} to={PATHS.PAQUETES}>Paquetes</NavLink>
      <NavLink className={linkClass} to={PATHS.VEHICULOS}>Vehículos</NavLink>
      <NavLink className={linkClass} to={PATHS.CRUCEROS}>Cruceros</NavLink>
      <NavLink className={linkClass} to={PATHS.TRENES}>Trenes</NavLink>
      <NavLink className={linkClass} to={PATHS.OFERTAS}>Ofertas</NavLink>
    </div>
  );
}

export default CategoryNav;
