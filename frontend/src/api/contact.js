import { api } from "./client";


export async function sendContact(payload) {
  const { data } = await api.post("/contact", payload);
  return data;
}
