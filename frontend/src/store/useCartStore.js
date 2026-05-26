import { create } from "zustand";

const STORAGE_KEY = "nebriviajes_cart";

function readCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function normalizeItem(item) {
  return {
    type: item.type,
    itemId: String(item.itemId || item.id),
    title: item.title || "Reserva Nebriviajes",
    subtitle: item.subtitle || "",
    price: Number(item.price) || 0,
    imageUrl: item.imageUrl || "",
    linkUrl: item.linkUrl || "",
  };
}

export const useCartStore = create((set, get) => ({
  items: readCart(),

  addItem: (item) => {
    const normalized = normalizeItem(item);
    const exists = get().items.some(
      (cartItem) =>
        cartItem.type === normalized.type &&
        String(cartItem.itemId) === String(normalized.itemId),
    );

    if (exists) return false;

    const nextItems = [...get().items, normalized];
    saveCart(nextItems);
    set({ items: nextItems });
    return true;
  },

  removeItem: (type, itemId) => {
    const nextItems = get().items.filter(
      (item) => !(item.type === type && String(item.itemId) === String(itemId)),
    );
    saveCart(nextItems);
    set({ items: nextItems });
  },

  clearCart: () => {
    saveCart([]);
    set({ items: [] });
  },
}));
