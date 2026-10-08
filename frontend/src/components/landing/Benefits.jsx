import Container from "../common/Container";

import "./Benefits.css";

const benefits = [
  {
    icon: "01",
    title: "Agenda en un solo lugar",
    description:
      "Organiza horarios, profesionales y reservas desde una única plataforma."
  },
  {
    icon: "02",
    title: "Reservas online 24/7",
    description:
      "Tus clientes pueden consultar disponibilidad y reservar incluso cuando la barbería está cerrada."
  },
  {
    icon: "03",
    title: "Menos trabajo manual",
    description:
      "Reduce llamadas, mensajes y cruces de agenda con disponibilidad calculada automáticamente."
  },
  {
    icon: "04",
    title: "Tu propia página de reservas",
    description:
      "Cada barbería obtiene una página pública donde sus clientes pueden reservar fácilmente."
  }
];

export default function Benefits() {
  return (
    <section
      id="beneficios"
      className="benefits"
    >
      <Container>
        <div className="benefits__header">
          <span className="benefits__eyebrow">
            Beneficios
          </span>

          <h2>
            Más control sobre tu negocio.
            Menos tiempo gestionando la agenda.
          </h2>

          <p>
            BarberShop reúne las herramientas
            esenciales para gestionar una barbería
            moderna y ofrecer una mejor experiencia
            de reserva a tus clientes.
          </p>
        </div>

        <div className="benefits__grid">
          {benefits.map((benefit) => (
            <article
              key={benefit.title}
              className="benefits__card"
            >
              <span className="benefits__icon">
                {benefit.icon}
              </span>

              <h3>
                {benefit.title}
              </h3>

              <p>
                {benefit.description}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}