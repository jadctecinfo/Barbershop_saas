import { Link } from "react-router";

import Container from "../common/Container";

import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <Container>
        <div className="footer__main">
          <div className="footer__brand">
            <div className="footer__brand-link">
              <span className="footer__logo">
                B
              </span>

              <span className="footer__brand-name">
                BarberShop
                <span>SaaS</span>
              </span>
            </div>

            <p>
              La plataforma para gestionar barberías,
              organizar agendas y recibir reservas online.
            </p>
          </div>

          <div className="footer__column">
            <h3>Producto</h3>

            <span>Beneficios</span>
            <span>Funcionalidades</span>
            <span>Cómo funciona</span>
            <span>Planes</span>
          </div>

          <div className="footer__column">
            <h3>BarberShop</h3>

            <Link to="/register">
              Registrar mi barbería
            </Link>

            <Link to="/login">
              Iniciar sesión
            </Link>
          </div>
        </div>

        <div className="footer__bottom">
          <p>
            © 2026 BarberShop SaaS. Todos los derechos reservados.
          </p>

          <p>
            Software para barberías modernas.
          </p>
        </div>
      </Container>
    </footer>
  );
}