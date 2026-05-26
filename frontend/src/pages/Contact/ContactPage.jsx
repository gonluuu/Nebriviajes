import { useState } from "react";
import { sendContact } from "../../api/contact";

export default function ContactPage() {
  const [status, setStatus] = useState({ type: "", msg: "" });

  async function onSubmit(e) {
    e.preventDefault();

    // Guardamos el formulario antes del await (más fiable)
    const formEl = e.currentTarget;

    setStatus({ type: "loading", msg: "Enviando mensaje..." });

    const form = new FormData(formEl);
    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      topic: form.get("topic"),
      message: form.get("message"),
    };

    try {
      await sendContact(payload);

      setStatus({
        type: "ok",
        msg: "¡Mensaje enviado! Te responderemos lo antes posible.",
      });
    } catch (err) {
      setStatus({
        type: "error",
        msg: "Error al enviar el mensaje. Por favor, inténtalo de nuevo.",

      });
    } finally {
   
      formEl.reset();
    }
  }

  return (
    <div className="container">
      <div className="page-head">
        <h1>Contacto</h1>
        <p className="muted">
          Estamos aquí para ayudarte con reservas, cambios, incidencias o dudas generales.
        </p>
      </div>

      <div className="contact-layout">
        {/* Formulario */}
        <section className="panel">
          <div className="panel-head">
            <h2>Envíanos un mensaje</h2>
            <p className="muted">Normalmente respondemos en menos de 24 horas.</p>
          </div>

          <form className="form" onSubmit={onSubmit}>
            <div className="form-row">
              <div>
                <label className="label">Nombre</label>
                <input className="field" name="name" placeholder="Tu nombre" required />
              </div>

              <div>
                <label className="label">Email</label>
                <input
                  className="field"
                  type="email"
                  name="email"
                  placeholder="tuemail@ejemplo.com"
                  required
                />
              </div>
            </div>

            <label className="label">Motivo</label>
            <select className="field" name="topic" defaultValue="general">
              <option value="general">Consulta general</option>
              <option value="booking">Reserva / Confirmación</option>
              <option value="changes">Cambios / Cancelaciones</option>
              <option value="payment">Pagos / Facturación</option>
              <option value="incidence">Incidencia / Reclamación</option>
            </select>

            <label className="label">Mensaje</label>
            <textarea
              className="field textarea"
              name="message"
              placeholder="Cuéntanos en qué podemos ayudarte..."
              required
            />

            <div className="form-actions">
              <button className="btn" type="submit">Enviar</button>
              <span className={`form-status ${status.type}`}>
                {status.msg}
              </span>
            </div>
          </form>
        </section>

        {/* Información lateral */}
        <aside className="panel panel-alt">
          <h2>Atención al cliente</h2>

          <div className="info-list">
            <div className="info-item">
              <div className="info-title">Horario</div>
              <div className="muted">24/7 · Todos los días</div>
            </div>

            <div className="info-item">
              <div className="info-title">Email</div>
              <div className="muted">soporte@nebrivajes.com</div>
            </div>

            <div className="info-item">
              <div className="info-title">Teléfono</div>
              <div className="muted">+34 600 000 000</div>
            </div>

            <div className="info-item">
              <div className="info-title">Tiempo de respuesta</div>
              <div className="muted">Habitualmente &lt; 24 horas</div>
            </div>
          </div>

          <div className="note">
            <strong>Consejo:</strong> si tu consulta es sobre una reserva, incluye fechas, destino y el email usado.
          </div>
        </aside>
      </div>
    </div>
  );
}