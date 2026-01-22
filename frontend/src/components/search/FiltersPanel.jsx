function FiltersPanel() {
  return (
    <div className="filters">
      <h4>Filtrar por</h4>

      <div className="filter-block">
        <div className="filter-title">Presupuesto (por noche)</div>
        <label className="check"><input type="checkbox" /> 0 - 50€</label>
        <label className="check"><input type="checkbox" /> 50 - 100€</label>
        <label className="check"><input type="checkbox" /> 100 - 150€</label>
        <label className="check"><input type="checkbox" /> 150 - 200€</label>
        <label className="check"><input type="checkbox" /> 200€+</label>
      </div>
    </div>
  );
}

export default FiltersPanel;
