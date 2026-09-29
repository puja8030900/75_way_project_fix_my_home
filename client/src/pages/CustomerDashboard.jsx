import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Calendar as CalendarIcon, Clock, MapPin, XCircle, Star, MessageSquare, Wrench, ArrowRight } from 'lucide-react';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    fetchBookings();
    fetchServices();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/bookings/my');
      setBookings(data);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const { data } = await api.get('/services');
      setServices(data);
    } catch (error) {
      console.error('Failed to fetch services', error);
    }
  };

  const quickServices = services.filter(s =>
    ['AC Repair and Servicing', 'Refrigerator Repair', 'Mobile Repair'].includes(s.category)
  ).slice(0, 3);

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await api.patch(`/bookings/${id}/cancel`, { cancellationReason: 'Customer requested cancellation' });
      toast.success('Booking cancelled successfully');
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const openReviewModal = (booking) => {
    setSelectedBooking(booking);
    setReviewData({ rating: 5, comment: '' });
    setReviewModalOpen(true);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await api.post('/reviews', {
        serviceId: selectedBooking.serviceId._id,
        bookingId: selectedBooking._id,
        rating: reviewData.rating,
        comment: reviewData.comment
      });
      toast.success('Review submitted successfully!');
      setReviewModalOpen(false);
      fetchBookings(); // Refresh to potentially update state if we track reviewed status
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Completed': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Cancelled': return 'bg-red-50 text-red-600 border-red-100';
      case 'In Progress': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Accepted': return 'bg-purple-50 text-purple-600 border-purple-100';
      default: return 'bg-orange-50 text-orange-600 border-orange-100';
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Welcome Card */}
      <div className="mb-8 bg-white p-6 rounded-2xl border border-navy-100 flex items-center space-x-5">
        <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center flex-shrink-0">
          <span className="text-2xl font-bold text-orange-500">{user.name.charAt(0).toUpperCase()}</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-navy-900">Welcome, {user.name} 👋</h1>
          <p className="text-navy-500 text-sm">{user.email} • {user.phone}</p>
        </div>
      </div>

      {/* Quick Book */}
      {quickServices.length > 0 && (
        <div className="mb-8">
          <h2 className="text-base font-bold text-navy-900 mb-4 flex items-center">
            <Wrench className="w-4 h-4 mr-2 text-orange-500" />
            Quick Book
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickServices.map(service => (
              <Link key={service._id} to={`/services/${service._id}`} className="bg-white p-4 rounded-xl border border-navy-100 hover:border-orange-200 hover:shadow-sm transition-all flex items-center space-x-4 group">
                <div className="w-14 h-14 flex-shrink-0 rounded-xl overflow-hidden">
                  <img src={service.image || "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop"} alt={service.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm text-navy-900 truncate">{service.name}</h3>
                  <p className="text-xs text-navy-400">{service.category}</p>
                  <p className="text-sm font-bold text-orange-500 mt-0.5">₹{service.price}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-navy-300 group-hover:text-orange-500 ml-auto flex-shrink-0 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      )}

      <h2 className="text-lg font-bold text-navy-900 mb-5">My Bookings</h2>

      {bookings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-navy-100">
          <CalendarIcon className="mx-auto h-10 w-10 text-navy-300 mb-3" />
          <p className="text-navy-500 mb-4">You have no bookings yet.</p>
          <Link to="/services" className="btn-primary inline-block text-sm">Browse Services</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-2xl border border-navy-100 p-5 flex flex-col md:flex-row gap-5">
              <div className="md:w-1/5 flex-shrink-0">
                <img src={booking.serviceId?.image} alt={booking.serviceId?.name} className="w-full h-28 object-cover rounded-xl" />
              </div>
              <div className="md:w-4/5 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-base font-bold text-navy-900">{booking.serviceId?.name}</h3>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-navy-500 mb-3">
                    <div className="flex items-center"><CalendarIcon className="h-3.5 w-3.5 mr-1.5 text-orange-400" /> {new Date(booking.bookingDate).toLocaleDateString()}</div>
                    <div className="flex items-center"><Clock className="h-3.5 w-3.5 mr-1.5 text-orange-400" /> {booking.timeSlot}</div>
                    <div className="flex items-center"><MapPin className="h-3.5 w-3.5 mr-1.5 text-orange-400" /> {booking.address}</div>
                    <div className="flex items-center font-bold text-navy-900">₹{booking.price}</div>
                  </div>
                  {booking.providerId && (
                    <div className="bg-navy-50 p-2.5 rounded-lg text-sm text-navy-600">
                      <span className="font-semibold">Provider:</span> {booking.providerId.name} ({booking.providerId.phone})
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-2 mt-3">
                  {(booking.status === 'Pending' || booking.status === 'Confirmed') && (
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      className="flex items-center space-x-1 text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors text-sm"
                    >
                      <XCircle className="h-3.5 w-3.5" /> <span>Cancel</span>
                    </button>
                  )}
                  {booking.status === 'Completed' && (
                    <button
                      onClick={() => openReviewModal(booking)}
                      className="flex items-center space-x-1 text-orange-500 hover:bg-orange-50 px-3 py-1.5 rounded-lg transition-colors text-sm border border-orange-200"
                    >
                      <Star className="h-3.5 w-3.5" /> <span>Review</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-6 border border-navy-100">
            <h3 className="text-lg font-bold text-navy-900 mb-4">Review {selectedBooking?.serviceId?.name}</h3>
            <form onSubmit={submitReview}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-navy-700 mb-1.5">Rating</label>
                <select
                  className="input-field bg-white text-sm"
                  value={reviewData.rating}
                  onChange={(e) => setReviewData({ ...reviewData, rating: Number(e.target.value) })}
                >
                  <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                  <option value="4">⭐⭐⭐⭐ Good</option>
                  <option value="3">⭐⭐⭐ Average</option>
                  <option value="2">⭐⭐ Poor</option>
                  <option value="1">⭐ Terrible</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-navy-700 mb-1.5 flex items-center">
                  <MessageSquare className="h-3.5 w-3.5 mr-1.5" /> Your Review
                </label>
                <textarea
                  required
                  rows="4"
                  className="input-field text-sm"
                  placeholder="Share your experience..."
                  value={reviewData.comment}
                  onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => setReviewModalOpen(false)} className="btn-outline text-sm">Cancel</button>
                <button type="submit" className="btn-primary text-sm">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
