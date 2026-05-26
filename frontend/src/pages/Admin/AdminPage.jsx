import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAdminStats, getAdminUsers, deleteAdminUser } from "../../api/admin";
import { getCurrentUser } from "../../api/auth";
import { getHotels, createHotel, updateHotel, deleteHotel } from "../../api/hotels";
import { getReservas, restoreReserva } from "../../api/reservas";
import { PATHS } from "../../routes/paths";
import { useAuthStore } from "../../store/useAuthStore";
import "../../styles/Admin.css";

const emptyHotel = {
  name: "",
  city: "",
  address: "",
  latitude: "",
  longitude: "",
  price: "",
  date: "",
  imageUrl: "",
  available: true,
};

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("es-ES");
}

function getArray(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.reservas)) return data.reservas;
  if (Array.isArray(data?.users)) return data.users;
  if (Array.isArray(data?.hotels)) return data.hotels;
  return [];
}

function checkAdmin(currentUser) {
  return Boolean(currentUser?.isAdmin || currentUser?.role === "admin");
}

function AdminPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const setLogin = useAuthStore((s) => s.login);

  const [authChecked, setAuthChecked] = useState(false);
  const [hasAdminAccess, setHasAdminAccess] = useState(checkAdmin(user));
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [hotelForm, setHotelForm] = useState(emptyHotel);
  const [editingHotelId, setEditingHotelId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadAdminPanel() {
      if (!token) {
        navigate(PATHS.LOGIN);
        return;
      }

      try {
        setLoading(true);
        setNotice(null);

        // Refrescamos el usuario desde backend para no depender de un localStorage antiguo.
        const current = await getCurrentUser();
        const freshUser = current?.user;
        if (freshUser) setLogin(freshUser, token);

        const isAdmin = checkAdmin(freshUser);
        if (!mounted) return;
        setHasAdminAccess(isAdmin);
        setAuthChecked(true);

        if (!isAdmin) {
          setLoading(false);
          return;
        }

        const [statsData, usersData, reservasData, hotelsData] = await Promise.all([
          getAdminStats().catch(() => null),
          getAdminUsers().catch(() => []),
          getReservas().catch(() => []),
          getHotels().catch(() => []),
        ]);

        if (!mounted) return;
        setStats(statsData);
        setUsers(getArray(usersData));
        setReservas(getArray(reservasData));
        setHotels(getArray(hotelsData));
      } catch (err) {
        if (!mounted) return;
        setAuthChecked(true);
        setHasAdminAccess(false);
        setNotice({
          type: "error",
          text: err?.response?.data?.message || "No se pudo cargar el panel admin",
        });
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadAdminPanel();

    return () => {
      mounted = false;
    };
  }, [token, navigate, setLogin]);

  const totals = useMemo(
    () => [
      { label: "Usuarios", value: stats?.usersCount ?? users.length },
      {
        label: "Admins",
        value: stats?.adminCount ?? users.filter((u) => u.isAdmin || u.role === "admin").length,
      },
      { label: "Reservas", value: stats?.reservasCount ?? reservas.length },
      { label: "Hoteles", value: stats?.hotelsCount ?? hotels.length },
    ],
    [stats, users, reservas, hotels]
  );

  function handleHotelChange(e) {
    const { name, value, type, checked } = e.target;
    setHotelForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function editHotel(hotel) {
    setEditingHotelId(hotel._id);
    setHotelForm({
      name: hotel.name || "",
      city: hotel.city || "",
      address: hotel.address || "",
      latitude: hotel.latitude ?? "",
      longitude: hotel.longitude ?? "",
      price: hotel.price ?? "",
      date: hotel.date ? String(hotel.date).slice(0, 10) : "",
      imageUrl: hotel.imageUrl || "",
      available: hotel.available !== false,
    });
  }

  async function submitHotel(e) {
    e.preventDefault();

    try {
      setBusy(true);
      const payload = {
        ...hotelForm,
        price: Number(hotelForm.price),
        latitude: hotelForm.latitude === "" ? null : Number(hotelForm.latitude),
        longitude: hotelForm.longitude === "" ? null : Number(hotelForm.longitude),
      };
      const saved = editingHotelId
        ? await updateHotel(editingHotelId, payload)
        : await createHotel(payload);

      setHotels((prev) =>
        editingHotelId
          ? prev.map((h) => (h._id === editingHotelId ? saved : h))
          : [saved, ...prev]
      );
      setHotelForm(emptyHotel);
      setEditingHotelId(null);
      setNotice({ type: "success", text: editingHotelId ? "Hotel actualizado" : "Hotel creado" });
    } catch (err) {
      setNotice({ type: "error", text: err?.response?.data?.message || "No se pudo guardar el hotel" });
    } finally {
      setBusy(false);
    }
  }

  function askConfirm(message, onConfirm) {
    setConfirmAction({ message, onConfirm });
  }

  async function removeHotel(id) {
    try {
      setBusy(true);
      await deleteHotel(id);
      setHotels((prev) => prev.filter((h) => h._id !== id));
      setNotice({ type: "success", text: "Hotel eliminado" });
    } catch (err) {
      setNotice({ type: "error", text: err?.response?.data?.message || "No se pudo eliminar el hotel" });
    } finally {
      setBusy(false);
    }
  }

  async function cancelReserva(id) {
    try {
      setBusy(true);
      await restoreReserva(id);
      setReservas((prev) => prev.filter((r) => r._id !== id));
      setNotice({ type: "success", text: "Reserva anulada correctamente" });
    } catch (err) {
      setNotice({ type: "error", text: err?.response?.data?.message || "No se pudo anular la reserva" });
    } finally {
      setBusy(false);
    }
  }

  async function removeUser(id) {
    try {
      setBusy(true);
      await deleteAdminUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      setNotice({ type: "success", text: "Usuario eliminado" });
    } catch (err) {
      setNotice({ type: "error", text: err?.response?.data?.message || "No se pudo eliminar el usuario" });
    } finally {
      setBusy(false);
    }
  }

  if (!authChecked || loading) {
    return (
      <main className="admin-page">
        <p className="admin-loading">Cargando panel administrador…</p>
      </main>
    );
  }

  if (!hasAdminAccess) {
    return (
      <main className="admin-page">
        <section className="admin-card">
          <h1>No tienes permisos de administrador</h1>
          <p>Tu usuario no está marcado como administrador. Comprueba que tu perfil tenga role = admin en Supabase y vuelve a iniciar sesión.</p>
          <Link className="admin-back" to={PATHS.PERFIL}>Volver a mis reservas</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-page">

      {confirmAction && (
        <div className="admin-confirm-backdrop" role="presentation" onMouseDown={() => setConfirmAction(null)}>
          <div className="admin-confirm-modal" role="dialog" aria-modal="true" onMouseDown={(e) => e.stopPropagation()}>
            <h2>Confirmar acción</h2>
            <p>{confirmAction.message}</p>
            <div className="admin-confirm-actions">
              <button type="button" className="admin-ghost" onClick={() => setConfirmAction(null)}>Cancelar</button>
              <button
                type="button"
                className="admin-danger"
                onClick={() => {
                  const run = confirmAction.onConfirm;
                  setConfirmAction(null);
                  run?.();
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="admin-hero">
        <div>
          <p className="admin-eyebrow">NebriViajes</p>
          <h1>Panel administrador</h1>
          <p>Gestiona reservas, usuarios, hoteles y estadísticas desde una zona privada.</p>
        </div>
        <Link className="admin-back" to={PATHS.PERFIL}>Volver a mis reservas</Link>
      </section>

      {notice && (
        <div className={`admin-notice ${notice.type === "error" ? "admin-notice-error" : "admin-notice-success"}`}>
          <span>{notice.text}</span>
          <button type="button" onClick={() => setNotice(null)}>Cerrar</button>
        </div>
      )}

      <section className="admin-stats-grid">
        {totals.map((item) => (
          <article className="admin-stat" key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </article>
        ))}
      </section>

      <section className="admin-card">
        <div className="admin-section-head">
          <h2>Reservas</h2>
          <span>{reservas.length} en total</span>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Usuario</th><th>Tipo</th><th>Producto</th><th>Fecha</th><th>Acción</th></tr>
            </thead>
            <tbody>
              {reservas.map((r) => (
                <tr key={r._id}>
                  <td>{r.userName || r.userEmail || r.user?.email || "—"}</td>
                  <td>{r.type || "—"}</td>
                  <td>{r.snapshot?.name || r.snapshot?.title || r.snapshot?.city || r.snapshot?.destination || r.hotel?.name || "Reserva"}</td>
                  <td>{formatDate(r.createdAt)}</td>
                  <td><button className="admin-danger" disabled={busy} onClick={() => askConfirm("¿Seguro que quieres anular esta reserva?", () => cancelReserva(r._id))}>Anular</button></td>
                </tr>
              ))}
              {reservas.length === 0 && <tr><td colSpan="5">No hay reservas.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-card">
        <div className="admin-section-head">
          <h2>{editingHotelId ? "Editar hotel" : "Añadir hotel"}</h2>
          {editingHotelId && (
            <button className="admin-ghost" type="button" onClick={() => { setEditingHotelId(null); setHotelForm(emptyHotel); }}>
              Cancelar edición
            </button>
          )}
        </div>
        <form className="admin-form" onSubmit={submitHotel}>
          <input name="name" placeholder="Nombre del hotel" value={hotelForm.name} onChange={handleHotelChange} required />
          <input name="city" placeholder="Ciudad" value={hotelForm.city} onChange={handleHotelChange} required />
          <input name="address" placeholder="Dirección exacta del hotel" value={hotelForm.address} onChange={handleHotelChange} />
          <input name="latitude" type="number" step="any" min="-90" max="90" placeholder="Latitud, ej: 40.4237" value={hotelForm.latitude} onChange={handleHotelChange} />
          <input name="longitude" type="number" step="any" min="-180" max="180" placeholder="Longitud, ej: -3.7119" value={hotelForm.longitude} onChange={handleHotelChange} />
          <input name="price" type="number" min="0" placeholder="Precio" value={hotelForm.price} onChange={handleHotelChange} required />
          <input name="date" type="date" value={hotelForm.date} onChange={handleHotelChange} required />
          <input name="imageUrl" placeholder="URL de imagen" value={hotelForm.imageUrl} onChange={handleHotelChange} />
          <label className="admin-check">
            <input name="available" type="checkbox" checked={hotelForm.available} onChange={handleHotelChange} /> Disponible
          </label>
          <button className="admin-primary" disabled={busy}>{editingHotelId ? "Guardar cambios" : "Crear hotel"}</button>
        </form>
      </section>

      <section className="admin-card">
        <div className="admin-section-head">
          <h2>Hoteles</h2>
          <span>{hotels.length} disponibles</span>
        </div>
        <div className="admin-list">
          {hotels.map((hotel) => (
            <article className="admin-list-item" key={hotel._id}>
              <div>
                <strong>{hotel.name}</strong>
                <p>{hotel.city} · {hotel.address || "Sin dirección"} · {hotel.price}€ · {formatDate(hotel.date)}</p>
                <p className="muted">Coords: {hotel.latitude ?? "—"}, {hotel.longitude ?? "—"}</p>
              </div>
              <div className="admin-row-actions">
                <button className="admin-ghost" type="button" onClick={() => editHotel(hotel)}>Editar</button>
                <button className="admin-danger" type="button" disabled={busy} onClick={() => askConfirm("¿Seguro que quieres eliminar este hotel?", () => removeHotel(hotel._id))}>Eliminar</button>
              </div>
            </article>
          ))}
          {hotels.length === 0 && <p>No hay hoteles.</p>}
        </div>
      </section>

      <section className="admin-card">
        <div className="admin-section-head">
          <h2>Usuarios</h2>
          <span>{users.length} registrados</span>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Fecha</th><th>Acción</th></tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name || "—"}</td>
                  <td>{u.email || "—"}</td>
                  <td>{u.isAdmin || u.role === "admin" ? "Admin" : "Usuario"}</td>
                  <td>{formatDate(u.createdAt)}</td>
                  <td>
                    <button className="admin-danger" type="button" disabled={busy || u._id === user?._id} onClick={() => askConfirm("¿Seguro que quieres eliminar este usuario?", () => removeUser(u._id))}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && <tr><td colSpan="5">No hay usuarios.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default AdminPage;
