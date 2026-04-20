import { api } from "./client";

export async function getPackages(params) {
  const { data } = await api.get("/packages", { params });
  return data; // { count, results }
}


export async function getPackageById(id) {
  try {
    const { data } = await api.get(`/packages/${id}`);
    return data;
  } catch (err) {
    const list = await getPackages();
    const found = (list?.results || []).find(
      (p) => String(p?._id ?? p?.id) === String(id),
    );
    if (found) return found;
    throw err;
  }
}
