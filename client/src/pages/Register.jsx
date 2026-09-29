import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Home, ShieldCheck, ArrowLeft, RefreshCw } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    role: 'customer'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOTPScreen, setShowOTPScreen] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { register } = useAuth();
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data } = await api.post('/auth/register', formData);
      toast.success(data.message || 'OTP sent to your email!');
      setRegisteredEmail(data.email || formData.email);
      setShowOTPScreen(true);
      setCountdown(60);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle OTP input
  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      // Handle paste
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newOtp = [...otp];
      digits.forEach((digit, i) => {
        if (index + i < 6) newOtp[index + i] = digit;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP');
      return;
    }

    setIsVerifying(true);
    try {
      const { data } = await api.post('/auth/verify-otp', {
        email: registeredEmail,
        otp: otpCode,
      });
      toast.success(data.message || 'Email verified successfully!');
      navigate('/login?verified=true');
    } catch (error) {
      toast.error(error.response?.data?.message || 'OTP verification failed');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    setIsResending(true);
    try {
      const { data } = await api.post('/auth/resend-otp', { email: registeredEmail });
      toast.success(data.message || 'New OTP sent!');
      setCountdown(60);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setIsResending(false);
    }
  };

  // OTP Verification Screen
  if (showOTPScreen) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-navy-50">
        <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-navy-100">
          <div className="text-center">
            <div className="mx-auto w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mb-4">
              <ShieldCheck className="h-7 w-7 text-orange-500" />
            </div>
            <h2 className="text-2xl font-bold text-navy-900">Verify your email</h2>
            <p className="mt-2 text-sm text-navy-500">
              We've sent a 6-digit code to
            </p>
            <p className="text-sm font-semibold text-orange-500">{registeredEmail}</p>
          </div>

          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-3 text-center">Enter OTP Code</label>
              <div className="flex justify-center gap-2.5">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength="6"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onFocus={(e) => e.target.select()}
                    className="w-11 h-12 text-center text-lg font-bold border-2 border-navy-200 rounded-xl focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all bg-navy-50 focus:bg-white text-navy-900"
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isVerifying || otp.join('').length !== 6}
              className="w-full flex justify-center py-3 px-4 rounded-xl text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400 disabled:opacity-50 transition-colors"
            >
              {isVerifying ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>

          <div className="text-center space-y-2">
            <p className="text-xs text-navy-400">Didn't receive the code?</p>
            <button
              onClick={handleResendOTP}
              disabled={countdown > 0 || isResending}
              className="inline-flex items-center text-sm font-medium text-orange-500 hover:text-orange-600 disabled:text-navy-400 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isResending ? 'animate-spin' : ''}`} />
              {countdown > 0 ? `Resend in ${countdown}s` : isResending ? 'Sending...' : 'Resend OTP'}
            </button>
          </div>

          <div className="text-center pt-3 border-t border-navy-100">
            <button
              onClick={() => { setShowOTPScreen(false); setOtp(['', '', '', '', '', '']); }}
              className="inline-flex items-center text-sm text-navy-500 hover:text-navy-700 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back to Registration
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Registration Form
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-navy-50">
      <div className="max-w-lg w-full space-y-6 bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-navy-100">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
            <Home className="h-6 w-6 text-orange-500" />
          </div>
          <h2 className="text-2xl font-bold text-navy-900">Create an account</h2>
          <p className="mt-1.5 text-sm text-navy-500">
            Join FixMyHome today
          </p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Full Name</label>
              <input
                type="text"
                name="name"
                required
                className="input-field"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Email Address</label>
              <input
                type="email"
                name="email"
                required
                className="input-field"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Password</label>
              <input
                type="password"
                name="password"
                required
                minLength="6"
                className="input-field"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Phone Number</label>
              <input
                type="tel"
                name="phone"
                required
                className="input-field"
                placeholder="123-456-7890"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Register As</label>
              <select
                name="role"
                className="input-field bg-white"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="customer">Customer</option>
                <option value="provider">Service Provider</option>
              </select>
            </div>
            {formData.role === 'customer' && (
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5">Home Address</label>
                <textarea
                  name="address"
                  required
                  rows="3"
                  className="input-field"
                  placeholder="123 Main St, Apt 4B, City, State"
                  value={formData.address}
                  onChange={handleChange}
                ></textarea>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 rounded-xl text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </button>
          </div>
        </form>
        <div className="text-center">
          <p className="text-sm text-navy-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-orange-500 hover:text-orange-600">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
