import { api } from "./client";

export async function getOffers(params) {
  const { data } = await api.get("/offers", { params });
  return data; // { count, results }
}


export async function getOfferById(id) {
  try {
    const { data } = await api.get(`/offers/${id}`);
    return data;
  } catch (err) {
    const list = await getOffers();
    const found = (list?.results || []).find(
      (o) => String(o?._id ?? o?.id) === String(id),
    );
    if (found) return found;
    throw err;
  }
}
