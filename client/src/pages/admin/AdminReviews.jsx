import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, EyeOff, Trash2 } from 'lucide-react';
import api from '../../services/api';
import { formatDate } from '../../lib/utils';
import { Badge } from '../../components/ui/Badge';

export const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadReviews = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/reviews/admin');
      if (res?.reviews) setReviews(res.reviews);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const toggleModeration = async (reviewId, currentApproved) => {
    try {
      const res = await api.put(`/reviews/${reviewId}/moderation`, {
        isApproved: !currentApproved,
      });
      if (res?.review) {
        setReviews(reviews.map((r) => (r._id === reviewId ? { ...r, isApproved: !currentApproved } : r)));
      }
    } catch (err) {
      alert(`Moderation update failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[11px] uppercase tracking-[0.2em] text-rose-deep font-semibold">
          Customer Voice & Moderation
        </span>
        <h1 className="font-serif text-3xl font-medium text-charcoal-900">
          Client Feedback & Reviews ({reviews.length})
        </h1>
      </div>

      <div className="bg-white rounded-sm border border-charcoal-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-charcoal-100 uppercase tracking-wider text-charcoal-600 text-[10px]">
              <tr>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Rating & Fit</th>
                <th className="py-3 px-4">Comment</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-100 text-charcoal-800">
              {reviews.map((rev) => (
                <tr key={rev._id} className="hover:bg-ivory-50/70">
                  <td className="py-3 px-4">
                    <strong className="text-charcoal-900 block truncate max-w-[160px]">
                      {rev.product?.title || 'Atelier Design'}
                    </strong>
                  </td>

                  <td className="py-3 px-4 font-medium">
                    {rev.authorName}
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex text-amber-500 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-charcoal-200'}`} />
                      ))}
                    </div>
                    <span className="text-[10px] text-charcoal-500 bg-ivory-100 px-1.5 py-0.5 rounded">
                      {rev.fitFeedback}
                    </span>
                  </td>

                  <td className="py-3 px-4 max-w-xs text-charcoal-700 italic">
                    "{rev.comment}"
                  </td>

                  <td className="py-3 px-4 text-charcoal-500">
                    {formatDate(rev.createdAt)}
                  </td>

                  <td className="py-3 px-4">
                    <Badge variant={rev.isApproved ? 'success' : 'alert'}>
                      {rev.isApproved ? 'Published' : 'Hidden'}
                    </Badge>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => toggleModeration(rev._id, rev.isApproved)}
                      className={`px-3 py-1 text-[10px] uppercase font-semibold tracking-wider rounded transition-colors ${
                        rev.isApproved
                          ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      }`}
                    >
                      {rev.isApproved ? 'Hide Review' : 'Approve Review'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
