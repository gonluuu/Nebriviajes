import { create } from "zustand";
import { getFavorites, addFavorite, removeFavorite } from "../api/favorites";
import { useAuthStore } from "./useAuthStore";

export const useFavoritesStore = create((set, get) => ({
    favorites: [],
    isLoading: false,

    fetchFavorites: async () => {
        const token = useAuthStore.getState().token;
        if (!token) return;

        set({ isLoading: true });
        try {
            const data = await getFavorites(token);
            set({ favorites: data, isLoading: false });
        } catch (err) {
            console.error(err);
            set({ isLoading: false });
        }
    },

    addFavorite: async (item) => {
        const token = useAuthStore.getState().token;
        if (!token) return;

        try {
            const newFav = await addFavorite(token, item);
            set((state) => ({ favorites: [newFav, ...state.favorites] }));
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    removeFavorite: async (itemId) => {
        const token = useAuthStore.getState().token;
        if (!token) return;

        try {
            await removeFavorite(token, itemId);
            set((state) => ({
                favorites: state.favorites.filter((f) => f.itemId !== itemId),
            }));
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    clearFavoritesState: () => {
        set({ favorites: [] });
    }
}));
