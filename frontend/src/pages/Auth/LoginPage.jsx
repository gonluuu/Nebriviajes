import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../api/auth";
import { useAuthStore } from "../../store/useAuthStore";
import { PATHS } from "../../routes/paths";

function LoginPage() {
  const navigate = useNavigate();
  const setLogin = useAuthStore((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const data = await loginUser({ email, password });
      setLogin(data.user, data.token);

      const isAdmin = Boolean(data.user?.isAdmin || data.user?.role === "admin");
      navigate(isAdmin ? PATHS.ADMIN : PATHS.HOME);
    } catch (err) {
      setError(
        err?.response?.data?.message || "No se pudo iniciar sesión"
      );
    }
  }

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

          <form onSubmit={onSubmit}>
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

            {error ? <p className="muted">{error}</p> : null}

            <Button className="auth-btn" type="submit">
              Inicia Sesión
            </Button>
          </form>

          <div className="auth-forgot">
            ¿No tienes cuenta? <Link to={PATHS.REGISTRO}>Crear cuenta</Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default LoginPage;
