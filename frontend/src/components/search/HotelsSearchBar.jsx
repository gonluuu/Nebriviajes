import Button from "../ui/Button";
import Input from "../ui/Input";

import { IconSearch, IconCalendar, IconUser } from "../icons/TravelIcons";

function HotelsSearchBar() {
  return (
    <div className="searchbar">
      <label className="searchfield">
        <span className="icon">
          <IconSearch size={18} />
        </span>
        <Input className="input" placeholder="Destino" />
      </label>

      <label className="searchfield">
        <span className="icon">
          <IconCalendar size={18} />
        </span>
        <Input className="input" type="date" aria-label="Fecha de check-in" />
      </label>

      <label className="searchfield">
        <span className="icon">
          <IconCalendar size={18} />
        </span>
        <Input className="input" type="date" aria-label="Fecha de check-out" />
      </label>

      <label className="searchfield">
        <span className="icon">
          <IconUser size={18} />
        </span>
        <Input className="input" type="number" min="1" placeholder="Huéspedes" />
      </label>

      <Button className="searchbtn">Buscar</Button>
    </div>
  );
}

export default HotelsSearchBar;
