import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../api/client";
import { PATHS } from "../../routes/paths";
import { useAuthStore } from "../../store/useAuthStore";
import "../../styles/Profile.css";
import { resolveImageUrl, imageFallback } from "../../utils/resolveImageUrl";

function formatType(t) {
  const map = {
    hotel: "Hotel",
    flight: "Vuelo",
    train: "Tren",
    vehicle: "Vehículo",
    cruise: "Crucero",
    package: "Paquete",
    offer: "Oferta",
  };
  return map[t] || t;
}

function getTitleFromSnapshot(type, s = {}) {
  if (type === "hotel") return s.name || s.title || s.city || "Hotel";
  if (type === "flight") return s.airline || s.title || `${s.origin || ""} → ${s.destination || ""}`.trim() || "Vuelo";
  if (type === "train") return s.title || `${s.origin || ""} → ${s.destination || ""}`.trim() || "Tren";
  if (type === "vehicle") return s.name || s.model || s.title || s.city || "Vehículo";
  if (type === "cruise") return s.title || s.name || s.route || "Crucero";
  if (type === "package") return s.title || s.name || "Paquete";
  if (type === "offer") return s.title || s.name || s.destination || "Oferta";
  return s.title || s.name || "Reserva";
}

function getPriceFromSnapshot(s = {}) {
  const candidates = [s.price, s.totalPrice, s.pricePerNight, s.basePrice, s.amount];
  return candidates.find((v) => typeof v === "number") ?? null;
}

