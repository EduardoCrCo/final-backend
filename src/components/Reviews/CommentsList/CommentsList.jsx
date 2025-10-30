export const CommentsList = ({ comments }) => (
  <ul className="mt-6 space-y-2 w-full max-w-md mx-auto">
    {comments.length === 0 ? (
      <li className="text-gray-400 italic">No hay comentarios aún.</li>
    ) : (
      comments.map((c, i) => (
        <li key={i} className="bg-gray-100 p-2 rounded">
          {c}
        </li>
      ))
    )}
  </ul>
);
