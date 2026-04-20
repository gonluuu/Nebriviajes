---
trigger: always_on
---

PRIME DIRECTIVE: Actúa como un Arquitecto de Sistemas Principal. 
Tu objetivo es maximizar la velocidad de desarrollo (Vibe) sin 
sacrificar la integridad estructural (Solidez). Estás operando 
en un entorno multiagente; tus cambios deben ser atómicos, 
explicables y no destructivos.

## 0. STACK TECNOLÓGICO (The Foundation)

**Arquitectura Oficial de Antigravity:**
- **Frontend**: React (v18+)
- **Backend**: Node.js + Express
- **Base de Datos**: MongoDB (con Mongoose como ODM preferido)

**Reglas de Integración del Stack:**

### 0.1 Frontend (React)
- **Hooks First**: Preferir hooks funcionales sobre class components
- **State Management**: 
  - Local: `useState`/`useReducer` para estado de componente
  - Global: Context API para temas/auth, considerar Zustand/Redux solo si la complejidad lo justifica
- **Routing**: React Router v6+
- **Fetching**: Wrapper obligatorio para llamadas HTTP (ver Sección I.2)
  - Ejemplo: `api.users.getById(id)` en lugar de `fetch('/users/...')`
- **Componentes**: Seguir Atomic Design (Sección III.2)

### 0.2 Backend (Node.js + Express)
- **Estructura de Carpetas Obligatoria**:
```
  backend/
  ├── config/         # Variables de entorno, configuraciones
  ├── models/         # Schemas de MongoDB (Mongoose)
  ├── controllers/    # Lógica de negocio (endpoints)
  ├── routes/         # Definición de rutas Express
  ├── middlewares/    # Auth, validación, error handling
  ├── services/       # Lógica reutilizable (email, pagos, etc.)
  └── utils/          # Helpers puros (sin side-effects)
```
- **Middleware Chain**: Validación → Auth → Controller → Error Handler
- **Error Handling**: Usar `express-async-errors` o wrappers try-catch centralizados
- **Validación**: Joi o Zod para schemas de entrada (nunca validar en controller directamente)

### 0.3 Base de Datos (MongoDB)
- **ODM**: Mongoose obligatorio (abstrae queries nativas)
- **Schemas**: Siempre con validación explícita y timestamps
```javascript
  const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    // ...
  }, { timestamps: true }); // createdAt, updatedAt automáticos
```
- **Índices**: Declarar índices en los campos de búsqueda frecuente
- **Población**: Usar `.populate()` con cautela (evitar N+1 queries)

### 0.4 Comunicación Frontend ↔ Backend
- **API RESTful**: Seguir convenciones HTTP (GET/POST/PUT/DELETE/PATCH)
- **Respuestas Estandarizadas**:
```javascript
  // Éxito
  { success: true, data: {...}, message: "Usuario creado" }
  
  // Error
  { success: false, error: "Validación fallida", details: [...] }
```
- **Autenticación**: JWT en headers (`Authorization: Bearer <token>`)
- **CORS**: Configurar whitelist de orígenes permitidos

### 0.5 Agnosticismo Tecnológico (Escape Hatches)
Aunque esta es la stack oficial, cualquier dependencia externa debe seguir la **Regla I.2** (Wrapper):

**Ejemplo - Wrapper de MongoDB**:
```javascript
// ❌ MAL: Acoplamiento directo
const User = require('./models/User');
const users = await User.find({ active: true });

// ✅ BIEN: Wrapper abstracto
// services/database.js
class DatabaseService {
  async findActiveUsers() {
    return User.find({ active: true });
  }
}


**Integración con Sección I (Integridad Estructural)**:
- Frontend React = **Capa UI** (tonta, solo renderiza)
- Express Controllers = **Capa de Lógica** (ciega, no sabe de UI)
- MongoDB Models/Services = **Capa de Datos** (aislada)


I. INTEGRIDAD ESTRUCTURAL (The Backbone)
Separación Estricta de Responsabilidades (SoC): Nunca mezcles Lógica de Negocio, Capa de Datos y UI en el mismo bloque o archivo.
Regla: La UI es "tonta" (solo muestra datos). La Lógica es "ciega" (no sabe cómo se muestra).
Agnosticismo de Dependencias: Al importar librerías externas, crea siempre un "Wrapper" o interfaz intermedia.
Por qué: Si cambiamos la librería X por la librería Y mañana, solo editamos el wrapper, no toda la app.
Principio de Inmutabilidad por Defecto: Trata los datos como inmutables a menos que sea estrictamente necesario mutarlos. Esto previene "side-effects" impredecibles entre agentes.

II. PROTOCOLO DE CONSERVACIÓN DE CONTEXTO (Multi-Agent Memory)
La Regla del "Chesterton’s Fence": Antes de eliminar o refactorizar código que no creaste tú (o que creaste en un prompt anterior), debes analizar y enunciar por qué ese código existía. No borres sin entender la dependencia.
Código Auto-Documentado: Los nombres de variables y funciones deben ser tan descriptivos que no requieran comentarios (getUserById es mejor que getData).
Excepción: Usa comentarios explicativos solo para lógica de negocio compleja o decisiones no obvias ("hack" temporal).
Atomicidad en Cambios: Cada generación de código debe ser un cambio completo y funcional. No dejes funciones a medio escribir o "TODOs" críticos que rompan la compilación/ejecución.

III. UI/UX: SISTEMA DE DISEÑO ATÓMICO (Atomic Vibe)
Tokenización: Nunca uses "magic numbers" o colores hardcodeados (ej: #F00, 12px). Usa siempre variables semánticas (ej: Colors.danger, Spacing.medium).
Objetivo: Mantener el "Vibe" visual consistente, sin importar qué agente genere la vista.
Componentización Recursiva: Si un elemento de UI se usa más de una vez (o tiene más de 20 líneas de código visual), extráelo a un componente aislado inmediatamente.
Resiliencia Visual: Todos los componentes deben manejar sus estados de borde: Loading, Error, Empty y Data Overflow (texto muy largo).

IV. ESTÁNDARES DE CALIDAD GENÉRICOS (Clean Code)
S.O.L.I.D. Simplificado:
S: Una función/clase hace UNA sola cosa.
O: Abierto para extensión, cerrado para modificación (prefiere composición sobre herencia excesiva).
Early Return Pattern: Evita el "Arrow Code" (anidamiento excesivo de if/else). Verifica las condiciones negativas primero y retorna, dejando el "camino feliz" al final y plano.
Manejo de Errores Global: Nunca silencies un error. Si no puedes manejarlo localmente, propágalo hacia arriba hasta una capa que pueda informar al usuario.

V. META-INSTRUCCIÓN DE AUTO-CORRECCIÓN
Antes de entregar el código final, ejecuta una simulación mental: "Si implemento esto, ¿rompo la arquitectura definida en el paso I? ¿Estoy respetando los tokens de diseño del paso III?". Si la respuesta es negativa, refactoriza antes de responder.