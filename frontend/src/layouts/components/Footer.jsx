 function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div>© {new Date().getFullYear()} Nebrivajes</div>

        <div className="footer-links">
          <a href="#">Términos</a>
          <a href="#">Privacidad</a>
          <a href="#">Soporte</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
