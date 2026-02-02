import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

function RegisterPage() {
  return (
    <div className="auth-page">
      <div className="auth-panel">
        <aside className="auth-left">
  <h3 className="auth-left-title">¡Bienvenido a Nebriviajes!</h3>
  <div className="auth-left-line" />

  <ul className="auth-left-list">
    <li>
      Crea tu cuenta en menos de un minuto y empieza a planear tu próxima escapada.
    </li>
    <li>
      Guarda tus favoritos y compara vuelos, hoteles y ofertas cuando quieras.
    </li>
    <li>
      Gestiona tus reservas desde “Mi Cuenta” y recibe promociones exclusivas para ti.
    </li>
  </ul>
</aside>


        <section className="auth-right">
          <h2 className="auth-title">Crear Cuenta</h2>

          <Input className="auth-input" placeholder="Nombre" />
          <Input
            className="auth-input"
            type="email"
            placeholder="Correo electrónico"
          />
          <Input
            className="auth-input"
            type="password"
            placeholder="Contraseña"
          />
          <Input
            className="auth-input"
            type="password"
            placeholder="Repetir contraseña"
          />

          <Button className="auth-btn">Crear Cuenta</Button>

          <div className="auth-forgot">
            ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
          </div>
        </section>
      </div>
    </div>
  );
}

export default RegisterPage;
