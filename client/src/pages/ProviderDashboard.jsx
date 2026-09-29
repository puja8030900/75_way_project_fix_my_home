import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Edit2, Save, X, Settings, Trash2, CheckCircle, XCircle, Phone, MapPin, Calendar as CalendarIcon, Clock, User as UserIcon, Briefcase } from 'lucide-react';

const availableSkills = [
  'Plumbing', 'Electrical Repairs', 'AC Repair and Servicing',
  'Home Cleaning', 'Appliance Repair', 'Refrigerator Repair',
  'Mobile Repair', 'Carpentry', 'Painting', 'Pest Control'
];

const ProviderDashboard = () => {
  const { user, setUser } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' or 'profile'

  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    bio: user?.bio || '',
    skills: user?.skills || [],
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data } = await api.get('/bookings/provider/my');
      setJobs(data);
    } catch (error) {
      toast.error('Failed to fetch assigned jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.patch(`/bookings/${id}/status`, { status: newStatus });
      toast.success(`Job status updated to ${newStatus}`);
      fetchJobs();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job record?')) return;
    try {
      await api.delete(`/bookings/${id}`);
      toast.success('Job record deleted');
      fetchJobs();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete job');
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put('/auth/profile', profileData);
      setUser(data);
      toast.success('Profile updated successfully');
      setEditingProfile(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const toggleSkill = (skill) => {
    const currentSkills = profileData.skills;
    if (currentSkills.includes(skill)) {
      setProfileData({ ...profileData, skills: currentSkills.filter(s => s !== skill) });
    } else {
      setProfileData({ ...profileData, skills: [...currentSkills, skill] });
    }
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Completed': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'In Progress': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Accepted': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'Cancelled': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-orange-50 text-orange-600 border-orange-100';
    }
  };

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-2 border-orange-500 border-t-transparent"></div></div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 bg-white p-6 rounded-2xl border border-navy-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-5">
          <div className="w-14 h-14 rounded-2xl bg-navy-100 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-bold text-navy-700">{user.name.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-navy-900">Provider Dashboard</h1>
            <p className="text-navy-500 text-sm">{user.name} • {user.email}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'jobs' ? 'bg-navy-900 text-white' : 'bg-navy-50 text-navy-600 hover:bg-navy-100'}`}
          >
            My Jobs
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center ${activeTab === 'profile' ? 'bg-navy-900 text-white' : 'bg-navy-50 text-navy-600 hover:bg-navy-100'}`}
          >
            <Settings className="w-3.5 h-3.5 mr-1.5" /> Profile
          </button>
        </div>
      </div>

      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-navy-100 p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-navy-900">Professional Profile</h2>
            {!editingProfile ? (
              <button onClick={() => setEditingProfile(true)} className="btn-outline text-xs flex items-center">
                <Edit2 className="w-3.5 h-3.5 mr-1.5" /> Edit
              </button>
            ) : (
              <button onClick={() => {
                setEditingProfile(false);
                setProfileData({ bio: user?.bio || '', skills: user?.skills || [] });
              }} className="text-navy-400 hover:text-navy-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {!editingProfile ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-semibold text-navy-400 uppercase tracking-wider mb-2">About Me</h3>
                <p className="text-navy-700 text-sm bg-navy-50 p-4 rounded-xl border border-navy-100">
                  {user?.bio || "No bio added yet. Tell customers about your experience!"}
                </p>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-navy-400 uppercase tracking-wider mb-3">My Skills</h3>
                {user?.skills && user.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map(skill => (
                      <span key={skill} className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-full font-medium text-xs border border-orange-100">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-navy-400 text-sm italic">No skills selected yet.</p>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5">Professional Bio</label>
                <textarea
                  rows="4"
                  className="input-field bg-white text-sm"
                  placeholder="Describe your experience..."
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-700 mb-3">Your Expertise</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {availableSkills.map(skill => (
                    <label key={skill} className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all text-sm ${profileData.skills.includes(skill) ? 'bg-orange-50 border-orange-200' : 'bg-white border-navy-200 hover:bg-navy-50'}`}>
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-orange-500 focus:ring-orange-400 border-navy-300 rounded mr-3"
                        checked={profileData.skills.includes(skill)}
                        onChange={() => toggleSkill(skill)}
                      />
                      <span className={`font-medium ${profileData.skills.includes(skill) ? 'text-orange-700' : 'text-navy-600'}`}>
                        {skill}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-navy-100">
                <button type="submit" className="btn-primary flex items-center text-sm">
                  <Save className="w-3.5 h-3.5 mr-1.5" /> Save Profile
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {activeTab === 'jobs' && (
        <>
          <h2 className="text-lg font-bold text-navy-900 mb-5 flex items-center">
            <Briefcase className="w-4 h-4 mr-2 text-orange-500" />
            Service Requests & Jobs
          </h2>

          {jobs.length === 0 ? (
            <div className="text-center py-14 bg-white rounded-2xl border border-navy-100">
              <p className="text-navy-500">No job requests matching your skills.</p>
              <p className="text-xs text-navy-400 mt-1">Add your skills under "Profile" to see relevant jobs.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {jobs.map((job) => (
                <div key={job._id} className="bg-white rounded-2xl border border-navy-100 p-5 flex flex-col justify-between hover:shadow-sm transition-shadow">
                  <div>
                    <div className="flex justify-between items-start border-b border-navy-100 pb-4 mb-4">
                      <div>
                        <span className="text-xs font-semibold text-orange-500 uppercase tracking-wider block mb-1">{job.serviceId?.category || 'Home Service'}</span>
                        <h3 className="font-bold text-base text-navy-900">{job.serviceId?.name}</h3>
                        <p className="text-sm font-bold text-orange-500 mt-1">₹{job.price || job.serviceId?.price}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(job.status)}`}>
                        {job.status}
                      </span>
                    </div>

                    <div className="space-y-2.5 mb-5 text-sm text-navy-600">
                      <div className="flex items-start">
                        <UserIcon className="h-3.5 w-3.5 mr-2 text-orange-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-semibold text-navy-900">{job.customerId?.name}</span>
                          {job.customerId?.email && <span className="text-navy-400 block text-xs">{job.customerId?.email}</span>}
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Phone className="h-3.5 w-3.5 mr-2 text-orange-400 flex-shrink-0" />
                        <span>{job.phone || job.customerId?.phone}</span>
                      </div>

                      <div className="flex items-center">
                        <CalendarIcon className="h-3.5 w-3.5 mr-2 text-orange-400 flex-shrink-0" />
                        <span>{new Date(job.bookingDate).toLocaleDateString()} &bull; {job.timeSlot}</span>
                      </div>

                      <div className="flex items-start">
                        <MapPin className="h-3.5 w-3.5 mr-2 text-orange-400 mt-0.5 flex-shrink-0" />
                        <span>{job.address || job.customerId?.address}</span>
                      </div>

                      {job.problemDescription && (
                        <div className="bg-navy-50 p-3 rounded-xl border border-navy-100 mt-2">
                          <span className="font-semibold text-xs text-navy-700 block mb-1">Problem:</span>
                          <p className="text-navy-500 text-xs">{job.problemDescription}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-navy-100">
                    {(job.status === 'Pending' || job.status === 'Assigned') && (
                      <>
                        <button onClick={() => handleStatusUpdate(job._id, 'Accepted')} className="bg-emerald-500 hover:bg-emerald-600 text-white px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors flex items-center">
                          <CheckCircle className="w-3.5 h-3.5 mr-1" /> Accept
                        </button>
                        <button onClick={() => handleStatusUpdate(job._id, 'Cancelled')} className="text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center border border-red-200">
                          <XCircle className="w-3.5 h-3.5 mr-1" /> Decline
                        </button>
                      </>
                    )}
                    {job.status === 'Accepted' && (
                      <>
                        <button onClick={() => handleStatusUpdate(job._id, 'In Progress')} className="bg-blue-500 hover:bg-blue-600 text-white px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors">
                          Start Work
                        </button>
                        <button onClick={() => handleStatusUpdate(job._id, 'Cancelled')} className="text-xs text-red-500 hover:underline px-2 py-1">
                          Cancel
                        </button>
                      </>
                    )}
                    {job.status === 'In Progress' && (
                      <>
                        <button onClick={() => handleStatusUpdate(job._id, 'Completed')} className="bg-emerald-500 hover:bg-emerald-600 text-white px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors">
                          Complete
                        </button>
                        <button onClick={() => handleStatusUpdate(job._id, 'Cancelled')} className="text-xs text-red-500 hover:underline px-2 py-1">
                          Cancel
                        </button>
                      </>
                    )}
                    <button onClick={() => handleDeleteJob(job._id)} className="p-1.5 text-navy-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-auto" title="Delete">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProviderDashboard;
