 function FlightsSearchBar() {
  return (
    <div className="searchbar flightsbar">
      <label className="searchfield">
        <span className="icon">🛫</span>
        <input className="input" placeholder="Origen" />
      </label>

      <label className="searchfield">
        <span className="icon">🛬</span>
        <input className="input" placeholder="Destino" />
      </label>

      <label className="searchfield">
        <span className="icon">📅</span>
        <input className="input" type="date" />
      </label>

      <label className="searchfield">
        <span className="icon">📅</span>
        <input className="input" type="date" />
      </label>

      <button className="searchbtn maroon">Buscar</button>
    </div>
  );
}

export default FlightsSearchBar;