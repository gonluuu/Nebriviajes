function TopBar() {
  return (
    <div className="topbar">
      <div className="topbar-left">
        <a href="#" className="toplink">Contacto</a>
        <span className="sep">|</span>
        <a href="#" className="toplink">Preguntas Frecuentes</a>
      </div>

      <div className="topbar-right">
        <span className="chip">ES</span>
        <span className="sep">|</span>
        <span className="chip">EUR</span>
      </div>
    </div>
  );
}

export default TopBar;
