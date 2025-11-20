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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Crear Review {video?.title ? `para "${video.title}"` : ""}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rating (1-5 estrellas)
            </label>
            <select
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título de la review (3-100 caracteres)
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Título de tu review"
              className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              required
              minLength={3}
              maxLength={100}
            />
            <span className="text-xs text-gray-500">
              {formData.title.length}/100 caracteres
            </span>
          </div>

          {/* Contenido */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contenido (10-1000 caracteres)
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={4}
              placeholder="Escribe tu review detallada aquí..."
              className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              required
              minLength={10}
              maxLength={1000}
            />
            <span className="text-xs text-gray-500">
              {formData.content.length}/1000 caracteres
            </span>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (opcional, separados por comas)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="ej: divertido, educativo, entretenido"
              className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          {/* Público/Privado */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isPublic"
              checked={formData.isPublic}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="text-sm text-gray-700">
              Hacer review pública (otros usuarios podrán verla)
            </label>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Enviando..." : "Crear Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
