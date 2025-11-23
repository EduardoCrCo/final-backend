import { useState } from "react";
import { ReviewsList } from "../ReviewsList/ReviewsList";

export const ReviewForm = ({ onAddReview, onClose, video }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    rating: 5,
    tags: "",
    isPublic: true,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      alert("Título y contenido son requeridos");
      return;
    }

    if (formData.title.length < 3 || formData.title.length > 100) {
      alert("El título debe tener entre 3 y 100 caracteres");
      return;
    }

    if (formData.content.length < 10 || formData.content.length > 1000) {
      alert("El contenido debe tener entre 10 y 1000 caracteres");
      return;
    }

    setLoading(true);
    try {
      const reviewData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        rating: parseInt(formData.rating),
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        isPublic: formData.isPublic,
      };

      await onAddReview(reviewData);
      setFormData({
        title: "",
        content: "",
        rating: 5,
        tags: "",
        isPublic: true,
      });
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-form">
      <div className="review-form__overlay">
        <div className="review-form__modal">
          <div className="review-form__header">
            <h3 className="review-form__title">
              Crear Review {video?.title ? `para "${video.title}"` : ""}
            </h3>
            <button onClick={onClose} className="review-form__close-button">
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="review-form__form">
            {/* Rating */}
            <div className="review-form__field">
              <label className="review-form__label">
                Rating (1-5 estrellas)
              </label>
              <select
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                className="review-form__select"
                required
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5 estrellas)</option>
                <option value={4}>⭐⭐⭐⭐☆ (4 estrellas)</option>
                <option value={3}>⭐⭐⭐☆☆ (3 estrellas)</option>
                <option value={2}>⭐⭐☆☆☆ (2 estrellas)</option>
                <option value={1}>⭐☆☆☆☆ (1 estrella)</option>
              </select>
            </div>

            {/* Título */}
            <div className="review-form__field">
              <label className="review-form__label">
                Título de la review (3-100 caracteres)
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Título de tu review"
                className="review-form__input"
                required
                minLength={3}
                maxLength={100}
              />
              <span className="review-form__char-count">
                {formData.title.length}/100 caracteres
              </span>
            </div>

            {/* Contenido */}
            <div className="review-form__field">
              <label className="review-form__label">
                Contenido (10-1000 caracteres)
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={4}
                placeholder="Escribe tu review detallada aquí..."
                className="review-form__textarea"
                required
                minLength={10}
                maxLength={1000}
              />
              <span className="review-form__char-count">
                {formData.content.length}/1000 caracteres
              </span>
            </div>

            {/* Tags */}
            <div className="review-form__field">
              <label className="review-form__label">
                Tags (opcional, separados por comas)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="ej: divertido, educativo, entretenido"
                className="review-form__input"
              />
            </div>

            {/* Público/Privado */}
            <div className="review-form__checkbox-field">
              <input
                type="checkbox"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleChange}
                className="review-form__checkbox"
              />
              <label className="review-form__checkbox-label">
                Hacer review pública (otros usuarios podrán verla)
              </label>
            </div>

            {/* Botones */}
            <div className="review-form__buttons">
              <button
                type="button"
                onClick={onClose}
                className="review-form__button review-form__button--cancel"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="review-form__button review-form__button--submit"
                disabled={loading}
              >
                {loading ? "Enviando..." : "Crear Review"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
