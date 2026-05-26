import axios from "axios";

function getBaseURL() {
  const raw = import.meta.env.VITE_API_URL;

  if (!raw) return "/api";

  const trimmed = String(raw).replace(/\/+$/, ""); // quita "/" final
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
}

export const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
});

// Añade token automáticamente si existe (nivel DAW, sin complicaciones)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normaliza errores para que siempre haya un .response.data.message usable
api.interceptors.response.use(
  (res) => res,
  (error) => {
    try {
      const data = error?.response?.data;

      // Si el backend devuelve HTML o texto plano (p. ej. una página de error)
      if (typeof data === "string") {
        // Si contiene un DOCTYPE, seguramente NO estás pegando al backend (proxy/baseURL mal)
        if (data.toLowerCase().includes("<!doctype")) {
          error.response.data = {
            message:
              "No se pudo contactar con la API. Revisa VITE_API_URL o el proxy del frontend.",
          };
        } else {
          const firstLine = data.split("\n")[0].trim();
          error.response.data = { message: firstLine || "Error del servidor" };
        }
      }
    } catch (_) {
      // noop
    }

    return Promise.reject(error);
  },
);
