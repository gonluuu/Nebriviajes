export function toggleInArray(list, item) {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
}

export function normalize(value) {
  if (value == null) return "";
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}
