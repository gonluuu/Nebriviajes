import { api } from "./client";

// POST /api/reservas
export async function createReserva({ type, itemId }) {
  const { data } = await api.post("/reservas", { type, itemId });
  return data;
}

// GET /api/reservas
export async function getReservas(params) {
  const { data } = await api.get("/reservas", { params });
  return data;
}

// POST /api/reservas/:id/restore
export async function restoreReserva(reservaId) {
  const { data } = await api.post(`/reservas/${reservaId}/restore`);
  return data;
}
