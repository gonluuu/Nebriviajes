import { api } from "./client";

export async function getHotels(params) {
  const { data } = await api.get("/hotels", { params });
  return data; // { count, results }
}

export async function getHotelById(id) {
  const { data } = await api.get(`/hotels/${id}`);
  return data;
}

export async function createHotel(payload) {
  const { data } = await api.post("/hotels", payload);
  return data;
}

export async function updateHotel(id, payload) {
  const { data } = await api.put(`/hotels/${id}`, payload);
  return data;
}

export async function deleteHotel(id) {
  const { data } = await api.delete(`/hotels/${id}`);
  return data;
}
