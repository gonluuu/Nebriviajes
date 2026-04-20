# 🧳 NEBRIVIAJES — Plan de Escalado y Mejora

## ROL
Actúa como un arquitecto frontend/fullstack senior especializado en aplicaciones de viajes tipo Skyscanner. Tu objetivo es escalar y mejorar la aplicación Nebriviajes respetando estrictamente el diseño y stack existentes.

---

## ⚠️ RESTRICCIONES ABSOLUTAS
- NO instales librerías nuevas ni cambies las dependencias del package.json existente.
- NO cambies la paleta de colores: respeta el rojo oscuro/granate (#7B1D1D o equivalente), blanco, negro y gris del diseño actual.
- NO cambies la tipografía ni los estilos globales definidos en /frontend/src/styles/.
- NO refactorices componentes existentes que no estén directamente implicados en las nuevas features.
- Mantén la estructura de carpetas: /frontend/src/{api, assets, components, layouts, pages, routes, store, styles, utils} y /backend/src/{controllers, db, models, routes}.
- Respeta los patrones de código ya establecidos (naming conventions, estructura de componentes, llamadas a API).

---

## 🎯 NUEVAS IMPLEMENTACIONES

### 1. SISTEMA DE FILTROS AVANZADOS (estilo Skyscanner)
Implementar filtros para cada categoría de búsqueda:

**Vuelos:**
- Precio (slider de rango mín/máx)
- Número de escalas (directo, 1 escala, 2+ escalas)
- Aerolínea (checkboxes)
- Duración del vuelo (slider)
- Hora de salida / llegada (rangos por franja horaria: mañana, tarde, noche)
- Clase (económica, business, primera)
- Equipaje incluido (sí/no)

**Hoteles:**
- Precio por noche (slider)
- Estrellas (1★ a 5★)
- Valoración de usuarios (slider)
- Tipo de alojamiento (hotel, apartamento, hostal, resort)
- Servicios incluidos (wifi, piscina, desayuno, parking, spa)
- Distancia al centro (slider en km)
- Cancelación gratuita (toggle)

**Vehículos:**
- Precio por día (slider)
- Tipo de vehículo (económico, SUV, familiar, furgoneta, lujo)
- Transmisión (manual/automática)
- Combustible (gasolina, diésel, eléctrico, híbrido)
- Puertas (2, 4, 5)
- Kilometraje ilimitado (toggle)
- Proveedor (checkboxes)

**Filtros comunes a todos:**
- Ordenar por: precio ascendente/descendente, mejor valoración, más popular
- Panel de filtros colapsable en mobile (offcanvas lateral)
- Botón "Restablecer filtros"
- Contador de resultados activo ("Mostrando X de Y resultados")
- Los filtros deben funcionar en tiempo real (sin recargar página)

---

### 2. LISTA DE FAVORITOS POR USUARIO
- Icono de corazón (❤️) en cada tarjeta de resultado (vuelo, hotel, vehículo, crucero, tren, paquete)
  - Estado: vacío (no guardado) / relleno (guardado)
  - Solo disponible para usuarios autenticados; si no está logueado, redirigir a login con mensaje toast
- Página dedicada "Mis Favoritos" accesible desde "Mi Cuenta"
  - Agrupada por categoría con tabs: Vuelos | Hoteles | Vehículos | Otros
  - Opción de eliminar favorito individual o limpiar toda la categoría
  - Si no hay favoritos, mostrar estado vacío con CTA a buscar
- Persistencia: guardar favoritos en base de datos por usuario (endpoint REST en backend)
  - POST /api/favoritos — añadir
  - DELETE /api/favoritos/:id — eliminar
  - GET /api/favoritos — obtener todos los del usuario autenticado
- En frontend, sincronizar con el store global (Zustand/Redux/Context según el patrón ya usado en /store)

---

## 📋 PROCESO DE TRABAJO — USA PLAN MODE

**PASO 1 — ANÁLISIS (no escribas código aún):**
1. Lee y analiza los archivos clave: App.jsx, main.jsx, los componentes en /components, las páginas en /pages, el store en /store y las rutas en /routes.
2. Identifica el sistema de estado global usado (Zustand, Redux, Context API).
3. Identifica cómo se estructuran las llamadas a la API (axios, fetch, react-query...).
4. Lee los modelos del backend (/backend/src/models) para entender la estructura de datos actual.

**PASO 2 — PLAN DE IMPLEMENTACIÓN (espera validación antes de continuar):**
Genera un documento de plan con:
- Lista de pantallas/páginas nuevas o modificadas
- Lista de componentes nuevos a crear
- Lista de componentes existentes a modificar (con justificación mínima)
- Endpoints backend necesarios
- Cambios en el store/estado global
- Orden de implementación sugerido (dependencias entre tareas)

**PASO 3 — IMPLEMENTACIÓN (solo tras validación del plan):**
- Implementa por bloques: primero backend (modelos + endpoints), luego store, luego componentes, luego páginas.
- Tras cada bloque, muestra un resumen de lo implementado antes de continuar.
- Si encuentras ambigüedad, pregunta antes de asumir.

---

## 🎨 GUÍA DE DISEÑO A RESPETAR
- Color primario: granate/rojo oscuro (el del header y botones "Buscar Hoteles", "Buscar Vuelos")
- Botones secundarios: borde con color primario, fondo blanco (estilo "Ver Ofertas")
- Tarjetas: fondo blanco, bordes redondeados, sombra suave
- Inputs: borde oscuro fino, placeholder en gris
- Badges/chips: borde redondeado, fondo blanco, texto oscuro (estilo "Cancelación gratis")
- Tipografía: la misma del proyecto (no introducir Google Fonts nuevas)
- Iconos: los mismos ya usados en el proyecto (no añadir librerías de iconos nuevas)
- El panel de filtros en desktop debe ser una sidebar izquierda; en mobile, un botón "Filtros" que abre un panel deslizante

---

Comienza con el PASO 1 (análisis) y luego presenta el PASO 2 (plan) para que yo lo valide antes de escribir una sola línea de código.