
function FiltersPanel({ value = "", onChange }) {
  return (
    <div className="filters-panel">
      <h4>Filtrar por</h4>

      <div className="filter-block">
        <div className="filter-title">Presupuesto (por noche)</div>
        <label className="check">
          <input
            type="radio"
            name="budget"
            checked={value === ""}
            onChange={() => onChange?.("")}
          />
          Todos
        </label>

        <label className="check">
          <input
            type="radio"
            name="budget"
            checked={value === "0-50"}
            onChange={() => onChange?.("0-50")}
          />
          0 - 50€
        </label>

        <label className="check">
          <input
            type="radio"
            name="budget"
            checked={value === "50-100"}
            onChange={() => onChange?.("50-100")}
          />
          50 - 100€
        </label>

        <label className="check">
          <input
            type="radio"
            name="budget"
            checked={value === "100-150"}
            onChange={() => onChange?.("100-150")}
          />
          100 - 150€
        </label>

        <label className="check">
          <input
            type="radio"
            name="budget"
            checked={value === "150-200"}
            onChange={() => onChange?.("150-200")}
          />
          150 - 200€
        </label>

        <label className="check">
          <input
            type="radio"
            name="budget"
            checked={value === "200+"}
            onChange={() => onChange?.("200+")}
          />
          200€+
        </label>
      </div>
    </div>
  );
}

export default FiltersPanel;
