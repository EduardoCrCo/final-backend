import { useState, useContext } from "react";
import { CurrentUserContext } from "../../../../../context/CurrentUserContext";

export const EditProfile = ({ onClose }) => {
  const userContext = useContext(CurrentUserContext);
  const { currentUser, handleUpdateUser } = userContext;

  const [name, setName] = useState(currentUser?.name || "");

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || name.trim().length < 2) {
      alert("El nombre debe tener al menos 2 caracteres");
      return;
    }

    if (name.trim().length > 40) {
      alert("El nombre no puede tener más de 40 caracteres");
      return;
    }

    const trimmedName = name.trim();

    const aboutValue = currentUser?.about || "Usuario sin descripción";

    if (typeof handleUpdateUser === "function") {
      try {
        await handleUpdateUser({ name: trimmedName, about: aboutValue });

        if (typeof onClose === "function") {
          onClose();
        }
      } catch (error) {
        console.error("❌ Error al actualizar perfil:", error);

        const errorMessage = error.message || "Error desconocido";
        alert(`Error al actualizar perfil: ${errorMessage}`);
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
          minLength="2"
          maxLength="40"
          value={name}
        />
        <span className="input-name-error"></span>
      </fieldset>
      <button type="submit" className="form__submit">
        Guardar
      </button>
    </form>
  );
};
