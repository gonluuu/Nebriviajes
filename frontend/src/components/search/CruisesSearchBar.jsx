import Button from "../ui/Button";
import Input from "../ui/Input";
import { IconShip, IconCalendar } from "../icons/TravelIcons";

function CruisesSearchBar({ value, onChange, onSearch }) {
  return (
    <div className="searchbar flightsbar">
      <label className="searchfield">
        <span className="icon">
          <IconShip size={18} />
        </span>
        <Input
          className="input"
          placeholder="Origen"
          value={value.origin}
          onChange={(e) => onChange({ origin: e.target.value })}
        />
      </label>

      <label className="searchfield">
        <span className="icon">
          <IconShip size={18} />
        </span>
        <Input
          className="input"
          placeholder="Destino"
          value={value.destination}
          onChange={(e) => onChange({ destination: e.target.value })}
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
          type="number"
          placeholder="Duración mínima (días)"
          value={value.minDuration}
          onChange={(e) => onChange({ minDuration: e.target.value })}
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

export default CruisesSearchBar;
