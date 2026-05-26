import { api } from "./client";

export async function startCheckout(items) {
  const { data } = await api.post("/payments/checkout", {
    items,
    origin: window.location.origin,
  });

  if (!data?.url) {
    throw new Error("No se recibio la URL de Stripe");
  }

  window.location.href = data.url;
}

export async function confirmCheckout({ sessionId }) {
  const { data } = await api.post("/payments/confirm", { sessionId });
  return data;
}
