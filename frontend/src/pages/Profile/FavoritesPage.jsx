import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PATHS } from "../../routes/paths";
import { useAuthStore } from "../../store/useAuthStore";
import { useFavoritesStore } from "../../store/useFavoritesStore";
import { resolveImageUrl } from "../../utils/resolveImageUrl";
import "../../styles/Profile.css";

function formatType(t) {
    const map = {
        hotel: "Hotel",
        flight: "Vuelo",
        train: "Tren",
        vehicle: "Vehículo",
        cruise: "Crucero",
        package: "Paquete",
        offer: "Oferta",
    };
    return map[t] || t;
}

export default function FavoritesPage() {
    const navigate = useNavigate();
    const user = useAuthStore((s) => s.user);
    const { favorites, isLoading, fetchFavorites, removeFavorite } = useFavoritesStore();

    const [activeTab, setActiveTab] = useState("all");
    const [removingId, setRemovingId] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate(PATHS.LOGIN);
            return;
        }
        fetchFavorites();
    }, [user, navigate, fetchFavorites]);

    const handleRemove = async (itemId) => {
        if (!confirm("¿Seguro que quieres eliminar este favorito?")) return;
        try {
            setRemovingId(itemId);
            await removeFavorite(itemId);
        } catch (error) {
            alert("Error al eliminar el favorito");
        } finally {
            setRemovingId(null);
        }
    };

    const filteredFavorites = activeTab === "all"
        ? favorites
        : favorites.filter(f => f.itemType === activeTab);

    if (!user) return null;

    return (
        <div className="profile-page">
            <div className="profile-header">
                <h1 className="profile-title">Mis Favoritos</h1>
                <div className="profile-subtitle">
                    <Link to={PATHS.PERFIL} className="profile-link">← Volver al Perfil</Link>
                </div>
            </div>

            <section className="profile-section">

                {/* TABS */}
                <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
                    <button
                        className={`hotel-btn ${activeTab === "all" ? "" : "outline"}`}
                        onClick={() => setActiveTab("all")}
                        style={activeTab !== "all" ? { background: "transparent", color: "#7B1D1D" } : {}}
                    >
                        Todos
                    </button>
                    <button
                        className={`hotel-btn ${activeTab === "flight" ? "" : "outline"}`}
                        onClick={() => setActiveTab("flight")}
                        style={activeTab !== "flight" ? { background: "transparent", color: "#7B1D1D" } : {}}
                    >
                        Vuelos
                    </button>
                    <button
                        className={`hotel-btn ${activeTab === "hotel" ? "" : "outline"}`}
                        onClick={() => setActiveTab("hotel")}
                        style={activeTab !== "hotel" ? { background: "transparent", color: "#7B1D1D" } : {}}
                    >
                        Hoteles
                    </button>
                    <button
                        className={`hotel-btn ${activeTab === "vehicle" ? "" : "outline"}`}
                        onClick={() => setActiveTab("vehicle")}
                        style={activeTab !== "vehicle" ? { background: "transparent", color: "#7B1D1D" } : {}}
                    >
                        Vehículos
                    </button>
                </div>

                {isLoading ? (
                    <p>Cargando favoritos...</p>
                ) : filteredFavorites.length === 0 ? (
                    <div className="profile-empty">
                        <p style={{ margin: 0 }}>No tienes favoritos guardados en esta categoría.</p>
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
                            <Link className="profile-link" to={PATHS.HOTELES}>Buscar Hoteles</Link>
                            <Link className="profile-link" to={PATHS.VUELOS}>Buscar Vuelos</Link>
                            <Link className="profile-link" to={PATHS.VEHICULOS}>Buscar Vehículos</Link>
                        </div>
                    </div>
                ) : (
                    <div className="profile-reservations-grid">
                        {filteredFavorites.map((fav) => (
                            <div key={fav._id} className="reservation-card">
                                <img
                                    className="reservation-img"
                                    src={resolveImageUrl(fav.imageUrl) || "https://picsum.photos/400/300"}
                                    alt={fav.title}
                                    loading="lazy"
                                />

                                <div className="reservation-body">
                                    <div className="reservation-top">
                                        <h3 className="reservation-title">{fav.title || "Favorito"}</h3>
                                        <span className="reservation-type">{formatType(fav.itemType)}</span>
                                    </div>

                                    {fav.subtitle ? (
                                        <p className="reservation-desc">
                                            {fav.subtitle}
                                        </p>
                                    ) : null}

                                    <div className="reservation-meta">
                                        <span className="reservation-price">
                                            {fav.price ? `${fav.price}€` : ""}
                                        </span>

                                        <div className="reservation-actions">
                                            <button
                                                type="button"
                                                className="cancel-btn"
                                                disabled={removingId === fav.itemId}
                                                onClick={() => handleRemove(fav.itemId)}
                                            >
                                                {removingId === fav.itemId ? "Eliminando..." : "Eliminar"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
