import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../api/client";
import { PATHS } from "../../routes/paths";
import { useAuthStore } from "../../store/useAuthStore";
import "../../styles/Profile.css";
import { resolveImageUrl } from "../../utils/resolveImageUrl";

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
  const p = candidates.find((v) => typeof v === "number") ?? null;
  return p;
}

function ProfilePage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const hasUser = !!user;

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
        const msg = err?.response?.data?.message || "No se pudieron cargar tus reservas";
        alert(msg);
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
      const imageUrl =
        snap.imageUrl || snap.image || snap.img || snap.photo || snap.thumbnail || "";
      return {
        id: r._id,
        type: r.type,
        title: getTitleFromSnapshot(r.type, snap),
        subtitle:
          snap.city || snap.destination || snap.origin || snap.location || snap.country || "",
        desc: snap.description || snap.desc || snap.summary || "",
        price: getPriceFromSnapshot(snap),
        imageUrl,
        createdAt: r.createdAt,
      };
    });
  }, [reservas]);

  async function handleRestore(reservaId) {
    try {
      setBusyId(reservaId);
      await api.post(`/reservas/${reservaId}/restore`);
      setReservas((prev) => (prev || []).filter((r) => r._id !== reservaId));
      alert("Reserva anulada. El producto vuelve a estar disponible.");
    } catch (err) {
      const msg = err?.response?.data?.message || "No se pudo anular la reserva";
      alert(msg);
    } finally {
      setBusyId(null);
    }
  }

  if (!hasUser) {
    return (
      <div className="profile-page">
        <div className="profile-header">
          <h1 className="profile-title">Tu perfil</h1>
        </div>
        <p style={{ marginTop: 0 }}>
          Necesitas iniciar sesión para ver tus reservas.
        </p>
        <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
          <button className="reserve-btn" onClick={() => navigate(PATHS.LOGIN)}>
            Ir a iniciar sesión
          </button>
          <Link className="header-link" to={PATHS.HOME}>
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1 className="profile-title">Tu perfil</h1>
        <div className="profile-subtitle">
          <span className="profile-pill">{user?.name}</span>
          {user?.email ? <span className="profile-pill">{user.email}</span> : null}
        </div>
      </div>

      <section className="profile-section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
          <h2 className="profile-section-title">Tus reservas</h2>
          <div style={{ display: "flex", gap: "15px" }}>
            <Link to={PATHS.FAVORITOS} className="profile-link">
              Mis Favoritos (❤️)
            </Link>
            <Link to={PATHS.OFERTAS} className="profile-link">
              Ver ofertas →
            </Link>
          </div>
        </div>

        {loading ? (
          <p style={{ marginTop: 14 }}>Cargando…</p>
        ) : reservasUI.length === 0 ? (
          <div className="profile-empty">
            <p style={{ margin: 0 }}>No tienes reservas ahora mismo.</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
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
                />

                <div className="reservation-body">
                  <div className="reservation-top">
                    <h3 className="reservation-title">{r.title}</h3>
                    <span className="reservation-type">{formatType(r.type)}</span>
                  </div>

                  {r.desc || r.subtitle ? (
                    <p className="reservation-desc">
                      {r.desc || r.subtitle}
                    </p>
                  ) : null}

                  <div className="reservation-meta">
                    <span className="reservation-price">
                      {typeof r.price === "number" ? `desde ${r.price}€` : ""}
                    </span>

                    <div className="reservation-actions">
                      <button
                        type="button"
                        className="cancel-btn"
                        disabled={busyId === r.id}
                        onClick={() => handleRestore(r.id)}
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
    </div>
  );
}

export default ProfilePage;
