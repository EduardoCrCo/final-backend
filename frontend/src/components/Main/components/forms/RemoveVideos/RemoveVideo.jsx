export default function RemoveVideo({ onConfirm }) {
  return (
    <form
      className="form form_remove"
      noValidate
      onSubmit={(e) => e.preventDefault()}
    >
      <h3 className="edit-profile">¿Estás seguro/a?</h3>
      <button type="submit" className="form__submit" onClick={onConfirm}>
        Sí, eliminar
      </button>
    </form>
  );
}
