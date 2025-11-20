export const Preloader = ({ message = "Cargando..." }) => {
  return (
    <div className="preloader-container">
      <i className="circle-preloader"></i>
      <p className="preloader-message">{message}</p>
    </div>
  );
};
