import Button from "../ui/Button";
import Input from "../ui/Input";
import { IconPlane, IconCalendar } from "../icons/TravelIcons";

function FlightsSearchBar() {
  return (
    <div className="searchbar flightsbar">
      <label className="searchfield">
        <span className="icon">
          <IconPlane size={18} />
        </span>
        <Input className="input" placeholder="Origen" />
      </label>

      <label className="searchfield">
        <span className="icon">
          <IconPlane size={18} />
        </span>
        <Input className="input" placeholder="Destino" />
      </label>

      <label className="searchfield">
        <span className="icon">
          <IconCalendar size={18} />
        </span>
        <Input className="input" type="date" />
      </label>

      <label className="searchfield">
        <span className="icon">
          <IconCalendar size={18} />
        </span>
        <Input className="input" type="date" />
      </label>

      <Button className="searchbtn maroon">Buscar</Button>
    </div>
  );
}

export default FlightsSearchBar;
