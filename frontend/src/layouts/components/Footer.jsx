import { Link } from "react-router-dom";
import { PATHS } from "../../routes/paths";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="footer-logo-circle">✈️</span>
            <div>
              <div className="footer-brand-name">Nebrivajes</div>
              <div className="footer-brand-sub muted">
                Reserva vuelos, hoteles y escapadas al mejor precio.
              </div>
            </div>
          </div>
        </div>

        <div className="footer-col">
          <div className="footer-title">Empresa</div>
          <Link className="footer-link" to={PATHS.CONTACTO}>
            Contacto
          </Link>
          <Link className="footer-link" to={`${PATHS.HOME}#faq`}>
            Preguntas frecuentes
          </Link>
        </div>

        <div className="footer-col">
          <div className="footer-title">Legal</div>
          <Link className="footer-link" to={PATHS.TERMINOS}>
            Términos y condiciones
          </Link>
          <Link className="footer-link" to={PATHS.PRIVACIDAD}>
            Política de privacidad
          </Link>
        </div>

        <div className="footer-col footer-newsletter">
          <div className="footer-title">Ofertas por email</div>
          <div className="muted footer-text">
            Recibe promociones y descuentos exclusivos.
          </div>

          <form
            className="footer-form"
            onSubmit={(e) => {
              e.preventDefault();
              alert("¡Suscripción enviada!");
            }}
          >
            <Input
              className="footer-input"
              type="email"
              placeholder="tuemail@ejemplo.com"
              required
            />
            <Button className="footer-btn" type="submit">
              Suscribirme
            </Button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span>© {year} Nebrivajes · Todos los derechos reservados</span>
          <span className="muted">ES · EUR</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
