function RegisterPage() {
  return (
    <div className="auth-page">
      <div className="auth-panel">
        <aside className="auth-left">
          <h3 className="auth-left-title">¡Únete a Nebrivajes!</h3>
          <div className="auth-left-line" />
          <ul className="auth-left-list">
            <li>Crea tu cuenta y guarda tus viajes favoritos.</li>
            <li>Gestiona reservas y datos en “Mi Cuenta”.</li>
            <li>Accede a ofertas personalizadas.</li>
          </ul>
        </aside>

        <section className="auth-right">
          <h2 className="auth-title">Crear Cuenta</h2>

          <input className="auth-input" placeholder="Nombre" />
          <input className="auth-input" type="email" placeholder="Correo electrónico" />
          <input className="auth-input" type="password" placeholder="Contraseña" />
          <input className="auth-input" type="password" placeholder="Repetir contraseña" />

          <button className="auth-btn">Crear Cuenta</button>

          <div className="auth-forgot">
            ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
          </div>
        </section>
      </div>
    </div>
  );
}

export default RegisterPage;