function ProfilePage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [modalReserva, setModalReserva] = useState(null);
  const [notice, setNotice] = useState(null);

  const hasUser = !!user;
  const isAdmin = Boolean(user?.isAdmin || user?.role === "admin");

  useEffect(() => {
    if (!hasUser) return;

    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/reservas");
        if (!mounted) return;
        setReservas(data?.results || []);
      } catch (err) {
        setNotice({ type: "error", text: err?.response?.data?.message || "No se pudieron cargar tus reservas" });
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [hasUser]);

  const reservasUI = useMemo(() => {
    return (reservas || []).map((r) => {
      const snap = r.snapshot || {};
      const imageUrl = snap.imageUrl || snap.image || snap.img || snap.photo || snap.thumbnail || "";
      return {
        id: r._id,
        type: r.type,
        title: getTitleFromSnapshot(r.type, snap),
        subtitle: snap.city || snap.destination || snap.origin || snap.location || snap.country || "",
        desc: snap.description || snap.desc || snap.summary || "",
        price: getPriceFromSnapshot(snap),
        imageUrl,
        createdAt: r.createdAt,
        userName: r.userName,
        userEmail: r.userEmail,
      };
    });
  }, [reservas]);

  async function handleRestore(reservaId) {
    try {
      setBusyId(reservaId);
      await api.post(`/reservas/${reservaId}/restore`);
      setReservas((prev) => (prev || []).filter((r) => r._id !== reservaId));
      setModalReserva(null);
      setNotice({ type: "success", text: "Reserva anulada. El producto vuelve a estar disponible." });
    } catch (err) {
      setNotice({ type: "error", text: err?.response?.data?.message || "No se pudo anular la reserva" });
    } finally {
      setBusyId(null);
    }
  }

  if (!hasUser) {
    return (
      <div className="profile-page">
        <div className="profile-header profile-hero">
          <h1 className="profile-title">Tu perfil</h1>
        </div>
        <p className="profile-text">Necesitas iniciar sesión para ver tus reservas.</p>
        <div className="profile-actions-row">
          <button className="reserve-btn" onClick={() => navigate(PATHS.LOGIN)}>
            Ir a iniciar sesión
          </button>
          <Link className="header-link" to={PATHS.HOME}>Volver al inicio</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header profile-hero">
        <div>
          <p className="profile-eyebrow">NebriViajes</p>
          <h1 className="profile-title">Panel de reservas</h1>
        </div>
        <div className="profile-subtitle">
          <span className="profile-pill">{user?.name}</span>
          {user?.email ? <span className="profile-pill">{user.email}</span> : null}
          {isAdmin ? <span className="profile-pill admin-pill">Modo administrador</span> : null}
        </div>
      </div>

      {notice ? (
        <div className={`profile-notice ${notice.type === "error" ? "profile-notice-error" : "profile-notice-success"}`}>
          <span>{notice.text}</span>
          <button type="button" onClick={() => setNotice(null)}>Cerrar</button>
        </div>
      ) : null}

      {isAdmin ? (
        <section className="admin-panel">
          <div>
            <p className="profile-eyebrow">Administrador</p>
            <h2>Vista global activada</h2>
            <p>Al entrar con un correo autorizado puedes ver y anular todas las reservas.</p>
          </div>
          <span className="admin-counter">{reservasUI.length} reservas</span>
        </section>
      ) : null}

      <section className="profile-section">
        <div className="profile-section-head">
          <h2 className="profile-section-title">{isAdmin ? "Todas las reservas" : "Tus reservas"}</h2>
          <Link to={PATHS.OFERTAS} className="profile-link">Ver ofertas →</Link>
        </div>

        {loading ? (
          <p className="profile-text">Cargando…</p>
        ) : reservasUI.length === 0 ? (
          <div className="profile-empty">
            <p>No tienes reservas ahora mismo.</p>
            <div className="profile-empty-links">
              <Link className="profile-link" to={PATHS.HOTELES}>Hoteles</Link>
              <Link className="profile-link" to={PATHS.VUELOS}>Vuelos</Link>
              <Link className="profile-link" to={PATHS.TRENES}>Trenes</Link>
              <Link className="profile-link" to={PATHS.VEHICULOS}>Vehículos</Link>
              <Link className="profile-link" to={PATHS.CRUCEROS}>Cruceros</Link>
              <Link className="profile-link" to={PATHS.PAQUETES}>Paquetes</Link>
              <Link className="profile-link" to={PATHS.OFERTAS}>Ofertas</Link>
            </div>
          </div>
        ) : (
          <div className="profile-reservations-grid">
            {reservasUI.map((r) => (
              <div key={r.id} className="reservation-card">
                <img
                  className="reservation-img"
                  src={resolveImageUrl(r.imageUrl) || "https://picsum.photos/400/300"}
                  alt={r.title}
                  loading="lazy"
                  onError={imageFallback}
                />

                <div className="reservation-body">
                  <div className="reservation-top">
                    <h3 className="reservation-title">{r.title}</h3>
                    <span className="reservation-type">{formatType(r.type)}</span>
                  </div>

                  {isAdmin && (r.userName || r.userEmail) ? (
                    <p className="reservation-user">Reservado por: {r.userName || r.userEmail}</p>
                  ) : null}

                  {r.desc || r.subtitle ? <p className="reservation-desc">{r.desc || r.subtitle}</p> : null}

                  <div className="reservation-meta">
                    <span className="reservation-price">{typeof r.price === "number" ? `desde ${r.price}€` : "Reserva activa"}</span>
                    <div className="reservation-actions">
                      <button
                        type="button"
                        className="cancel-btn"
                        disabled={busyId === r.id}
                        onClick={() => setModalReserva(r)}
                      >
                        {busyId === r.id ? "Anulando…" : "Anular reserva"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {modalReserva ? (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setModalReserva(null)}>
          <div className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="confirm-title" onMouseDown={(e) => e.stopPropagation()}>
            <span className="modal-icon">!</span>
            <h2 id="confirm-title">¿Seguro que quieres anular esta reserva?</h2>
            <p>Vas a anular <strong>{modalReserva.title}</strong>. El producto volverá a estar disponible en el catálogo.</p>
            <div className="modal-actions">
              <button type="button" className="modal-secondary" onClick={() => setModalReserva(null)} disabled={busyId === modalReserva.id}>
                No, mantener reserva
              </button>
              <button type="button" className="modal-danger" onClick={() => handleRestore(modalReserva.id)} disabled={busyId === modalReserva.id}>
                {busyId === modalReserva.id ? "Anulando…" : "Sí, anular"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default ProfilePage;
