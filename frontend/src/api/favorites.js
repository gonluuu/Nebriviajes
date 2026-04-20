// All requests go through Vite proxy (/api → localhost:3000)
export const getFavorites = async (token) => {
    const res = await fetch("/api/favoritos", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error("Error fetching favorites");
    return res.json();
};

export const addFavorite = async (token, favoriteData) => {
    const res = await fetch("/api/favoritos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(favoriteData),
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Error adding favorite");
    }
    return res.json();
};

export const removeFavorite = async (token, itemId) => {
    const res = await fetch(`/api/favoritos/${itemId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error("Error removing favorite");
    return res.json();
};
