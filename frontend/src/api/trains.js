import { api } from "./client";

export async function getTrains(params) {
  const { data } = await api.get("/trains", { params });
  return data; // { count, results }
}

export async function getTrainById(id) {
  const { data } = await api.get(`/trains/${id}`);
  return data;
}
