import Button from "../common/Button";
import Container from "../common/Container";

import "./Hero.css";

const heroBenefits = [
  "Reservas online 24/7",
  "Agenda centralizada",
  "Gestión de profesionales"
];

export default function Hero() {
  return (
    <section className="hero">
      <Container className="hero__container">
        <div className="hero__content">
          <div className="hero__eyebrow">
            <span
              className="hero__eyebrow-dot"
              aria-hidden="true"
            />

            <span>
              Software para barberías modernas
            </span>
          </div>

          <h1 className="hero__title">
            Tu barbería.
            <span> Más organizada.</span>
            <strong> Más reservas.</strong>
          </h1>

          <p className="hero__description">
            Gestiona servicios, profesionales,
            horarios y reservas online desde un
            solo lugar. Menos tareas manuales y
            más tiempo para hacer crecer tu negocio.
          </p>

          <div className="hero__actions">
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

          <div className="hero__benefits">
            {heroBenefits.map((benefit) => (
              <div
                key={benefit}
                className="hero__benefit"
              >
                <span
                  className="hero__check"
                  aria-hidden="true"
                >
                  ✓
                </span>

                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero__visual">
          <div className="hero-dashboard">
            <div className="hero-dashboard__top">
              <div>
                <span className="hero-dashboard__label">
                  Agenda de hoy
                </span>

                <strong>
                  Sábado, 10 de octubre
                </strong>
              </div>

              <span className="hero-dashboard__status">
                Operando
              </span>
            </div>

            <div className="hero-dashboard__stats">
              <div>
                <span>Reservas</span>
                <strong>12</strong>
              </div>

              <div>
                <span>Disponibles</span>
                <strong>8</strong>
              </div>

              <div>
                <span>Barberos</span>
                <strong>4</strong>
              </div>
            </div>

            <div className="hero-dashboard__agenda">
              <div className="hero-dashboard__agenda-header">
                <span>Agenda</span>
                <span>Estado</span>
              </div>

              <div className="hero-dashboard__appointment">
                <div className="hero-dashboard__time">
                  <strong>09:30</strong>
                  <span>10:15</span>
                </div>

                <div className="hero-dashboard__client">
                  <strong>
                    Corte clásico premium
                  </strong>

                  <span>
                    Carlos Barber
                  </span>
                </div>

                <span className="hero-dashboard__badge">
                  Confirmada
                </span>
              </div>

              <div className="hero-dashboard__appointment">
                <div className="hero-dashboard__time">
                  <strong>11:45</strong>
                  <span>12:30</span>
                </div>

                <div className="hero-dashboard__client">
                  <strong>
                    Corte clásico premium
                  </strong>

                  <span>
                    Reserva online
                  </span>
                </div>

                <span
                  className="
                    hero-dashboard__badge
                    hero-dashboard__badge--pending
                  "
                >
                  Pendiente
                </span>
              </div>

              <div className="hero-dashboard__slot">
                <span>13:15</span>

                <strong>
                  Horario disponible
                </strong>

                <span aria-hidden="true">
                  +
                </span>
              </div>
            </div>
          </div>

          <div className="hero__floating-card">
            <span
              className="hero__floating-icon"
              aria-hidden="true"
            >
              ✓
            </span>

            <div>
              <strong>
                Nueva reserva
              </strong>

              <span>
                Reserva online recibida
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}