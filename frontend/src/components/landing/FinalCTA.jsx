import Button from "../common/Button";
import Container from "../common/Container";

import "./FinalCTA.css";

export default function FinalCTA() {
  return (
    <section className="final-cta">
      <Container>
        <div className="final-cta__content">
          <div className="final-cta__text">
            <span className="final-cta__eyebrow">
              BarberShop SaaS
            </span>

            <h2>
              Lleva la gestión de tu barbería
              al siguiente nivel.
            </h2>

            <p>
              Centraliza tu agenda, organiza tu equipo
              y permite que tus clientes reserven
              online desde cualquier lugar.
            </p>
          </div>

          <div className="final-cta__actions">
            <Button
              to="/register"
              variant="primary"
              size="large"
            >
              Registrar mi barbería
            </Button>

            <Button
              to="/login"
              variant="secondary"
              size="large"
            >
              Iniciar sesión
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}