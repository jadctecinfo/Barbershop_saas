import Container from "../common/Container";

import "./HowItWorks.css";

const steps = [
  {
    number: "01",
    title: "Registra tu barbería",
    description:
      "Crea tu cuenta y obtén un espacio independiente para administrar tu negocio."
  },
  {
    number: "02",
    title: "Configura tu operación",
    description:
      "Agrega sucursales, servicios, profesionales y horarios de trabajo."
  },
  {
    number: "03",
    title: "Comparte tu página",
    description:
      "Tus clientes podrán consultar servicios, profesionales y horarios disponibles."
  },
  {
    number: "04",
    title: "Recibe reservas",
    description:
      "Las nuevas citas se integran automáticamente con la disponibilidad de tu agenda."
  }
];

export default function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="how-it-works"
    >
      <Container>
        <div className="how-it-works__header">
          <span className="how-it-works__eyebrow">
            Cómo funciona
          </span>

          <h2>
            De registrar tu barbería a recibir
            reservas online.
          </h2>

          <p>
            Configura BarberShop paso a paso y
            comienza a centralizar la operación
            de tu negocio en una sola plataforma.
          </p>
        </div>

        <div className="how-it-works__grid">
          {steps.map((step) => (
            <article
              key={step.number}
              className="how-it-works__step"
            >
              <span className="how-it-works__number">
                {step.number}
              </span>

              <h3>
                {step.title}
              </h3>

              <p>
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
``