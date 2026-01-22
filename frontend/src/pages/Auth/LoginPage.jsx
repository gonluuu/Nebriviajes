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

          <input className="auth-input" type="email" placeholder="Correo electrónico" />
          <input className="auth-input" type="password" placeholder="Contraseña" />

          <label className="auth-remember">
            <input type="checkbox" />
            <span>Recordar mis datos</span>
          </label>

          <button className="auth-btn">Inicia Sesion</button>

          <div className="auth-or">o inicia sesión en un click</div>

          <div className="auth-social">
            <button className="auth-social-btn fb">FACEBOOK</button>
            <button className="auth-social-btn gg">GOOGLE</button>
          </div>

          <div className="auth-forgot">
            ¿Has olvidado tu contraseña? <a href="#">Pulsa aquí</a>
          </div>
        </section>
      </div>
    </div>
  );
}

export default LoginPage;