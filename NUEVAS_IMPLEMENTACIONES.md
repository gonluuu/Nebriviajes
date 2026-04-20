
---

## 🐛 TAREA 1 — CORRECCIÓN: Favoritos no funcionan en Vuelos, Hoteles y Vehículos

Revisa por qué el icono de favoritos (corazón) no funciona correctamente en las
páginas de Vuelos, Hoteles y Vehículos. Investiga y corrige todos los fallos.

**Checklist de puntos a revisar:**
- El icono de corazón renderiza correctamente en cada tarjeta de resultado.
- Al hacer clic, cambia de estado (vacío ↔ relleno) de forma visual inmediata.
- Si el usuario NO está autenticado: no guarda nada y muestra un toast/mensaje
  indicando que debe iniciar sesión.
- Si el usuario SÍ está autenticado:
  - Llama correctamente al endpoint POST /api/favoritos para añadir.
  - Llama correctamente al endpoint DELETE /api/favoritos/:id para eliminar.
  - El estado del corazón persiste si el usuario recarga la página
    (se recupera desde GET /api/favoritos al montar el componente).
  - El store/estado global se actualiza correctamente tras cada acción.
- No hay errores en consola relacionados con favoritos.
- La página "Mis Favoritos" refleja en tiempo real los cambios hechos en
  Vuelos, Hoteles y Vehículos.

**Proceso:**
1. Analiza los componentes de tarjeta en Vuelos, Hoteles y Vehículos.
2. Analiza el endpoint /api/favoritos en el backend.
3. Analiza el store/contexto de favoritos en el frontend.
4. Identifica los fallos concretos con su causa raíz.
5. Presenta el diagnóstico y el plan de corrección. Espera mi validación.
6. Corrige únicamente lo necesario, sin refactorizar código no implicado.

---

## ✨ TAREA 2 — NUEVOS FILTROS AVANZADOS: Cruceros, Trenes, Paquetes y Ofertas

Implementa filtros avanzados estilo Skyscanner en las cuatro páginas indicadas.
Respeta el mismo patrón visual y de código que ya existe en los filtros de
Vuelos, Hoteles y Vehículos.

### Filtros para Cruceros:
- Precio total (slider de rango mín/máx)
- Duración en días (slider)
- Destino/región (Mediterráneo, Caribe, Norte de Europa, Asia, etc.) (checkboxes)
- Naviera/compañía (checkboxes)
- Número de pasajeros (selector)
- Tipo de cabina (interior, exterior, balcón, suite)
- Régimen de comidas (sin comidas, media pensión, pensión completa, todo incluido)
- Escalas/puertos visitados (slider mín/máx)
- Cancelación gratuita (toggle)

### Filtros para Trenes:
- Precio (slider de rango mín/máx)
- Duración del trayecto (slider)
- Compañía ferroviaria (checkboxes)
- Clase (turista, preferente, business, primera)
- Tipo de tren (AVE, regional, internacional, Eurail)
- Hora de salida / llegada (franjas: mañana, tarde, noche)
- Número de transbordos (directo, 1, 2+)
- Equipaje incluido (toggle)

### Filtros para Paquetes:
- Precio por persona (slider de rango mín/máx)
- Duración en días (slider)
- Destino (checkboxes o buscador)
- Tipo de paquete (vuelo + hotel, vuelo + hotel + coche, todo incluido, crucero + vuelo)
- Régimen alimenticio (solo alojamiento, desayuno, media pensión, todo incluido)
- Categoría hotel incluido (1★ a 5★)
- Salidas desde (aeropuerto de origen) (checkboxes)
- Cancelación gratuita (toggle)
- Valoración del paquete (slider)

### Filtros para Ofertas:
- Tipo de oferta (vuelo, hotel, paquete, vehículo, crucero, tren) (checkboxes)
- Precio máximo (slider)
- Destino (buscador o checkboxes)
- Descuento mínimo (slider de porcentaje: 10%, 20%, 30%, 50%+)
- Fecha de viaje (rango de fechas)
- Duración estimada (slider en días)
- Solo ofertas flash (toggle: ofertas con tiempo limitado)
- Ordenar por: mayor descuento, menor precio, más reciente

### Comportamiento común a los 4 filtros:
- Sidebar izquierda en desktop; botón "Filtros" con panel deslizante en mobile.
- Filtrado en tiempo real sin recargar página.
- Botón "Restablecer filtros" que limpia todos los valores.
- Contador activo: "Mostrando X de Y resultados".
- Ordenar por: precio ascendente/descendente, mejor valoración, más popular.
- Mismo estilo visual que los filtros ya implementados en Vuelos, Hoteles y Vehículos.

---

## 📋 PROCESO DE TRABAJO — USA PLAN MODE

**PASO 1 — ANÁLISIS:**
1. Revisa los filtros ya implementados en Vuelos, Hoteles y Vehículos para
   reutilizar exactamente el mismo patrón de componente, estilos y lógica.
2. Revisa las páginas de Cruceros, Trenes, Paquetes y Ofertas para entender
   su estructura actual antes de modificarlas.
3. Para la Tarea 1, localiza los archivos implicados en el fallo de favoritos.

**PASO 2 — PLAN (espera mi validación antes de escribir código):**
- Diagnóstico detallado de los fallos de favoritos con causa raíz de cada uno.
- Lista de componentes a crear o modificar para los nuevos filtros.
- Confirmación de que se reutiliza el patrón existente de filtros.
- Orden de implementación: Tarea 1 primero, luego Tarea 2 página por página.

**PASO 3 — IMPLEMENTACIÓN (solo tras mi aprobación):**
- Corrige primero todos los fallos de favoritos (Tarea 1).
- Luego implementa los filtros página por página: Cruceros → Trenes → Paquetes → Ofertas.
- Resume lo implementado tras cada bloque antes de continuar.
- Si encuentras ambigüedad, pregunta antes de asumir.