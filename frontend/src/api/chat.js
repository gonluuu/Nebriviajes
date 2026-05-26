// src/api/chat.js
import { api } from "./client";

export async function sendChatMessage(messages) {
  const res = await api.post("/chat", { messages });
  return res.data.reply;
}
