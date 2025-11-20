import { useContext, useRef, useEffect } from "react";
import { CurrentUserContext } from "../../../../../context/CurrentUserContext";
import FormValidator from "../../../../../utils/FormValidator";

export const EditAvatar = ({ onClose }) => {
  const { handleUpdateAvatar } = useContext(CurrentUserContext);
  const formRef = useRef();

  // 🔹 Función separada para inicializar validación
  const initializeValidation = (formElement) => {
    const validator = new FormValidator(formElement, {
      formSelector: ".form",
      inputSelector: ".form__input",
      submitButtonSelector: ".form__submit",
      inactiveButtonClass: "button_inactive",
      inputErrorClass: "form__input_type_error",
      errorClass: "form__input-error_active",
    });
    validator.enableValidation();
    return validator;
  };

  useEffect(() => {
    if (formRef.current) {
      initializeValidation(formRef.current);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const avatarUrl = formRef.current.link.value.trim();

    console.log("🔄 Actualizando avatar con URL:", avatarUrl);

    if (avatarUrl) {
      handleUpdateAvatar(avatarUrl)
        .then(() => {
          console.log("✅ Avatar actualizado exitosamente");
          formRef.current.reset();
          if (onClose) onClose();
        })
        .catch((error) => {
          console.error("❌ Error al actualizar avatar:", error);
        });
    }
  };

  return (
    <form
      className="form form__avatar"
      onSubmit={handleSubmit}
      ref={formRef}
      noValidate
    >
      <h1 className="form__avatar-title">Cambiar foto del perfil</h1>
      <fieldset className="form__avatar-fieldset">
        <input
          id="inputAvatarUrl"
          type="url"
          name="link"
          className="form__input form__input_url-image"
          placeholder="URL de la imagen"
          required
        />
        <span className="inputAvatarUrl-error"></span>
      </fieldset>
      <button type="submit" className="form__submit">
        Guardar
      </button>
    </form>
  );
};
