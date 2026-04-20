import { api } from "./client";

export async function getVehicles(params) {
  const { data } = await api.get("/vehicles", { params });
  return data; // { count, results }
}

export async function getVehicleById(id) {
  const { data } = await api.get(`/vehicles/${id}`);
  return data;
}
