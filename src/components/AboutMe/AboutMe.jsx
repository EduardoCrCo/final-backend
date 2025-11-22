import gitHub from "../../images/gitHub.png";
import linkedIn from "../../images/In.png";

export const AboutMe = () => {
  return (
    <section className="about">
      <div className="about__container">
        {/* BLOQUE: QUIÉN SOY */}
        <div className="about__card">
          <h2 className="about__title">Quién soy</h2>
          <p className="about__text">
            Soy Eduardo Cruz, desarrollador web full-stack apasionado por crear
            aplicaciones robustas y escalables. Me especializo en el ecosistema
            JavaScript moderno, con experiencia en desarrollo tanto del lado del
            cliente como del servidor, siempre priorizando la seguridad, el
            rendimiento y una experiencia de usuario excepcional.
          </p>
        </div>

        {/* BLOQUE: FOTO */}
        <div className="about__photo-wrapper">
          <img
            src="/images/author-photo.jpg"
            alt="Foto del autor"
            className="about__photo"
          />
        </div>

        {/* BLOQUE: HABILIDADES */}
        <div className="about__card">
          <h2 className="about__title">Habilidades principales</h2>
          <ul className="about__list">
            <li className="about__list-item">
              Desarrollo Frontend con React y hooks modernos
            </li>
            <li className="about__list-item">
              Backend con Node.js, Express y MongoDB
            </li>
            <li className="about__list-item">
              Integración de APIs externas (YouTube Data API v3)
            </li>
            <li className="about__list-item">
              Autenticación JWT y manejo seguro de tokens
            </li>
            <li className="about__list-item">
              Arquitectura de componentes reutilizables
            </li>
            <li className="about__list-item">
              Gestión de estado y Context API
            </li>
          </ul>
        </div>

        {/* BLOQUE: TECNOLOGÍAS */}
        <div className="about__card">
          <h2 className="about__title">Tecnologías utilizadas</h2>
          <ul className="about__list">
            <li className="about__list-item">
              React 18 + Hooks (useState, useEffect, useContext)
            </li>
            <li className="about__list-item">
              Node.js + Express.js para API REST
            </li>
            <li className="about__list-item">MongoDB con Mongoose ODM</li>
            <li className="about__list-item">JWT para autenticación segura</li>
            <li className="about__list-item">YouTube Data API v3</li>
            <li className="about__list-item">
              Vite como bundler y herramienta de desarrollo
            </li>
            <li className="about__list-item">
              CSS modular con metodología BEM
            </li>
          </ul>
        </div>

        {/* BLOQUE: DESCRIPCIÓN DE LA APLICACIÓN */}
        <div className="about__card">
          <h2 className="about__title">Sobre esta aplicación</h2>
          <p className="about__text">
            VideoHub es una plataforma completa para descubrir y gestionar
            contenido de YouTube. Permite buscar videos en tiempo real, crear
            playlists personalizadas, sistema de likes y reviews comunitarios.
            Incluye un dashboard administrativo con estadísticas detalladas de
            usuarios y videos. La aplicación implementa autenticación segura
            JWT, validaciones robustas y un sistema de permisos granular para la
            gestión de contenido.
          </p>
        </div>

        {/* BLOQUE: LINKS */}
        <div className="about__links">
          <a href="https://github.com/tu-usuario" className="about__link">
            GitHub
            <img className="about__icon" src={gitHub} alt="GitHub" />
          </a>
          <a href="https://linkedin.com/in/tu-perfil" className="about__link">
            LinkedIn
            <img className="about__icon" src={linkedIn} alt="LinkedIn" />
          </a>
        </div>
      </div>
    </section>
  );
};
