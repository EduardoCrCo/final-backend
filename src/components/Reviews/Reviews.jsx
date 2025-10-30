import { useState } from "react";
import { ReviewForm } from "../Reviews/ReviewForm/ReviewForm";
import { CommentsList } from "../Reviews/CommentsList/CommentsList";

export const Reviews = () => {
  const [comments, setComments] = useState([]);

  const handleAddComment = (comment) => {
    setComments([...comments, comment]);
  };

  return (
    <div className="reviews-container space-y-20 p-10">
      <ReviewForm onAddComment={handleAddComment} />
      <div className="flex justify-space-between ">
        <CommentsList comments={comments} />
      </div>
    </div>
  );
};
