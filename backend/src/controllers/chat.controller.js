// src/controllers/chat.controller.js

async function fetchFromSupabase(table) {
  const url = process.env.SUPABASE_URL;
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY);

  const res = await fetch(
    `${url}/rest/v1/${encodeURIComponent(table)}?select=*`,
    {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!res.ok) {
    console.error(`Error tabla ${table}:`, await res.text());
    return [];
  }
  return res.json();
}

async function fetchAllData() {
  const [flights, hotels, trains, vehicles, cruises, packages, offers] =
    await Promise.all([
      fetchFromSupabase("flights"), // ← era "vuelos"
      fetchFromSupabase("hotels"), // ← era "hoteles"
      fetchFromSupabase("trains"), // ← era "trenes"
      fetchFromSupabase("vehicles"), // ← era "vehículos"
      fetchFromSupabase("cruises"), // ← era "cruceros"
      fetchFromSupabase("packages"), // ← era "paquetes"
      fetchFromSupabase("offers"),
    ]);

  console.log(
    "vuelos:",
    flights.length,
    "| hoteles:",
    hotels.length,
    "| trenes:",
    trains.length,
  );

  return { flights, hotels, trains, vehicles, cruises, packages, offers };
}

function buildContext(data) {
  const format = (label, rows) => {
    if (!rows?.length) return "";
    return `\n## ${label}\n${JSON.stringify(rows, null, 2)}`;
  };
  return [
    format("VUELOS DISPONIBLES", data.flights),
    format("HOTELES DISPONIBLES", data.hotels),
    format("TRENES DISPONIBLES", data.trains),
    format("VEHÍCULOS EN ALQUILER", data.vehicles),
    format("CRUCEROS DISPONIBLES", data.cruises),
    format("PAQUETES VACACIONALES", data.packages),
    format("OFERTAS ACTIVAS", data.offers),
  ]
    .filter(Boolean)
    .join("\n");
}

function buildSystemPrompt(context) {
  return `Eres el asistente virtual de NebriViajes, una agencia de viajes online.
Tu misión es ayudar a los usuarios a encontrar vuelos, hoteles, trenes, vehículos, cruceros, paquetes y ofertas.

DATOS ACTUALES DEL CATÁLOGO (usa SOLO estos datos, nunca inventes precios ni disponibilidad):
${context}

REGLAS:
- Responde siempre en español, con tono amable y profesional.
- Sé conciso: 2-4 frases por respuesta salvo que pidan más detalle.
- Cuando menciones precios incluye siempre € y el periodo (por noche, total, etc.).
- Si hay varias opciones, lista las 2-3 más relevantes.
- Si el catálogo no tiene lo que busca el usuario, díselo con honestidad.`;
}

async function callGroq(systemPrompt, messages) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY no está en el .env del backend");

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 512,
        messages: [{ role: "system", content: systemPrompt }, ...messages],
      }),
    },
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq API ${response.status}: ${err}`);
  }
  const data = await response.json();
  return data.choices[0].message.content;
}

const chat = async (req, res, next) => {
  try {
    const { messages } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: '"messages" es obligatorio.' });
    }
    const data = await fetchAllData();
    const context = buildContext(data);
    const systemPrompt = buildSystemPrompt(context);
    const reply = await callGroq(systemPrompt, messages);
    res.json({ reply });
  } catch (error) {
    next(error);
  }
};

module.exports = { chat };
