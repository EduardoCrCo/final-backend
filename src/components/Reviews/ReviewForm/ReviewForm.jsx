import { useState } from "react";
import { ReviewsList } from "../ReviewsList/ReviewsList";

export const ReviewForm = ({ onAddReview }) => {
  const [review, setReview] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (review.trim()) {
      onAddReview(review);
      setReview("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto mt-4">
      <label className="block mb-2 text-sm font-medium text-gray-700">
        Escribe tu comentario:
      </label>
      <textarea
        className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
        rows={4}
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Deja tu comentario aquí..."
      />
      <button
        type="submit"
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Enviar
      </button>
    </form>
  );
};
