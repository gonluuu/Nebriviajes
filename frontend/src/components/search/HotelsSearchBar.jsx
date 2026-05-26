import Button from "../ui/Button";
import Input from "../ui/Input";
import { IconSearch, IconCalendar, IconUser } from "../icons/TravelIcons";

function HotelsSearchBar({ value, onChange, onSearch }) {
  return (
    <div className="searchbar">
      <label className="searchfield">
        <span className="icon">
          <IconSearch size={18} />
        </span>
        <Input
          className="input"
          placeholder="Destino"
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
          aria-label="Fecha de check-in"
          value={value.checkIn}
          onChange={(e) => onChange({ checkIn: e.target.value })}
        />
      </label>

      <label className="searchfield">
        <span className="icon">
          <IconCalendar size={18} />
        </span>
        <Input
          className="input"
          type="date"
          aria-label="Fecha de check-out"
          value={value.checkOut}
          onChange={(e) => onChange({ checkOut: e.target.value })}
        />
      </label>

      <label className="searchfield">
        <span className="icon">
          <IconUser size={18} />
        </span>
        <Input
          className="input"
          type="number"
          min="1"
          placeholder="Huéspedes"
          value={value.guests}
          onChange={(e) => onChange({ guests: e.target.value })}
        />
      </label>

      <Button className="searchbtn" onClick={onSearch}>
        Buscar
      </Button>
    </div>
  );
}

export default HotelsSearchBar;
