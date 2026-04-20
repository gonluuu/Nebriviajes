import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../api/auth";
import { useAuthStore } from "../../store/useAuthStore";
import { PATHS } from "../../routes/paths";

function RegisterPage() {
  const navigate = useNavigate();
  const setLogin = useAuthStore((s) => s.login);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    if (password !== password2) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const data = await registerUser({ name, email, password });
      // Dejamos al usuario ya logueado 
      setLogin(data.user, data.token);
      navigate(PATHS.HOME);
    } catch (err) {
      setError(err?.response?.data?.message || "No se pudo registrar");
    }
  }
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

          <form onSubmit={onSubmit}>
            <Input
              className="auth-input"
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              className="auth-input"
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              className="auth-input"
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              className="auth-input"
              type="password"
              placeholder="Repetir contraseña"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
            />

            {error ? <p className="muted">{error}</p> : null}

            <Button className="auth-btn" type="submit">
              Crear Cuenta
            </Button>
          </form>

          <div className="auth-forgot">
            ¿Ya tienes cuenta? <Link to={PATHS.LOGIN}>Inicia sesión</Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default RegisterPage;
