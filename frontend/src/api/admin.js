import { api } from "./client";

export async function getAdminStats() {
  const { data } = await api.get("/admin/stats");
  return data;
}

export async function getAdminUsers() {
  const { data } = await api.get("/admin/users");
  return data;
}

export async function deleteAdminUser(id) {
  const { data } = await api.delete(`/admin/users/${id}`);
  return data;
}
