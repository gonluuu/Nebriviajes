import { api } from "./client";

export async function getFlights(params) {
  const { data } = await api.get("/flights", { params });
  return data; // { count, results }
}

export async function getFlightById(id) {
  const { data } = await api.get(`/flights/${id}`);
  return data;
}
