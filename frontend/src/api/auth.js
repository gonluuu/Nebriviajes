import { api } from "./client";

export async function registerUser(payload) {
  const { data } = await api.post("/auth/register", payload);
  return data; // { user, token }
}

export async function loginUser(payload) {
  const { data } = await api.post("/auth/login", payload);
  return data; // { user, token }
}
