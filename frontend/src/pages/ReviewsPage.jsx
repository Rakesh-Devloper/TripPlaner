import React, { useState } from 'react';
import { Star, ThumbsUp, Plus, MapPin, CheckCircle2, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BackButton } from '../components/BackButton';

export const ReviewsPage = () => {
  const { reviews, addReview, likeReview, user } = useApp();
  const [showAddReview, setShowAddReview] = useState(false);
  const [likedReviews, setLikedReviews] = useState({});

  const [destination, setDestination] = useState('Bali, Indonesia');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleToggleLike = (id) => {
    if (!likedReviews[id]) {
      likeReview(id);
      setLikedReviews((prev) => ({ ...prev, [id]: true }));
    }
  };

  const handleCreateReview = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    addReview({
      userName: user.name,
      userAvatar: user.avatar,
      destination,
      rating,
      comment: comment.trim(),
      verifiedStay: true,
    });

    setComment('');
    setShowAddReview(false);
  };

  return (
    <div id="reviews-community-page" className="space-y-6">
      {/* Top Breadcrumb / Back Button Bar */}
      <div className="flex items-center justify-between">
        <BackButton label="Back to Dashboard" fallbackPage="Dashboard" />
        <span className="text-xs font-semibold text-slate-400">Community Reviews</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Community Travel Reviews & Stories
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real feedback from verified travelers who traveled with AI itineraries.
          </p>
        </div>

        <button
          onClick={() => setShowAddReview(true)}
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/25 flex items-center gap-2 transition-all cursor-pointer self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Write a Review</span>
        </button>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white rounded-3xl border border-slate-100/90 shadow-sm p-6 space-y-4 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={rev.userAvatar}
                  alt={rev.userName}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-50"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-sm text-slate-900">{rev.userName}</h4>
                    {rev.verifiedStay && (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.2 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified Traveler
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">{rev.date}</span>
                </div>
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-1 text-amber-500 font-bold text-xs bg-amber-50 px-2.5 py-1 rounded-xl">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{rev.rating}.0</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-blue-600 text-xs font-bold">
              <MapPin className="w-3.5 h-3.5" />
              <span>{rev.destination}</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-normal">{rev.comment}</p>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <button
                onClick={() => handleToggleLike(rev.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  likedReviews[rev.id]
                    ? 'bg-indigo-50 text-indigo-700 shadow-xs'
                    : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-50'
                }`}
              >
                <ThumbsUp className={`w-3.5 h-3.5 ${likedReviews[rev.id] ? 'fill-indigo-600' : ''}`} />
                <span>{likedReviews[rev.id] ? 'Helpful' : 'Helpful'} ({rev.likes})</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Write Review Modal */}
      {showAddReview && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setShowAddReview(false)}
        >
          <div
            className="bg-white rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto my-auto animate-in zoom-in-95 duration-150 relative overscroll-contain"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-extrabold text-slate-900">Write a Travel Review</h3>
              <button
                type="button"
                onClick={() => setShowAddReview(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <form onSubmit={handleCreateReview} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase block mb-1">
                  Destination
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase block mb-1">
                  Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`p-1.5 rounded-lg ${
                        rating >= star ? 'text-amber-500' : 'text-slate-300'
                      }`}
                    >
                      <Star className="w-5 h-5 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase block mb-1">
                  Your Travel Story & Feedback
                </label>
                <textarea
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share highlights, tips for future travelers, and what you loved..."
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddReview(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 rounded-xl shadow-md"
                >
                  Post Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
