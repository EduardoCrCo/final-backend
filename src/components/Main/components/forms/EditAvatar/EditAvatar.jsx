export const EditAvatar = () => {
  return (
    <form
      className="form form_avatar"
      onSubmit={handleSubmit}
      ref={formRef}
      noValidate
    >
      <h3 className="edit-profile">Cambiar foto de perfil</h3>
      <input
        id="inputAvatarUrl"
        type="url"
        name="link"
        className="form__input form__input_url-image"
        placeholder="URL de la imagen"
        required
      />
      <span className="inputAvatarUrl-error"></span>
      <button type="submit" className="form__submit">
        Guardar
      </button>
    </form>
  );
};
