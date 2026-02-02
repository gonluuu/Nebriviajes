import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

function LoginPage() {
  return (
    <div className="auth-page">
      <div className="auth-panel">
        <aside className="auth-left">
          <h3 className="auth-left-title">¡Únete a Nebrivajes!</h3>
          <div className="auth-left-line" />

          <ul className="auth-left-list">
            <li>
              Prepara tus maletas, explora el mundo con nosotros sin límites y
              descubre, vive y comparte experiencias inolvidables.
            </li>
            <li>
              Controla fácilmente tus reservas, presupuestos, búsquedas,
              favoritos...
            </li>
            <li>
              Recibe ofertas personalizadas para ti, algunas de ellas exclusivas
            </li>
          </ul>
        </aside>

        <section className="auth-right">
          <h2 className="auth-title">Bienvenido de nuevo</h2>

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

          <label className="auth-remember">
            <input type="checkbox" />
            <span>Recordar mis datos</span>
          </label>

          <Button className="auth-btn">Inicia Sesion</Button>
         
          <div className="auth-forgot">
            ¿Has olvidado tu contraseña? <a href="#">Pulsa aquí</a>
          </div>
        </section>
      </div>
    </div>
  );
}

export default LoginPage;
