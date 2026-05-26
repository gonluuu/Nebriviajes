import { useMemo } from "react";
import { toggleInArray } from "../../utils/filterHelpers";

export const DEFAULT_FLIGHTS_FILTERS = {
  timeSlots: [],
  airlines: [],
  maxDuration: 1440,
  stops: [],
  baggageIncluded: false,
};

const TIME_SLOTS = [
  { id: "morning", label: "Mañana (06:00 - 11:59)" },
  { id: "afternoon", label: "Tarde (12:00 - 17:59)" },
  { id: "night", label: "Noche (18:00 - 05:59)" },
];

const AIRLINES = ["Iberia", "Ryanair", "Air Europa"];

const STOPS = [
  { id: "direct", label: "Directo" },
  { id: "1", label: "1 Escala" },
  { id: "2plus", label: "2+ Escalas" },
];

function FlightsFiltersPanel({ value = DEFAULT_FLIGHTS_FILTERS, onChange, onReset }) {
  const durationLabel = useMemo(() => {
    if (value.maxDuration >= 1440) return "Cualquiera";
    const hours = Math.floor(value.maxDuration / 60);
    const minutes = value.maxDuration % 60;
    if (hours === 0) return `Hasta ${minutes}m`;
    return minutes === 0 ? `Hasta ${hours}h` : `Hasta ${hours}h ${minutes}m`;
  }, [value.maxDuration]);

  return (
    <div className="filters-panel">
      <div className="filters-head">
        <h4>Filtros</h4>
        <button type="button" className="filters-reset" onClick={onReset}>
          Restablecer filtros
        </button>
      </div>

      <div className="filter-block">
        <div className="filter-title">Horario Salida Previsto</div>
        {TIME_SLOTS.map((slot) => (
          <label key={slot.id} className="check">
            <input
              type="checkbox"
              checked={value.timeSlots.includes(slot.id)}
              onChange={() => onChange({ timeSlots: toggleInArray(value.timeSlots, slot.id) })}
            />
            {slot.label}
          </label>
        ))}
      </div>

      <div className="filter-block">
        <div className="filter-title">Aerolíneas Recomendadas</div>
        {AIRLINES.map((airline) => (
          <label key={airline} className="check">
            <input
              type="checkbox"
              checked={value.airlines.includes(airline)}
              onChange={() => onChange({ airlines: toggleInArray(value.airlines, airline) })}
            />
            {airline}
          </label>
        ))}
      </div>

      <div className="filter-block">
        <div className="filter-title">Duración del Vuelo</div>
        <input
          type="range"
          className="filters-slider"
          min="60"
          max="1440"
          step="30"
          value={value.maxDuration}
          onChange={(e) => onChange({ maxDuration: Number(e.target.value) })}
          aria-label="Duración máxima del vuelo"
        />
        <div className="filters-slider-meta">
          <span className="muted">{durationLabel}</span>
        </div>
      </div>

      <div className="filter-block">
        <div className="filter-title">Escalas</div>
        {STOPS.map((stop) => (
          <label key={stop.id} className="check">
            <input
              type="checkbox"
              checked={value.stops.includes(stop.id)}
              onChange={() => onChange({ stops: toggleInArray(value.stops, stop.id) })}
            />
            {stop.label}
          </label>
        ))}
      </div>

      <div className="filter-block">
        <div className="filter-title">Equipaje</div>
        <label className="check">
          <input
            type="checkbox"
            checked={value.baggageIncluded}
            onChange={(e) => onChange({ baggageIncluded: e.target.checked })}
          />
          Incluye Equipaje Facturado
        </label>
      </div>
    </div>
  );
}

export default FlightsFiltersPanel;
