import { Link } from "react-router";

import Button from "../common/Button";
import Container from "../common/Container";

import "./Navbar.css";

export default function Navbar() {
  function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }

  return (
    <header className="landing-navbar">
      <Container className="landing-navbar__container">
        <Link
          to="/"
          className="landing-navbar__brand"
          aria-label="BarberShop SaaS - Inicio"
        >
          <span
            className="landing-navbar__logo"
            aria-hidden="true"
          >
            B
          </span>

          <span className="landing-navbar__brand-text">
            BarberShop
            <span>SaaS</span>
          </span>
        </Link>

        <nav
          className="landing-navbar__nav"
          aria-label="Navegación principal"
        >
          <button
            type="button"
            onClick={() => scrollToSection("beneficios")}
          >
            Beneficios
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("funcionalidades")}
          >
            Funcionalidades
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("como-funciona")}
          >
            Cómo funciona
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("planes")}
          >
            Planes
          </button>
        </nav>

        <div className="landing-navbar__actions">
          <Button
            to="/login"
            variant="ghost"
            size="small"
          >
            Iniciar sesión
          </Button>

          <Button
            to="/register"
            variant="primary"
            size="small"
          >
            Registrar barbería
          </Button>
        </div>
      </Container>
    </header>
  );
}