import Button from "../ui/Button";
import Input from "../ui/Input";
import { IconTrain, IconCalendar } from "../icons/TravelIcons";

function TrainsSearchBar({ value, onChange, onSearch }) {
  return (
    <div className="searchbar flightsbar">
      <label className="searchfield">
        <span className="icon">
          <IconTrain size={18} />
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
          <IconTrain size={18} />
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
          value={value.date}
          onChange={(e) => onChange({ date: e.target.value })}
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

export default TrainsSearchBar;
