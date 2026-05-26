import Button from "../ui/Button";
import Input from "../ui/Input";
import { IconCar, IconCalendar } from "../icons/TravelIcons";

function VehiclesSearchBar({ value, onChange, onSearch }) {
  return (
    <div className="searchbar flightsbar">
      <label className="searchfield">
        <span className="icon">
          <IconCar size={18} />
        </span>
        <Input
          className="input"
          placeholder="Ciudad"
          value={value.city}
          onChange={(e) => onChange({ city: e.target.value })}
        />
      </label>

      <label className="searchfield">
        <span className="icon">
          <IconCalendar size={18} />
        </span>
        <Input
          className="input"
          type="date"
          aria-label="Desde"
          value={value.startDate}
          onChange={(e) => onChange({ startDate: e.target.value })}
        />
      </label>

      <label className="searchfield">
        <span className="icon">
          <IconCalendar size={18} />
        </span>
        <Input
          className="input"
          type="date"
          aria-label="Hasta"
          value={value.endDate}
          onChange={(e) => onChange({ endDate: e.target.value })}
        />
      </label>

      <label className="searchfield">
        <Input
          className="input"
          placeholder="Tipo (SUV, Compacto...)"
          value={value.type}
          onChange={(e) => onChange({ type: e.target.value })}
        />
      </label>

      <label className="searchfield">
        <Input
          className="input"
          type="number"
          placeholder="Precio máximo"
          value={value.maxPrice}
          onChange={(e) => onChange({ maxPrice: e.target.value })}
        />
      </label>

      <Button className="searchbtn maroon" onClick={onSearch}>
        Buscar
      </Button>
    </div>
  );
}

export default VehiclesSearchBar;
