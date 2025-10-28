// About.jsx
export const AboutMe = () => {
  return (
    <section className="about">
      <div className="about__container">
        <img
          src="/images/author-photo.jpg"
          alt="Foto del autor"
          className="about__photo"
        />

        <div className="about__info">
          <h2 className="about__title">Acerca del autor</h2>
          <p className="about__description">
            Soy [Tu nombre], desarrollador web full-stack con experiencia en
            React, Node.js y bases de datos. Me apasiona crear aplicaciones web
            modernas y funcionales.
          </p>
          <p className="about__description">
            Este proyecto demuestra mis habilidades en desarrollo front-end y
            back-end, implementando autenticación de usuarios y consumo de APIs
            externas.
          </p>

          <div className="about__skills">
            <h3>Tecnologías utilizadas:</h3>
            <ul>
              <li>React</li>
              <li>Node.js</li>
              <li>Express</li>
              <li>MongoDB</li>
            </ul>
          </div>

          <div className="about__links">
            <a href="https://github.com/tu-usuario" className="about__link">
              GitHub
            </a>
            <a href="https://linkedin.com/in/tu-perfil" className="about__link">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
