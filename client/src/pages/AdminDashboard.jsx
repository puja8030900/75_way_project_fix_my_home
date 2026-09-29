import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Users, Wrench, CalendarCheck, DollarSign, LayoutDashboard, Plus, Edit2, Trash2, X, LogOut } from 'lucide-react';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [providers, setProviders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Service Form State
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
    category: 'Plumbing',
    price: '',
    estimatedDuration: '',
    image: ''
  });

  const categories = [
    'Plumbing', 'Electrical Repairs', 'AC Repair and Servicing', 
    'Home Cleaning', 'Appliance Repair', 'Refrigerator Repair', 
    'Mobile Repair', 'Carpentry', 'Painting', 'Pest Control'
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, bookingsRes, providersRes, servicesRes, customersRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/bookings'),
        api.get('/admin/providers'),
        api.get('/services'),
        api.get('/admin/users')
      ]);
      setStats(statsRes.data);
      setBookings(bookingsRes.data);
      setProviders(providersRes.data);
      setServices(servicesRes.data);
      setCustomers(customersRes.data);
    } catch (error) {
      toast.error('Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignProvider = async (bookingId, providerId) => {
    if (!providerId) return;
    try {
      await api.patch(`/bookings/${bookingId}/assign`, { providerId });
      toast.success('Provider assigned successfully');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to assign provider');
    }
  };

  const handleOpenServiceModal = (service = null) => {
    if (service) {
      setEditingService(service._id);
      setServiceForm({
        name: service.name,
        description: service.description,
        category: service.category,
        price: service.price,
        estimatedDuration: service.estimatedDuration,
        image: service.image
      });
    } else {
      setEditingService(null);
      setServiceForm({
        name: '', description: '', category: 'Plumbing', price: '', estimatedDuration: '', image: ''
      });
    }
    setIsServiceModalOpen(true);
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        await api.put(`/services/${editingService}`, serviceForm);
        toast.success('Service updated successfully');
      } else {
        await api.post('/services', serviceForm);
        toast.success('Service added successfully');
      }
      setIsServiceModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save service');
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await api.delete(`/services/${id}`);
      toast.success('Service deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete service');
    }
  };

  const handleDeleteUser = async (id, role) => {
    if (!window.confirm(`Are you sure you want to delete this ${role}?`)) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success(`${role} deleted successfully`);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading || !stats) {
    return <div className="flex h-screen w-full items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div></div>;
  }

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-navy-900 text-white flex flex-col shadow-xl z-10 flex-shrink-0">
        <div className="p-6 border-b border-navy-800 flex items-center space-x-3">
          <div className="bg-orange-600 p-2 rounded-lg">
            <Wrench className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">FixMyHome CRM</span>
        </div>
        
        <div className="px-6 py-4">
          <p className="text-xs text-navy-300 font-medium uppercase tracking-wider mb-2">Main Menu</p>
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab('dashboard')} 
              className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-colors font-medium text-sm ${activeTab === 'dashboard' ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-navy-800 hover:text-white'}`}
            >
              <LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard Overview
            </button>
            <button 
              onClick={() => setActiveTab('users')} 
              className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-colors font-medium text-sm ${activeTab === 'users' ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-navy-800 hover:text-white'}`}
            >
              <Users className="w-5 h-5 mr-3" /> User Management
            </button>
            <button 
              onClick={() => setActiveTab('services')} 
              className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-colors font-medium text-sm ${activeTab === 'services' ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-navy-800 hover:text-white'}`}
            >
              <Wrench className="w-5 h-5 mr-3" /> Manage Services
            </button>
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-navy-800">
          <div className="bg-navy-800 rounded-xl p-4 mb-4">
            <p className="text-sm font-medium text-white">Logged in as Admin</p>
            <p className="text-xs text-navy-300 truncate">adminfixmyhome@gmail.com</p>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2 text-gray-300 hover:bg-red-500 hover:text-white rounded-lg transition-colors font-medium text-sm border border-navy-700 hover:border-red-500"
          >
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        
        {activeTab === 'dashboard' && (
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-navy-900 mb-8">Dashboard Overview</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
              <div className="bg-blue-100 p-4 rounded-full mr-4"><Users className="h-6 w-6 text-blue-600" /></div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Customers</p>
                <h3 className="text-2xl font-bold text-navy-900">{stats.totalCustomers}</h3>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
              <div className="bg-purple-100 p-4 rounded-full mr-4"><Wrench className="h-6 w-6 text-purple-600" /></div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Service Providers</p>
                <h3 className="text-2xl font-bold text-navy-900">{stats.totalProviders}</h3>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
              <div className="bg-orange-100 p-4 rounded-full mr-4"><CalendarCheck className="h-6 w-6 text-orange-600" /></div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Bookings</p>
                <h3 className="text-2xl font-bold text-navy-900">{stats.totalBookings}</h3>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
              <div className="bg-green-100 p-4 rounded-full mr-4"><DollarSign className="h-6 w-6 text-green-600" /></div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
                <h3 className="text-2xl font-bold text-navy-900">₹{stats.revenue}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-navy-900">Recent Bookings Management</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-sm">
                    <th className="px-6 py-4 font-medium">Service</th>
                    <th className="px-6 py-4 font-medium">Customer</th>
                    <th className="px-6 py-4 font-medium">Date & Time</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Assign Provider</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {bookings.slice(0, 10).map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-navy-900">{booking.serviceId?.name}</td>
                      <td className="px-6 py-4">
                        <div>{booking.customerId?.name}</div>
                        <div className="text-xs text-gray-500">{booking.customerId?.email}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <div>{new Date(booking.bookingDate).toLocaleDateString()}</div>
                        <div className="text-xs">{booking.timeSlot}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          booking.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                          booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {['Pending', 'Confirmed', 'Assigned'].includes(booking.status) ? (
                          <select 
                            className="input-field text-sm py-1 px-2 bg-white min-w-[150px]"
                            value={booking.providerId?._id || ''}
                            onChange={(e) => handleAssignProvider(booking._id, e.target.value)}
                            disabled={booking.status !== 'Pending' && booking.status !== 'Confirmed' && booking.status !== 'Assigned'}
                          >
                            <option value="">Select Provider</option>
                            {providers.map(p => (
                              <option key={p._id} value={p._id}>{p.name}</option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-gray-500">{booking.providerId?.name || 'N/A'}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h2 className="text-xl font-bold text-navy-900">Service Providers</h2>
              <span className="bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full">{providers.length} Total</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                    <th className="px-6 py-4 font-medium">Name</th>
                    <th className="px-6 py-4 font-medium">Contact</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {providers.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-navy-900">{p.name}</td>
                      <td className="px-6 py-4">
                        <div>{p.email}</div>
                        <div className="text-gray-500">{p.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        {p.isVerified ? 
                          <span className="text-green-600 font-medium">Verified</span> : 
                          <span className="text-yellow-600 font-medium">Unverified</span>}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleDeleteUser(p._id, 'provider')} className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h2 className="text-xl font-bold text-navy-900">Customers</h2>
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">{customers.length} Total</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                    <th className="px-6 py-4 font-medium">Name</th>
                    <th className="px-6 py-4 font-medium">Contact</th>
                    <th className="px-6 py-4 font-medium">Address</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {customers.map((c) => (
                    <tr key={c._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-navy-900">{c.name}</td>
                      <td className="px-6 py-4">
                        <div>{c.email}</div>
                        <div className="text-gray-500">{c.phone}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 max-w-xs truncate">{c.address || 'N/A'}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleDeleteUser(c._id, 'customer')} className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'services' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-navy-900">Manage Services</h2>
            <button onClick={() => handleOpenServiceModal()} className="btn-primary flex items-center text-sm px-4 py-2">
              <Plus className="w-4 h-4 mr-2" /> Add Service
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(service => (
              <div key={service._id} className="border border-gray-200 rounded-lg overflow-hidden group hover:shadow-md transition">
                <img src={service.image} alt={service.name} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-navy-900">{service.name}</h3>
                    <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2 py-1 rounded">₹{service.price}</span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium mb-3">{service.category} • {service.estimatedDuration}</p>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">{service.description}</p>
                  
                  <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100">
                    <button onClick={() => handleOpenServiceModal(service)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteService(service._id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Service Modal */}
          {isServiceModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">{editingService ? 'Edit Service' : 'Add New Service'}</h3>
                  <button onClick={() => setIsServiceModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <form onSubmit={handleSaveService} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                      <input type="text" required className="input-field" value={serviceForm.name} onChange={(e) => setServiceForm({...serviceForm, name: e.target.value})} placeholder="e.g. Premium AC Repair" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select required className="input-field bg-white" value={serviceForm.category} onChange={(e) => setServiceForm({...serviceForm, category: e.target.value})}>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Base Price (₹)</label>
                      <input type="number" required min="0" className="input-field" value={serviceForm.price} onChange={(e) => setServiceForm({...serviceForm, price: e.target.value})} placeholder="e.g. 50" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Duration</label>
                      <input type="text" required className="input-field" value={serviceForm.estimatedDuration} onChange={(e) => setServiceForm({...serviceForm, estimatedDuration: e.target.value})} placeholder="e.g. 2 hours" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                    <input type="url" required className="input-field" value={serviceForm.image} onChange={(e) => setServiceForm({...serviceForm, image: e.target.value})} placeholder="https://example.com/image.jpg" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea required rows="4" className="input-field" value={serviceForm.description} onChange={(e) => setServiceForm({...serviceForm, description: e.target.value})} placeholder="Describe what the service includes..."></textarea>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                    <button type="button" onClick={() => setIsServiceModalOpen(false)} className="btn-outline">Cancel</button>
                    <button type="submit" className="btn-primary">{editingService ? 'Update Service' : 'Add Service'}</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  </div>
);
};

export default AdminDashboard;
