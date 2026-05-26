import { useMemo } from "react";
import { toggleInArray } from "../../utils/filterHelpers";

export const MAX_DISTANCE_KM = 20;
export const MAX_RATING = 10;

export const DEFAULT_HOTELS_FILTERS = {
  accommodationTypes: [],
  amenities: [],
  maxDistanceKm: MAX_DISTANCE_KM,
  minRating: 0,
  stars: [],
};

const ACCOMMODATION_TYPES = [
  { id: "hotel", label: "Hotel" },
  { id: "apartment", label: "Apartamento" },
  { id: "hostel", label: "Hostal" },
  { id: "resort", label: "Resort" },
];

const AMENITIES = [
  { id: "wifi", label: "Wifi Gratis" },
  { id: "pool", label: "Piscina" },
  { id: "breakfast", label: "Desayuno Incluido" },
  { id: "parking", label: "Parking" },
  { id: "spa", label: "Spa" },
];

const STARS = [5, 4, 3];

function HotelsFiltersPanel({ value = DEFAULT_HOTELS_FILTERS, onChange, onReset }) {
  const distanceLabel = useMemo(() => {
    if (value.maxDistanceKm >= MAX_DISTANCE_KM) return "Cualquiera";
    return `Hasta ${value.maxDistanceKm} km`;
  }, [value.maxDistanceKm]);

  const ratingLabel = useMemo(() => {
    if (value.minRating <= 0) return "Cualquiera";
    return `Desde ${value.minRating.toFixed(1)} / ${MAX_RATING}`;
  }, [value.minRating]);

  return (
    <div className="filters-panel">
      <div className="filters-head">
        <h4>Filtros</h4>
        <button type="button" className="filters-reset" onClick={onReset}>
          Restablecer filtros
        </button>
      </div>

      <div className="filter-block">
        <div className="filter-title">Tipo de Alojamiento</div>
        {ACCOMMODATION_TYPES.map((type) => (
          <label key={type.id} className="check">
            <input
              type="checkbox"
              checked={value.accommodationTypes.includes(type.id)}
              onChange={() => onChange({ accommodationTypes: toggleInArray(value.accommodationTypes, type.id) })}
            />
            {type.label}
          </label>
        ))}
      </div>

      <div className="filter-block">
        <div className="filter-title">Servicios Incluidos</div>
        {AMENITIES.map((amenity) => (
          <label key={amenity.id} className="check">
            <input
              type="checkbox"
              checked={value.amenities.includes(amenity.id)}
              onChange={() => onChange({ amenities: toggleInArray(value.amenities, amenity.id) })}
            />
            {amenity.label}
          </label>
        ))}
      </div>

      <div className="filter-block">
        <div className="filter-title">Distancia al Centro</div>
        <input
          type="range"
          className="filters-slider"
          min="1"
          max={MAX_DISTANCE_KM}
          step="1"
          value={value.maxDistanceKm}
          onChange={(e) => onChange({ maxDistanceKm: Number(e.target.value) })}
          aria-label="Distancia máxima al centro"
        />
        <div className="filters-slider-meta">
          <span className="muted">{distanceLabel}</span>
        </div>
      </div>

      <div className="filter-block">
        <div className="filter-title">Valoración de Usuarios</div>
        <input
          type="range"
          className="filters-slider"
          min="0"
          max={MAX_RATING}
          step="0.5"
          value={value.minRating}
          onChange={(e) => onChange({ minRating: Number(e.target.value) })}
          aria-label="Valoración mínima de usuarios"
        />
        <div className="filters-slider-meta">
          <span className="muted">{ratingLabel}</span>
        </div>
      </div>

      <div className="filter-block">
        <div className="filter-title">Estrellas</div>
        {STARS.map((stars) => (
          <label key={stars} className="check">
            <input
              type="checkbox"
              checked={value.stars.includes(stars)}
              onChange={() => onChange({ stars: toggleInArray(value.stars, stars) })}
            />
            {"★".repeat(stars)} {stars}
          </label>
        ))}
      </div>
    </div>
  );
}

export default HotelsFiltersPanel;
