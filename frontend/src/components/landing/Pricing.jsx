import Button from "../common/Button";
import Container from "../common/Container";

import "./Pricing.css";

const plans = [
  {
    id: 1,
    name: "Inicial",
    price: "$49.900",
    description:
      "Para barberías que quieren comenzar a organizar su operación.",
    features: [
      "1 sucursal",
      "Hasta 3 profesionales",
      "Servicios ilimitados",
      "Agenda digital",
      "Reservas online",
      "Página pública de reservas"
    ]
  },
  {
    id: 2,
    name: "Profesional",
    price: "$89.900",
    description:
      "Para barberías que buscan crecer y centralizar su gestión.",
    features: [
      "Hasta 3 sucursales",
      "Hasta 10 profesionales",
      "Servicios ilimitados",
      "Agenda centralizada",
      "Reservas online 24/7",
      "Página pública de reservas",
      "Gestión de disponibilidad",
      "Soporte prioritario"
    ]
  },
  {
    id: 3,
    name: "Negocio",
    price: "$149.900",
    description:
      "Para barberías con varias sedes y equipos más grandes.",
    features: [
      "Sucursales ampliadas",
      "Profesionales ampliados",
      "Servicios ilimitados",
      "Agenda centralizada",
      "Reservas online 24/7",
      "Página pública de reservas",
      "Gestión de disponibilidad",
      "Soporte prioritario"
    ]
  }
];

export default function Pricing() {
  return (
    <section
      id="planes"
      className="pricing"
    >
      <Container>
        <div className="pricing__header">
          <span className="pricing__eyebrow">
            Planes
          </span>

          <h2>
            Un plan para cada etapa de tu barbería.
          </h2>

          <p>
            Comienza con lo que necesitas hoy y
            evoluciona a medida que crece tu operación.
          </p>
        </div>

        <div className="pricing__grid">
          {plans.map((plan) => (
            <article
              key={plan.id}
              className="pricing__card"
            >
              <div className="pricing__card-header">
                <h3>
                  {plan.name}
                </h3>

                <p>
                  {plan.description}
                </p>
              </div>

              <div className="pricing__price">
                <strong>
                  {plan.price}
                </strong>

                <span>
                  / mes
                </span>
              </div>

              <Button
                to="/register"
                variant="primary"
                fullWidth
              >
                Registrar mi barbería
              </Button>

              <ul className="pricing__features">
                {plan.features.map((feature) => (
                  <li key={feature}>
                    <span
                      className="pricing__check"
                      aria-hidden="true"
                    >
                      ✓
                    </span>

                    <span>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <p className="pricing__note">
          Valores de referencia para la etapa
          comercial del MVP.
        </p>
      </Container>
    </section>
  );
}