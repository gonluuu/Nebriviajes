const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY;

function isPlaceholder(value = "") {
  return !value || /TU_PROYECTO|PEGA_AQUI|missing-key|localhost/i.test(String(value));
}

function assertSupabaseConfig() {
  if (isPlaceholder(supabaseUrl) || isPlaceholder(supabaseKey)) {
    throw new Error(
      "Faltan credenciales reales de Supabase en backend/.env. Pon SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY."
    );
  }
}

assertSupabaseConfig();

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

module.exports = { supabase, supabaseUrl };
