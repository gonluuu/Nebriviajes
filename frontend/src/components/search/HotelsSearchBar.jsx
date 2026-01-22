function HotelsSearchBar() {
  return (
    <div className="searchbar">
      <label className="searchfield">
        <span className="icon">🔎</span>
        <input className="input" placeholder="Destino" />
      </label>

      <label className="searchfield">
        <span className="icon">📅</span>
        <input className="input" placeholder="Fecha de check-in" />
      </label>

      <label className="searchfield">
        <span className="icon">📅</span>
        <input className="input" placeholder="Fecha de check-out" />
      </label>

      <label className="searchfield">
        <span className="icon">👤</span>
        <input className="input" placeholder="Huéspedes" />
      </label>

      <button className="searchbtn">Buscar</button>
    </div>
  );
}

export default HotelsSearchBar;
