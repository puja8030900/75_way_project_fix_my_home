import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Search, Filter, Star, Clock } from 'lucide-react';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [
    'Plumbing', 'Electrical Repairs', 'AC Repair and Servicing', 
    'Home Cleaning', 'Appliance Repair', 'Carpentry', 'Painting', 'Pest Control'
  ];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await api.get('/services');
        setServices(data);
      } catch (error) {
        console.error("Failed to fetch services", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const filteredServices = services.filter(service => {
    return (
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === '' || service.category === selectedCategory)
    );
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 flex justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-navy-900 mb-3">Our Services</h1>
        <p className="text-sm text-navy-500 max-w-lg mx-auto leading-relaxed">
          Browse through our professional home services. Filter by category or search to find exactly what you need.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-grow relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-navy-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search services..."
            className="input-field pl-11 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-56 relative">
          <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-navy-400 h-4 w-4" />
          <select
            className="input-field pl-11 bg-white text-sm"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setSelectedCategory('')}
          className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${
            selectedCategory === '' ? 'bg-orange-500 text-white' : 'bg-white text-navy-600 border border-navy-200 hover:bg-navy-50'
          }`}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat === selectedCategory ? '' : cat)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${
              selectedCategory === cat ? 'bg-orange-500 text-white' : 'bg-white text-navy-600 border border-navy-200 hover:bg-navy-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredServices.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-navy-100">
          <p className="text-navy-500">No services found matching your criteria.</p>
          <button 
            onClick={() => {setSearchTerm(''); setSelectedCategory('');}}
            className="mt-3 text-orange-500 font-medium text-sm hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map(service => (
            <div key={service._id} className="bg-white rounded-2xl border border-navy-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group flex flex-col h-full">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-navy-900 flex items-center shadow-sm">
                  <Star className="h-3.5 w-3.5 text-amber-400 mr-1 fill-current" />
                  {service.averageRating || 'New'}
                </div>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <span className="text-xs font-semibold text-orange-500 uppercase tracking-wider mb-1.5 block">{service.category}</span>
                <h3 className="text-base font-bold text-navy-900 mb-1.5">{service.name}</h3>
                <p className="text-navy-500 text-sm mb-4 line-clamp-2 flex-grow">{service.description}</p>
                
                <div className="flex items-center text-xs text-navy-400 mb-4">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  <span>Est. {service.estimatedDuration}</span>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-navy-100">
                  <span className="text-xl font-bold text-navy-900">₹{service.price}</span>
                  <Link to={`/services/${service._id}`} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-xs font-semibold transition-colors">View & Book</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Services;
