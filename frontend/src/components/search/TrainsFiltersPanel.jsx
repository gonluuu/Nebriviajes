import { useMemo } from "react";
import { toggleInArray } from "../../utils/filterHelpers";

export const MAX_DURATION_MINUTES = 600;

export const DEFAULT_TRAINS_FILTERS = {
  classes: [],
  companies: [],
  onlyDirect: false,
  maxDurationMinutes: MAX_DURATION_MINUTES,
};

const CLASSES = [
  { id: "turista", label: "Estándar / Turista" },
  { id: "preferente", label: "Preferente" },
  { id: "business", label: "Business / Club" },
];

const COMPANIES = ["Renfe", "Ouigo", "Iryo", "SNCF"];

function TrainsFiltersPanel({ value = DEFAULT_TRAINS_FILTERS, onChange, onReset }) {
  const durationLabel = useMemo(() => {
    if (value.maxDurationMinutes >= MAX_DURATION_MINUTES) return "Cualquiera";
    const hours = Math.floor(value.maxDurationMinutes / 60);
    const minutes = value.maxDurationMinutes % 60;
    if (hours === 0) return `Hasta ${minutes}m`;
    return minutes === 0 ? `Hasta ${hours}h` : `Hasta ${hours}h ${minutes}m`;
  }, [value.maxDurationMinutes]);

  return (
    <div className="filters-panel">
      <button type="button" className="filters-advanced-btn">
        Filtros Avanzados
      </button>

      <div className="filters-head">
        <h4>Filtros</h4>
        <button type="button" className="filters-reset" onClick={onReset}>
          Restablecer filtros
        </button>
      </div>

      <div className="filter-block">
        <div className="filter-title">Clase</div>
        {CLASSES.map((cls) => (
          <label key={cls.id} className="check">
            <input
              type="checkbox"
              checked={value.classes.includes(cls.id)}
              onChange={() => onChange({ classes: toggleInArray(value.classes, cls.id) })}
            />
            {cls.label}
          </label>
        ))}
      </div>

      <div className="filter-block">
        <div className="filter-title">Compañía</div>
        {COMPANIES.map((company) => (
          <label key={company} className="check">
            <input
              type="checkbox"
              checked={value.companies.includes(company)}
              onChange={() => onChange({ companies: toggleInArray(value.companies, company) })}
            />
            {company}
          </label>
        ))}
      </div>

      <div className="filter-block">
        <div className="filter-title">Tipo de Trayecto</div>
        <label className="check">
          <input
            type="checkbox"
            checked={value.onlyDirect}
            onChange={(e) => onChange({ onlyDirect: e.target.checked })}
          />
          Solo Directos
        </label>
      </div>

      <div className="filter-block">
        <div className="filter-title">Duración Máxima</div>
        <input
          type="range"
          className="filters-slider"
          min="30"
          max={MAX_DURATION_MINUTES}
          step="15"
          value={value.maxDurationMinutes}
          onChange={(e) => onChange({ maxDurationMinutes: Number(e.target.value) })}
          aria-label="Duración máxima del trayecto"
        />
        <div className="filters-slider-meta">
          <span className="muted">{durationLabel}</span>
        </div>
      </div>
    </div>
  );
}

export default TrainsFiltersPanel;
