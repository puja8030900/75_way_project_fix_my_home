import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Star, Clock, MapPin, Calendar as CalendarIcon, Phone, FileText, ArrowLeft } from 'lucide-react';

const ServiceDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    bookingDate: '',
    timeSlot: '09:00 AM - 11:00 AM',
    address: user?.address || '',
    phone: user?.phone || '',
    problemDescription: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const { data } = await api.get(`/services/${id}`);
        setService(data);
      } catch (error) {
        toast.error('Failed to load service details');
        navigate('/services');
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id, navigate]);

  const handleBookingChange = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const handleBookService = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to book a service');
      navigate(`/login?redirect=/services/${service._id}`);
      return;
    }
    
    setIsSubmitting(true);
    try {
      await api.post('/bookings', {
        serviceId: service._id,
        ...bookingData
      });
      toast.success('Service booked successfully!');
      navigate('/customer/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book service');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!service) return null;

  // Get tomorrow's date for minimum booking date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Back button */}
      <button onClick={() => navigate('/services')} className="inline-flex items-center text-sm text-navy-500 hover:text-navy-700 mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Services
      </button>

      <div className="bg-white rounded-2xl border border-navy-100 overflow-hidden flex flex-col md:flex-row">
        
        {/* Service Info */}
        <div className="md:w-1/2 relative">
          <img src={service.image} alt={service.name} className="w-full h-full object-cover min-h-[300px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-8 text-white">
            <span className="text-xs font-bold text-orange-300 uppercase tracking-wider mb-2">{service.category}</span>
            <h1 className="text-2xl md:text-3xl font-bold mb-3">{service.name}</h1>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-amber-400 mr-1 fill-current" />
                <span className="font-medium">{service.averageRating || 'New'}</span>
              </div>
              <div className="flex items-center text-gray-200">
                <Clock className="h-4 w-4 mr-1" />
                <span>Est. {service.estimatedDuration}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="md:w-1/2 p-6 lg:p-10">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-navy-900 mb-2">Book this Service</h2>
            <p className="text-navy-500 text-sm mb-4">{service.description}</p>
            <div className="text-2xl font-bold text-orange-500">₹{service.price}</div>
          </div>

          {!user ? (
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-6 text-center">
              <h3 className="text-base font-bold text-navy-900 mb-2">Login to book</h3>
              <p className="text-navy-500 text-sm mb-4">Please sign in or register to book this service.</p>
              <div className="flex justify-center space-x-3">
                <Link to={`/login?redirect=/services/${service._id}`} className="btn-primary text-sm">Login</Link>
                <Link to={`/register?redirect=/services/${service._id}`} className="btn-outline text-sm">Register</Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleBookService} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1.5 flex items-center">
                    <CalendarIcon className="h-3.5 w-3.5 mr-1.5 text-navy-400" /> Date
                  </label>
                  <input
                    type="date"
                    name="bookingDate"
                    required
                    min={minDate}
                    className="input-field text-sm"
                    value={bookingData.bookingDate}
                    onChange={handleBookingChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1.5 flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-1.5 text-navy-400" /> Time Slot
                  </label>
                  <select
                    name="timeSlot"
                    className="input-field bg-white text-sm"
                    value={bookingData.timeSlot}
                    onChange={handleBookingChange}
                  >
                    <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                    <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
                    <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                    <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5 flex items-center">
                  <MapPin className="h-3.5 w-3.5 mr-1.5 text-navy-400" /> Service Address
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  className="input-field text-sm"
                  value={bookingData.address}
                  onChange={handleBookingChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5 flex items-center">
                  <Phone className="h-3.5 w-3.5 mr-1.5 text-navy-400" /> Contact Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  className="input-field text-sm"
                  value={bookingData.phone}
                  onChange={handleBookingChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5 flex items-center">
                  <FileText className="h-3.5 w-3.5 mr-1.5 text-navy-400" /> Problem Description (Optional)
                </label>
                <textarea
                  name="problemDescription"
                  rows="3"
                  className="input-field text-sm"
                  placeholder="Describe the issue you're facing..."
                  value={bookingData.problemDescription}
                  onChange={handleBookingChange}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 mt-2"
              >
                {isSubmitting ? 'Processing...' : `Confirm Booking — ₹${service.price}`}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
