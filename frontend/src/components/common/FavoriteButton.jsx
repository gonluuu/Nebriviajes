import { useState } from "react";
import { useFavoritesStore } from "../../store/useFavoritesStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";

import "../../styles/Search.css";

export default function FavoriteButton({ item }) {
    const { user } = useAuthStore();
    const { favorites, addFavorite, removeFavorite } = useFavoritesStore();
    const navigate = useNavigate();

    const isFavorited = favorites.some((f) => f.itemId === item.id);
    const [loading, setLoading] = useState(false);

    const toggleFavorite = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            alert("Debes iniciar sesión para añadir a favoritos");
            navigate("/login");
            return;
        }

        setLoading(true);
        try {
            if (isFavorited) {
                await removeFavorite(item.id);
            } else {
                await addFavorite({
                    itemType: item.type,
                    itemId: item.id,
                    title: item.title,
                    subtitle: item.subtitle,
                    price: item.price,
                    imageUrl: item.imageUrl,
                    linkUrl: item.linkUrl
                });
            }
        } catch (error) {
            console.error(error);
            alert("Error al actualizar favoritos");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={toggleFavorite}
            disabled={loading}
            className={`favorite-btn ${isFavorited ? "active" : ""}`}
            aria-label="Toggle Favorite"
            style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "white",
                border: "none",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                zIndex: 10
            }}
        >
            <span style={{ color: isFavorited ? "#7B1D1D" : "#ccc", fontSize: "18px" }}>
                {isFavorited ? "❤️" : "🤍"}
            </span>
        </button>
    );
}
