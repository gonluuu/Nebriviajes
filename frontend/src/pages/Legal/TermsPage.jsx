export default function TermsPage() {
  return (
    <div className="container">
      <div className="legal">
        <h1>Términos y condiciones</h1>
        <p className="muted">
          Última actualización: {new Date().toLocaleDateString("es-ES")}
        </p>

        <h2>1. Objeto</h2>
        <p>
          Nebrivajes ofrece una plataforma para buscar y comparar servicios de viaje
          (vuelos, hoteles, trenes, paquetes, vehículos, cruceros y ofertas). Las reservas
          pueden gestionarse a través de proveedores externos.
        </p>

        <h2>2. Uso del sitio</h2>
        <ul>
          <li>Debes proporcionar datos veraces al registrarte o reservar.</li>
          <li>No está permitido el uso fraudulento o el acceso no autorizado.</li>
          <li>Podemos actualizar la web para mejorar seguridad y rendimiento.</li>
        </ul>

        <h2>3. Precios y disponibilidad</h2>
        <p>
          Los precios y la disponibilidad pueden cambiar. Antes de confirmar, revisa el
          precio final y las condiciones aplicables (cancelación, cambios, equipaje, etc.).
        </p>

        <h2>4. Cancelaciones y cambios</h2>
        <p>
          Las condiciones dependen del proveedor y de la tarifa seleccionada. Nebrivajes
          muestra la información disponible para que decidas con claridad antes de pagar.
        </p>

        <h2>5. Responsabilidad</h2>
        <p>
          Nebrivajes actúa como plataforma de búsqueda/gestión y no garantiza la prestación
          directa del servicio cuando este depende de terceros.
        </p>

        <h2>6. Contacto</h2>
        <p>
          Para consultas, visita la página de Contacto.
        </p>
      </div>
    </div>
  );
}
