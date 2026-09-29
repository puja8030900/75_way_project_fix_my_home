import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isVerified, setIsVerified] = useState(false);

  // If user is already logged in, redirect them to appropriate page
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (user.role === 'provider') {
        navigate('/provider/dashboard', { replace: true });
      } else {
        const params = new URLSearchParams(location.search);
        const redirect = params.get('redirect') || location.state?.from;
        if (redirect) {
          navigate(redirect, { replace: true });
        } else {
          navigate('/customer/dashboard', { replace: true });
        }
      }
    }
  }, [user, navigate, location]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('verified') === 'true') {
      setIsVerified(true);
      toast.success('Email verified successfully! You can now log in.');
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const userData = await login(email, password);
    setIsSubmitting(false);

    if (userData) {
      if (userData.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (userData.role === 'provider') {
        navigate('/provider/dashboard');
      } else {
        const params = new URLSearchParams(location.search);
        const redirect = params.get('redirect') || location.state?.from;
        if (redirect) {
          navigate(redirect);
        } else {
          navigate('/customer/dashboard');
        }
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-navy-50">
      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-navy-100">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
            <Home className="h-6 w-6 text-orange-500" />
          </div>
          <h2 className="text-2xl font-bold text-navy-900">Welcome back</h2>
          <p className="mt-1.5 text-sm text-navy-500">
            Sign in to manage your bookings
          </p>
        </div>

        {isVerified && (
          <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl flex items-center border border-emerald-100">
            <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span className="text-sm font-medium">Your email has been successfully verified!</span>
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Email Address</label>
              <input
                type="email"
                required
                className="input-field"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Password</label>
              <input
                type="password"
                required
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 rounded-xl text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
        <div className="text-center">
          <p className="text-sm text-navy-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-orange-500 hover:text-orange-600">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
