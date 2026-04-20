import { useState, useEffect } from "react";
import "./FiltersSidebar.css";

export default function FiltersSidebar({
    category,
    onFiltersChange,
    initialFilters = {}
}) {
    const [filters, setFilters] = useState(initialFilters);
    const [isOpen, setIsOpen] = useState(false);

    // Notificar cambios al padre cuando el estado local cambie
    useEffect(() => {
        const activeFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, v]) => {
                if (Array.isArray(v)) return v.length > 0;
                if (typeof v === "boolean") return v;
                return v !== "" && v !== undefined && v !== null;
            })
        );
        onFiltersChange(activeFilters);
    }, [filters, onFiltersChange]);

    const handleCheckbox = (key, value) => {
        setFilters(prev => {
            const current = prev[key] || [];
            const isChecked = current.includes(value);
            if (isChecked) {
                return { ...prev, [key]: current.filter(v => v !== value) };
            } else {
                return { ...prev, [key]: [...current, value] };
            }
        });
    };

    const handleToggle = (key) => {
        setFilters(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const clearFilters = () => {
        setFilters({});
    };

    return (
        <>
            <button className="filters-toggle-btn hotel-btn" onClick={() => setIsOpen(true)}>
                Filtros Avanzados
            </button>

            <div className={`filters-sidebar-container ${isOpen ? "open" : ""}`}>
                <div className="filters-sidebar-header">
                    <h3>Filtros</h3>
                    <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
                </div>

                <div className="filters-sidebar-content">
                    <button className="clear-filters-btn" onClick={clearFilters}>
                        Restablecer Filtros
                    </button>

                    {/* ----- FILTROS DE VUELOS ----- */}
                    {category === "flights" && (
                        <>
                            <div className="filter-group">
                                <h4>Clase</h4>
                                <label>
                                    <input type="checkbox" checked={(filters.flightClass || []).includes("económica")} onChange={() => handleCheckbox("flightClass", "económica")} />
                                    Económica
                                </label>
                                <label>
                                    <input type="checkbox" checked={(filters.flightClass || []).includes("business")} onChange={() => handleCheckbox("flightClass", "business")} />
                                    Business
                                </label>
                                <label>
                                    <input type="checkbox" checked={(filters.flightClass || []).includes("primera")} onChange={() => handleCheckbox("flightClass", "primera")} />
                                    Primera Clase
                                </label>
                            </div>
                            <div className="filter-group">
                                <h4>Horario Salida Previsto</h4>
                                <label>
                                    <input type="checkbox" checked={(filters.departureTime || []).includes("morning")} onChange={() => handleCheckbox("departureTime", "morning")} />
                                    Mañana (06:00 - 11:59)
                                </label>
                                <label>
                                    <input type="checkbox" checked={(filters.departureTime || []).includes("afternoon")} onChange={() => handleCheckbox("departureTime", "afternoon")} />
                                    Tarde (12:00 - 17:59)
                                </label>
                                <label>
                                    <input type="checkbox" checked={(filters.departureTime || []).includes("evening")} onChange={() => handleCheckbox("departureTime", "evening")} />
                                    Noche (18:00 - 05:59)
                                </label>
                            </div>
                            <div className="filter-group">
                                <h4>Aerolíneas Recomendadas</h4>
                                <label>
                                    <input type="checkbox" checked={(filters.airlines || []).includes("Iberia")} onChange={() => handleCheckbox("airlines", "Iberia")} />
                                    Iberia
                                </label>
                                <label>
                                    <input type="checkbox" checked={(filters.airlines || []).includes("Ryanair")} onChange={() => handleCheckbox("airlines", "Ryanair")} />
                                    Ryanair
                                </label>
                                <label>
                                    <input type="checkbox" checked={(filters.airlines || []).includes("Air Europa")} onChange={() => handleCheckbox("airlines", "Air Europa")} />
                                    Air Europa
                                </label>
                            </div>
                            <div className="filter-group">
                                <h4>Duración del Vuelo</h4>
                                <label>
                                    <input type="range" min="30" max="1440" step="30"
                                        value={filters.maxDuration || 1440}
                                        onChange={(e) => setFilters(prev => ({ ...prev, maxDuration: e.target.value }))}
                                    />
                                    <span style={{ marginLeft: "10px", display: "block" }}>
                                        {filters.maxDuration ? `Máx: ${Math.floor(filters.maxDuration / 60)}h ${filters.maxDuration % 60}m` : 'Cualquiera'}
                                    </span>
                                </label>
                            </div>
                            <div className="filter-group">
                                <h4>Escalas</h4>
                                <label>
                                    <input type="checkbox" checked={(filters.stops || []).includes(0)} onChange={() => handleCheckbox("stops", 0)} />
                                    Directo
                                </label>
                                <label>
                                    <input type="checkbox" checked={(filters.stops || []).includes(1)} onChange={() => handleCheckbox("stops", 1)} />
                                    1 Escala
                                </label>
                                <label>
                                    <input type="checkbox" checked={(filters.stops || []).includes(2)} onChange={() => handleCheckbox("stops", 2)} />
                                    2+ Escalas
                                </label>
                            </div>
                            <div className="filter-group">
                                <h4>Equipaje</h4>
                                <label>
                                    <input type="checkbox" checked={!!filters.includesLuggage} onChange={() => handleToggle("includesLuggage")} />
                                    Incluye Equipaje Facturado
                                </label>
                            </div>
                        </>
                    )}

                    {/* ----- FILTROS DE HOTELES ----- */}
                    {category === "hotels" && (
                        <>
                            <div className="filter-group">
                                <h4>Tipo de Alojamiento</h4>
                                <label>
                                    <input type="checkbox" checked={(filters.type || []).includes("hotel")} onChange={() => handleCheckbox("type", "hotel")} />
                                    Hotel
                                </label>
                                <label>
                                    <input type="checkbox" checked={(filters.type || []).includes("apartamento")} onChange={() => handleCheckbox("type", "apartamento")} />
                                    Apartamento
                                </label>
                                <label>
                                    <input type="checkbox" checked={(filters.type || []).includes("hostal")} onChange={() => handleCheckbox("type", "hostal")} />
                                    Hostal
                                </label>
                                <label>
                                    <input type="checkbox" checked={(filters.type || []).includes("resort")} onChange={() => handleCheckbox("type", "resort")} />
                                    Resort
                                </label>
                            </div>
                            <div className="filter-group">
                                <h4>Servicios Incluidos</h4>
                                <label>
                                    <input type="checkbox" checked={(filters.amenities || []).includes("wifi")} onChange={() => handleCheckbox("amenities", "wifi")} />
                                    Wifi Gratis
                                </label>
                                <label>
                                    <input type="checkbox" checked={(filters.amenities || []).includes("piscina")} onChange={() => handleCheckbox("amenities", "piscina")} />
                                    Piscina
                                </label>
                                <label>
                                    <input type="checkbox" checked={(filters.amenities || []).includes("desayuno")} onChange={() => handleCheckbox("amenities", "desayuno")} />
                                    Desayuno Incluido
                                </label>
                                <label>
                                    <input type="checkbox" checked={(filters.amenities || []).includes("parking")} onChange={() => handleCheckbox("amenities", "parking")} />
                                    Parking
                                </label>
                                <label>
                                    <input type="checkbox" checked={(filters.amenities || []).includes("spa")} onChange={() => handleCheckbox("amenities", "spa")} />
                                    Spa
                                </label>
                            </div>
                            <div className="filter-group">
                                <h4>Distancia al Centro</h4>
                                <label>
                                    <input type="range" min="1" max="50" step="1"
                                        value={filters.maxDistance || 50}
                                        onChange={(e) => setFilters(prev => ({ ...prev, maxDistance: e.target.value }))}
                                    />
                                    <span style={{ marginLeft: "10px", display: "block" }}>
                                        {filters.maxDistance ? `Máx: ${filters.maxDistance} km` : 'Cualquiera'}
                                    </span>
                                </label>
                            </div>
                            <div className="filter-group">
                                <h4>Valoración de Usuarios</h4>
                                <label>
                                    <input type="range" min="0" max="10" step="1"
                                        value={filters.minRating || 0}
                                        onChange={(e) => setFilters(prev => ({ ...prev, minRating: e.target.value }))}
                                    />
                                    <span style={{ marginLeft: "10px", display: "block" }}>
                                        {filters.minRating ? `Mín: ${filters.minRating} de 10 pts` : 'Cualquiera'}
                                    </span>
                                </label>
                            </div>
                            <div className="filter-group">
                                <h4>Estrellas</h4>
                                {[5, 4, 3, 2, 1].map(star => (
                                    <label key={star}>
                                        <input type="checkbox" checked={(filters.stars || []).includes(star)} onChange={() => handleCheckbox("stars", star)} />
                                        {star} ★
                                    </label>
                                ))}
                            </div>
                            <div className="filter-group">
                                <h4>Condiciones</h4>
                                <label>
                                    <input type="checkbox" checked={!!filters.freeCancellation} onChange={() => handleToggle("freeCancellation")} />
                                    Cancelación Gratuita
                                </label>
                            </div>
                        </>
                    )}

                    {/* ----- FILTROS DE VEHÍCULOS ----- */}
                    {category === "vehicles" && (
                        <>
                            <div className="filter-group">
                                <h4>Combustible</h4>
                                <label>
                                    <input type="checkbox" checked={(filters.fuel || []).includes("gasolina")} onChange={() => handleCheckbox("fuel", "gasolina")} />
                                    Gasolina
                                </label>
                                <label>
                                    <input type="checkbox" checked={(filters.fuel || []).includes("diésel")} onChange={() => handleCheckbox("fuel", "diésel")} />
                                    Diésel
                                </label>
                                <label>
                                    <input type="checkbox" checked={(filters.fuel || []).includes("eléctrico")} onChange={() => handleCheckbox("fuel", "eléctrico")} />
                                    Eléctrico
                                </label>
                                <label>
                                    <input type="checkbox" checked={(filters.fuel || []).includes("híbrido")} onChange={() => handleCheckbox("fuel", "híbrido")} />
                                    Híbrido
                                </label>
                            </div>
                            <div className="filter-group">
                                <h4>Puertas</h4>
                                <label>
                                    <input type="checkbox" checked={(filters.doors || []).includes(2)} onChange={() => handleCheckbox("doors", 2)} />
                                    2 Puertas
                                </label>
                                <label>
                                    <input type="checkbox" checked={(filters.doors || []).includes(4)} onChange={() => handleCheckbox("doors", 4)} />
                                    4 Puertas
                                </label>
                                <label>
                                    <input type="checkbox" checked={(filters.doors || []).includes(5)} onChange={() => handleCheckbox("doors", 5)} />
                                    5 Puertas
                                </label>
                            </div>
                            <div className="filter-group">
                                <h4>Compañías Recomendadas</h4>
                                <label>
                                    <input type="checkbox" checked={(filters.providers || []).includes("Hertz")} onChange={() => handleCheckbox("providers", "Hertz")} />
                                    Hertz
                                </label>
                                <label>
                                    <input type="checkbox" checked={(filters.providers || []).includes("Europcar")} onChange={() => handleCheckbox("providers", "Europcar")} />
                                    Europcar
                                </label>
                                <label>
                                    <input type="checkbox" checked={(filters.providers || []).includes("Avis")} onChange={() => handleCheckbox("providers", "Avis")} />
                                    Avis
                                </label>
                            </div>
                            <div className="filter-group">
                                <h4>Transmisión</h4>
                                <label>
                                    <input type="checkbox" checked={(filters.transmission || []).includes("manual")} onChange={() => handleCheckbox("transmission", "manual")} />
                                    Manual
                                </label>
                                <label>
                                    <input type="checkbox" checked={(filters.transmission || []).includes("automatic")} onChange={() => handleCheckbox("transmission", "automatic")} />
                                    Automática
                                </label>
                            </div>
                            <div className="filter-group">
                                <h4>Kilometraje</h4>
                                <label>
                                    <input type="checkbox" checked={!!filters.unlimitedMileage} onChange={() => handleToggle("unlimitedMileage")} />
                                    Kilometraje Ilimitado
                                </label>
                            </div>
                        </>
                    )}

                    {/* ----- FILTROS DE CRUCEROS ----- */}
                    {category === "cruises" && (
                        <>
                            <div className="filter-group">
                                <h4>Tipo de Crucero</h4>
                                <label>
                                    <input type="checkbox" checked={(filters.cruiseType || []).includes("mediterráneo")} onChange={() => handleCheckbox("cruiseType", "mediterráneo")} />
                                    Mediterráneo
                                </label>
                                <label>
                                    <input type="checkbox" checked={(filters.cruiseType || []).includes("caribe")} onChange={() => handleCheckbox("cruiseType", "caribe")} />
                                    Caribe
                                </label>
                                <label>
                                    <input type="checkbox" checked={(filters.cruiseType || []).includes("fiordos")} onChange={() => handleCheckbox("cruiseType", "fiordos")} />
                                    Fiordos
                                </label>
                                <label>
                                    <input type="checkbox" checked={(filters.cruiseType || []).includes("transatlántico")} onChange={() => handleCheckbox("cruiseType", "transatlántico")} />
                                    Transatlántico
                                </label>
                                <label>
                                    <input type="checkbox" checked={(filters.cruiseType || []).includes("fluvial")} onChange={() => handleCheckbox("cruiseType", "fluvial")} />
                                    Fluvial
                                </label>
                            </div>
                            <div className="filter-group">
                                <h4>Servicios a Bordo</h4>
                                <label>
                                    <input type="checkbox" checked={(filters.services || []).includes("todo incluido")} onChange={() => handleCheckbox("services", "todo incluido")} />
                                    Todo Incluido
                                </label>
                                <label>
                                    <input type="checkbox" checked={(filters.services || []).includes("piscina")} onChange={() => handleCheckbox("services", "piscina")} />
                                    Piscina
                                </label>
                                <label>
                                    <input type="checkbox" checked={(filters.services || []).includes("spa")} onChange={() => handleCheckbox("services", "spa")} />
                                    Spa
                                </label>
                                <label>
                                    <input type="checkbox" checked={(filters.services || []).includes("casino")} onChange={() => handleCheckbox("services", "casino")} />
                                    Casino
                                </label>
                                <label>
                                    <input type="checkbox" checked={(filters.services || []).includes("gimnasio")} onChange={() => handleCheckbox("services", "gimnasio")} />
                                    Gimnasio
                                </label>
                                <label>
                                    <input type="checkbox" checked={(filters.services || []).includes("wifi")} onChange={() => handleCheckbox("services", "wifi")} />
                                    Wifi a bordo
                                </label>
                            </div>
                            <div className="filter-group">
                                <h4>Duración del Crucero</h4>
                                <label>
                                    <input type="range" min="1" max="30" step="1"
                                        value={filters.maxDuration || 30}
                                        onChange={(e) => setFilters(prev => ({ ...prev, maxDuration: e.target.value }))}
                                    />
                                    <span style={{ marginLeft: "10px", display: "block" }}>
                                        {filters.maxDuration ? `Máx: ${filters.maxDuration} noches` : 'Cualquiera'}
                                    </span>
                                </label>
                            </div>
                            <div className="filter-group">
                                <h4>Naviera</h4>
                                <label>
                                    <input type="checkbox" checked={(filters.company || []).includes("MSC")} onChange={() => handleCheckbox("company", "MSC")} />
                                    MSC Cruceros
                                </label>
                                <label>
                                    <input type="checkbox" checked={(filters.company || []).includes("Costa")} onChange={() => handleCheckbox("company", "Costa")} />
                                    Costa Cruceros
                                </label>
                                <label>
                                    <input type="checkbox" checked={(filters.company || []).includes("Royal Caribbean")} onChange={() => handleCheckbox("company", "Royal Caribbean")} />
                                    Royal Caribbean
                                </label>
                                <label>
                                    <input type="checkbox" checked={(filters.company || []).includes("Norwegian")} onChange={() => handleCheckbox("company", "Norwegian")} />
                                    Norwegian
                                </label>
                            </div>
                        </>
                    )}

                    {/* ----- FILTROS DE TRENES ----- */}
                    {category === "trains" && (
                        <>
                            <div className="filter-group">
                                <h4>Clase</h4>
                                <label>
                                    <input type="checkbox" checked={(filters.trainClass || []).includes("estándar")} onChange={() => handleCheckbox("trainClass", "estándar")} />
                                    Estándar / Turista
                                </label>
                                <label>
                                    <input type="checkbox" checked={(filters.trainClass || []).includes("preferente")} onChange={() => handleCheckbox("trainClass", "preferente")} />
                                    Preferente
                                </label>
                                <label>
                                    <input type="checkbox" checked={(filters.trainClass || []).includes("business")} onChange={() => handleCheckbox("trainClass", "business")} />
                                    Business / Club
                                </label>
                            </div>
                            <div className="filter-group">
                                <h4>Compañía</h4>
                                <label>
                                    <input type="checkbox" checked={(filters.company || []).includes("Renfe")} onChange={() => handleCheckbox("company", "Renfe")} />
                                    Renfe
                                </label>
                                <label>
                                    <input type="checkbox" checked={(filters.company || []).includes("Ouigo")} onChange={() => handleCheckbox("company", "Ouigo")} />
                                    Ouigo
                                </label>
                                <label>
                                    <input type="checkbox" checked={(filters.company || []).includes("Iryo")} onChange={() => handleCheckbox("company", "Iryo")} />
                                    Iryo
                                </label>
                                <label>
                                    <input type="checkbox" checked={(filters.company || []).includes("SNCF")} onChange={() => handleCheckbox("company", "SNCF")} />
                                    SNCF
                                </label>
                            </div>
                            <div className="filter-group">
                                <h4>Tipo de Trayecto</h4>
                                <label>
                                    <input type="checkbox" checked={!!filters.direct} onChange={() => handleToggle("direct")} />
                                    Solo Directos
                                </label>
                            </div>
                            <div className="filter-group">
                                <h4>Duración Máxima</h4>
                                <label>
                                    <input type="range" min="30" max="720" step="30"
                                        value={filters.maxDuration || 720}
                                        onChange={(e) => setFilters(prev => ({ ...prev, maxDuration: e.target.value }))}
                                    />
                                    <span style={{ marginLeft: "10px", display: "block" }}>
                                        {filters.maxDuration ? `Máx: ${Math.floor(filters.maxDuration / 60)}h ${filters.maxDuration % 60}m` : 'Cualquiera'}
                                    </span>
                                </label>
                            </div>
                        </>
                    )}
                </div>
            </div>
            {isOpen && <div className="filters-overlay" onClick={() => setIsOpen(false)}></div>}
        </>
    );
}
