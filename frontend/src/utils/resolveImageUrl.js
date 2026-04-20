export function resolveImageUrl(url) {
  if (!url) return "";

  // Si ya es URL completa
  if (/^https?:\/\//i.test(url)) return url;

  // Si es ruta absoluta del FRONT (/fotos..., /images..., etc.)
  if (url.startsWith("/fotosNebriviajes") || url.startsWith("/images")) {
    return url;
  }

  // Si es ruta absoluta (ej /uploads/...) -> la servirá el backend
  if (url.startsWith("/")) {
    const base = (import.meta.env.VITE_API_URL || "").replace(/\/api\/?$/, "");
    return `${base}${url}`;
  }

  // Si te guardan solo nombre de archivo
  return `/fotosNebriviajes/${url}`;
}
