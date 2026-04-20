import { api } from "./client";

export async function getCruises(params) {
  const { data } = await api.get("/cruises", { params });
  return data; // { count, results }
}

export async function getCruiseById(id) {
  const { data } = await api.get(`/cruises/${id}`);
  return data;
}
