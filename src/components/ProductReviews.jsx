import { useState, useEffect } from "react";
import { reviewsAPI } from "../utils/api";

export default function ProductReviews({ productId, user }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await reviewsAPI.getByProduct(productId);
      setReviews(data.reviews || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to submit a review");
      return;
    }
    try {
      await reviewsAPI.create({
        productId,
        rating: formData.rating,
        comment: formData.comment,
      });
      setFormData({ rating: 5, comment: "" });
      setShowForm(false);
      await loadReviews();
    } catch (err) {
      setError(err.message);
    }
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const RatingStars = ({ rating }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= rating ? "text-yellow-400" : "text-gray-300"}>
          ★
        </span>
      ))}
    </div>
  );

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">Customer Reviews</h3>

      {/* Rating Summary */}
      {reviews.length > 0 && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-4">
            <div>
              <div className="text-3xl font-bold">{avgRating}</div>
              <RatingStars rating={Math.round(avgRating)} />
              <p className="text-sm text-gray-600 mt-1">{reviews.length} reviews</p>
            </div>
          </div>
        </div>
      )}

      {/* Add Review Button */}
      {user && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="mb-6 px-4 py-2 bg-[#1A3A5C] text-white rounded-lg hover:bg-[#142d47]"
        >
          Write a Review
        </button>
      )}

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <select
                value={formData.rating}
                onChange={(e) =>
                  setFormData({ ...formData, rating: Number(e.target.value) })
                }
                className="w-full border rounded-lg px-3 py-2"
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {r} Stars
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Comment</label>
              <textarea
                value={formData.comment}
                onChange={(e) =>
                  setFormData({ ...formData, comment: e.target.value })
                }
                placeholder="Share your experience..."
                className="w-full border rounded-lg px-3 py-2 min-h-20"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Submit Review
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Reviews List */}
      {loading && <p className="text-gray-500">Loading reviews...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      <div className="space-y-4">
        {reviews.length === 0 && !loading && (
          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
        )}
        {reviews.map((review) => (
          <div key={review._id} className="p-4 border rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold">{review.userId?.firstName || "Anonymous"}</p>
                <RatingStars rating={review.rating} />
              </div>
              <p className="text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
            <p className="text-gray-700">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
