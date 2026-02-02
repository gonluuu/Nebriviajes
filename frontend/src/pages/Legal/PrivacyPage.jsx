export default function TermsPage() {
  return (
    <div className="container">
      <div className="page-head">
        <h1>Términos y condiciones</h1>
        <p className="muted">
          Estos términos regulan el acceso y uso de la plataforma Nebrivajes.
        </p>
      </div>

      <article className="legal-page">
        <div className="legal-meta">
          <span className="badge">Última actualización</span>
          <span className="muted">{new Date().toLocaleDateString("es-ES")}</span>
        </div>

        <h2>1. Identificación</h2>
        <p>
          Nebrivajes es una plataforma online que permite buscar, comparar y acceder a
          servicios turísticos como vuelos, hoteles, trenes, vehículos, cruceros, paquetes y ofertas.
        </p>

        <h2>2. Aceptación de los términos</h2>
        <p>
          Al navegar por la web, crear una cuenta o realizar una reserva, aceptas estos términos.
          Si no estás de acuerdo, debes dejar de utilizar el sitio.
        </p>

        <h2>3. Registro y cuenta</h2>
        <ul>
          <li>Debes proporcionar información veraz y mantenerla actualizada.</li>
          <li>Tu contraseña es personal e intransferible. Eres responsable de su confidencialidad.</li>
          <li>Podemos suspender cuentas por uso fraudulento o incumplimiento de estos términos.</li>
        </ul>

        <h2>4. Precios, disponibilidad y condiciones</h2>
        <p>
          Los precios, disponibilidad y condiciones (cancelación, cambios, equipaje, etc.) pueden variar.
          Antes de confirmar una reserva, revisa el resumen final y las condiciones aplicables.
        </p>

        <h2>5. Pagos</h2>
        <p>
          El pago puede procesarse por Nebrivajes o por proveedores externos según el producto.
          Los métodos disponibles se muestran durante el proceso de compra.
        </p>

        <h2>6. Cancelaciones, cambios y reembolsos</h2>
        <p>
          Las políticas dependen del proveedor y la tarifa seleccionada. Nebrivajes muestra la información
          disponible para que tomes una decisión informada. En caso de duda, contacta con soporte.
        </p>

        <h2>7. Responsabilidad</h2>
        <p>
          Nebrivajes actúa como intermediario/ comparador en muchos casos. La prestación final del servicio
          puede depender de terceros. No nos hacemos responsables de incidencias derivadas de causas ajenas
          a la plataforma (por ejemplo, cancelaciones por parte de aerolíneas o proveedores).
        </p>

        <h2>8. Propiedad intelectual</h2>
        <p>
          El diseño, marca, código y contenidos de la plataforma están protegidos por la normativa aplicable.
          No se permite su reproducción sin autorización.
        </p>

        <h2>9. Modificaciones</h2>
        <p>
          Podemos actualizar estos términos para mejorar el servicio o adaptarnos a cambios legales.
          Publicaremos la fecha de actualización.
        </p>

        <h2>10. Contacto</h2>
        <p>
          Para consultas relacionadas con estos términos, visita la página de Contacto.
        </p>
      </article>
    </div>
  );
}
