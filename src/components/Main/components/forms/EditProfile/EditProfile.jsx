import { useState, useContext } from "react";
import { CurrentUserContext } from "../../../../../context/CurrentUserContext";

export const EditProfile = ({ onClose }) => {
  const userContext = useContext(CurrentUserContext);
  const { currentUser, setCurrentUser, handleUpdateUser } = userContext;

  const [name, setName] = useState(currentUser?.name || "");
  // const [about, setAbout] = useState(currentUser?.about || "");

  const handleNameChange = (e) => {
    console.log(currentUser);
    setName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("🔄 Enviando actualización de perfil:", {
    //   name,
    //   about: currentUser?.about,
    // });

    if (typeof handleUpdateUser === "function") {
      try {
        await handleUpdateUser({ name, about: currentUser?.about });
        // console.log("✅ Perfil actualizado exitosamente");
        if (typeof onClose === "function") {
          onClose();
        }
      } catch (error) {
        console.error("❌ Error al actualizar perfil:", error);
      }
    } else {
      console.warn("handleUpdateUser no es una función válida");
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
          // onChange={(e) => setName(e.target.value)}
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
