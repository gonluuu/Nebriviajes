import { useMemo } from "react";
import { toggleInArray } from "../../utils/filterHelpers";

export const MAX_DURATION_DAYS = 30;

export const DEFAULT_CRUISES_FILTERS = {
  cruiseTypes: [],
  amenities: [],
  maxDurationDays: MAX_DURATION_DAYS,
  cruiseLines: [],
};

const CRUISE_TYPES = [
  { id: "mediterr", label: "Mediterráneo" },
  { id: "caribe", label: "Caribe" },
  { id: "fiordos", label: "Fiordos" },
  { id: "transatlantico", label: "Transatlántico" },
  { id: "fluvial", label: "Fluvial" },
];

const AMENITIES = [
  { id: "todo incluido", label: "Todo Incluido" },
  { id: "piscina", label: "Piscina" },
  { id: "spa", label: "Spa" },
  { id: "casino", label: "Casino" },
  { id: "gimnasio", label: "Gimnasio" },
  { id: "wifi", label: "Wifi a bordo" },
];

const CRUISE_LINES = ["MSC Cruceros", "Costa Cruceros", "Royal Caribbean", "Norwegian"];

function CruisesFiltersPanel({ value = DEFAULT_CRUISES_FILTERS, onChange, onReset }) {
  const durationLabel = useMemo(() => {
    if (value.maxDurationDays >= MAX_DURATION_DAYS) return "Cualquiera";
    return `Hasta ${value.maxDurationDays} día${value.maxDurationDays === 1 ? "" : "s"}`;
  }, [value.maxDurationDays]);

  return (
    <div className="filters-panel">
      <div className="filters-head">
        <h4>Filtros</h4>
        <button type="button" className="filters-reset" onClick={onReset}>
          Restablecer filtros
        </button>
      </div>

      <div className="filter-block">
        <div className="filter-title">Tipo de Crucero</div>
        {CRUISE_TYPES.map((type) => (
          <label key={type.id} className="check">
            <input
              type="checkbox"
              checked={value.cruiseTypes.includes(type.id)}
              onChange={() => onChange({ cruiseTypes: toggleInArray(value.cruiseTypes, type.id) })}
            />
            {type.label}
          </label>
        ))}
      </div>

      <div className="filter-block">
        <div className="filter-title">Servicios a Bordo</div>
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
        <div className="filter-title">Duración del Crucero</div>
        <input
          type="range"
          className="filters-slider"
          min="1"
          max={MAX_DURATION_DAYS}
          step="1"
          value={value.maxDurationDays}
          onChange={(e) => onChange({ maxDurationDays: Number(e.target.value) })}
          aria-label="Duración máxima del crucero"
        />
        <div className="filters-slider-meta">
          <span className="muted">{durationLabel}</span>
        </div>
      </div>

      <div className="filter-block">
        <div className="filter-title">Naviera</div>
        {CRUISE_LINES.map((line) => (
          <label key={line} className="check">
            <input
              type="checkbox"
              checked={value.cruiseLines.includes(line)}
              onChange={() => onChange({ cruiseLines: toggleInArray(value.cruiseLines, line) })}
            />
            {line}
          </label>
        ))}
      </div>
    </div>
  );
}

export default CruisesFiltersPanel;
