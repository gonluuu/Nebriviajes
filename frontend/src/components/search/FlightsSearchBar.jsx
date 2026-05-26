import Button from "../ui/Button";
import Input from "../ui/Input";
import { IconPlane, IconCalendar } from "../icons/TravelIcons";

function FlightsSearchBar({ value, onChange, onSearch }) {
  return (
    <div className="searchbar flightsbar">
      <label className="searchfield">
        <span className="icon">
          <IconPlane size={18} />
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
          <IconPlane size={18} />
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
          value={value.departureDate}
          onChange={(e) => onChange({ departureDate: e.target.value })}
        />
      </label>

      <label className="searchfield">
        <span className="icon">
          <IconCalendar size={18} />
        </span>
        <Input
          className="input"
          type="date"
          value={value.returnDate}
          onChange={(e) => onChange({ returnDate: e.target.value })}
        />
      </label>

      <Button className="searchbtn maroon" onClick={onSearch}>
        Buscar
      </Button>
    </div>
  );
}

export default FlightsSearchBar;
