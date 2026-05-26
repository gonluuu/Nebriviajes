export const FALLBACK_IMAGE = "/fotosNebriviajes/placeholder-nebriviajes.svg";

export function resolveImageUrl(url) {
  if (!url) return FALLBACK_IMAGE;

  const value = String(url).trim();
  if (!value) return FALLBACK_IMAGE;

  // Si ya es URL completa
  if (/^https?:\/\//i.test(value)) return value;

  // Si es ruta absoluta del FRONT (/fotos..., /images..., etc.)
  if (value.startsWith("/fotosNebriviajes") || value.startsWith("/images")) {
    return value;
  }

  // Si es ruta absoluta (ej /uploads/...) -> la servirá el backend
  if (value.startsWith("/")) {
    const base = (import.meta.env.VITE_API_URL || "").replace(/\/api\/?$/, "");
    return `${base}${value}`;
  }

  // Si guardas solo el nombre de archivo en Supabase
  return `/fotosNebriviajes/${value}`;
}

export function imageFallback(e) {
  e.currentTarget.onerror = null;
  e.currentTarget.src = FALLBACK_IMAGE;
}
