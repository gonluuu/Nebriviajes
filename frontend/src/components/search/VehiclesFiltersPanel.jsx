import { toggleInArray } from "../../utils/filterHelpers";

export const DEFAULT_VEHICLES_FILTERS = {
  fuels: [],
  vehicleTypes: [],
  companies: [],
  transmissions: [],
  unlimitedMileage: false,
};

const FUELS = [
  { id: "gasolina", label: "Gasolina" },
  { id: "diesel", label: "Diésel" },
  { id: "electrico", label: "Eléctrico" },
  { id: "hibrido", label: "Híbrido" },
];

const VEHICLE_TYPES = [
  { id: "coche", label: "Coche" },
  { id: "furgoneta", label: "Furgoneta" },
  { id: "moto", label: "Moto" },
];

const COMPANIES = ["Hertz", "Europcar", "Avis"];

const TRANSMISSIONS = [
  { id: "manual", label: "Manual" },
  { id: "automatica", label: "Automática" },
];

function VehiclesFiltersPanel({ value = DEFAULT_VEHICLES_FILTERS, onChange, onReset }) {
  return (
    <div className="filters-panel">
      <div className="filters-head">
        <h4>Filtros</h4>
        <button type="button" className="filters-reset" onClick={onReset}>
          Restablecer filtros
        </button>
      </div>

      <div className="filter-block">
        <div className="filter-title">Combustible</div>
        {FUELS.map((fuel) => (
          <label key={fuel.id} className="check">
            <input
              type="checkbox"
              checked={value.fuels.includes(fuel.id)}
              onChange={() => onChange({ fuels: toggleInArray(value.fuels, fuel.id) })}
            />
            {fuel.label}
          </label>
        ))}
      </div>

      <div className="filter-block">
        <div className="filter-title">Tipo de Vehículo</div>
        {VEHICLE_TYPES.map((vt) => (
          <label key={vt.id} className="check">
            <input
              type="checkbox"
              checked={value.vehicleTypes.includes(vt.id)}
              onChange={() => onChange({ vehicleTypes: toggleInArray(value.vehicleTypes, vt.id) })}
            />
            {vt.label}
          </label>
        ))}
      </div>

      <div className="filter-block">
        <div className="filter-title">Compañías Recomendadas</div>
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
        <div className="filter-title">Transmisión</div>
        {TRANSMISSIONS.map((t) => (
          <label key={t.id} className="check">
            <input
              type="checkbox"
              checked={value.transmissions.includes(t.id)}
              onChange={() => onChange({ transmissions: toggleInArray(value.transmissions, t.id) })}
            />
            {t.label}
          </label>
        ))}
      </div>

      <div className="filter-block">
        <div className="filter-title">Kilometraje</div>
        <label className="check">
          <input
            type="checkbox"
            checked={value.unlimitedMileage}
            onChange={(e) => onChange({ unlimitedMileage: e.target.checked })}
          />
          Kilometraje Ilimitado
        </label>
      </div>
    </div>
  );
}

export default VehiclesFiltersPanel;
