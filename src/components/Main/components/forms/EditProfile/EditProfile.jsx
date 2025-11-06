import { useState, useContext } from "react";
import { CurrentUserContext } from "../../../../../context/CurrentUserContext";
import api from "../../../../../utils/api";

export const EditProfile = ({ onClose }) => {
  const userContext = useContext(CurrentUserContext);
  const { currentUser, setCurrentUser } = userContext;

  const [name, setName] = useState(currentUser?.name || "");
  // const [about, setAbout] = useState(currentUser?.about || "");

  const handleNameChange = (e) => {
    console.log(currentUser);
    setName(e.target.value);
  };

  // const handleAboutChange = (e) => {
  //   setAbout(e.target.value);
  // };

  const handleUpdateUser = (userData) => {
    (async () => {
      await api
        .updateUser(userData.name, currentUser.about)
        .then((updatedUser) => {
          setCurrentUser(updatedUser);
          localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        });
    })();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission
    await handleUpdateUser({ name, about: currentUser.about });
    if (typeof onClose === "function") {
      onClose();
    }
  };

  return (
    <form className="form form__profile" noValidate onSubmit={handleSubmit}>
      <h1 className="form__profile-title">Editar nombre de usuario</h1>
      <fieldset className="form__profile-fieldset">
        <input
          type="text"
          name="name"
          id="input-name"
          className="form__input form__input-name"
          placeholder="Nombre"
          required
          onChange={handleNameChange}
          minLength="2"
          maxLength="40"
          value={name}
        />
        <span className="input-name-error"></span>
        {/* <input
          id="input-About"
          type="text"
          name="about"
          className="form__input form__input-about"
          placeholder="Acerca de mi"
          required
          onChange={handleAboutChange}
          minLength="2"
          maxLength="200"
          value={about}
        />
        <span className="input-About-error"></span> */}
      </fieldset>
      <button type="submit" className="form__submit">
        Guardar
      </button>
    </form>
  );
};
