export function showToast(message, type = "info") {
  window.dispatchEvent(new CustomEvent("nebriviajes:toast", { detail: { message, type } }));
}
