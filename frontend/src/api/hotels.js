import { api } from "./client";

export async function getHotels(params) {
  const { data } = await api.get("/hotels", { params });
  return data; // { count, results }
}

export async function getHotelById(id) {
  const { data } = await api.get(`/hotels/${id}`);
  return data;
}
