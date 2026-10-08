import Container from "../common/Container";

import "./Features.css";

const features = [
  {
    number: "01",
    title: "Gestión de servicios",
    description:
      "Organiza tus servicios, precios y duración desde un panel centralizado."
  },
  {
    number: "02",
    title: "Gestión de profesionales",
    description:
      "Administra tus barberos, especialidades y servicios asignados."
  },
  {
    number: "03",
    title: "Horarios de trabajo",
    description:
      "Configura la jornada de cada profesional y controla cuándo está disponible."
  },
  {
    number: "04",
    title: "Disponibilidad automática",
    description:
      "BarberShop calcula los horarios disponibles considerando duración, agenda y reservas existentes."
  },
  {
    number: "05",
    title: "Reservas online",
    description:
      "Tus clientes pueden consultar horarios y reservar directamente desde la página de tu barbería."
  },
  {
    number: "06",
    title: "Agenda centralizada",
    description:
      "Consulta las reservas de tu equipo desde un único lugar y mantén el control de la operación."
  }
];

export default function Features() {
  return (
    <section
      id="funcionalidades"
      className="features"
    >
      <Container>
        <div className="features__header">
          <span className="features__eyebrow">
            Funcionalidades
          </span>

          <h2>
            Todo lo que necesitas para administrar
            tu barbería.
          </h2>

          <p>
            BarberShop conecta la operación diaria
            de tu negocio con una experiencia de
            reservas sencilla para tus clientes.
          </p>
        </div>

        <div className="features__grid">
          {features.map((feature) => (
            <article
              key={feature.number}
              className="features__card"
            >
              <div className="features__number">
                {feature.number}
              </div>

              <div className="features__content">
                <h3>
                  {feature.title}
                </h3>

                <p>
                  {feature.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}