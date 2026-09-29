import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, User as UserIcon, LogOut, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const dashboardLink = 
    user?.role === 'admin' ? '/admin/dashboard' :
    user?.role === 'provider' ? '/provider/dashboard' :
    '/customer/dashboard';

  const scrollToSection = (id) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: id } });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsOpen(false);
  };

  useEffect(() => {
    if (location.state?.scrollTo) {
      setTimeout(() => {
        const element = document.getElementById(location.state.scrollTo);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' : 'bg-white py-4'} border-b border-navy-100`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="bg-orange-500 p-2 rounded-xl group-hover:bg-orange-600 transition-colors">
                <Home className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-navy-900">Fix<span className="text-orange-500">My</span>Home</span>
            </Link>
            
            <div className="hidden md:flex ml-10 space-x-1">
              <Link to="/" className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${isActive('/') ? 'bg-orange-50 text-orange-600' : 'text-navy-600 hover:text-navy-900 hover:bg-navy-50'}`}>Home</Link>
              <button onClick={() => scrollToSection('about')} className="px-4 py-2 rounded-full text-sm font-medium text-navy-600 hover:text-navy-900 hover:bg-navy-50 transition-colors">About</button>
              <button onClick={() => scrollToSection('features')} className="px-4 py-2 rounded-full text-sm font-medium text-navy-600 hover:text-navy-900 hover:bg-navy-50 transition-colors">Features</button>
              <Link to="/services" className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${isActive('/services') ? 'bg-orange-50 text-orange-600' : 'text-navy-600 hover:text-navy-900 hover:bg-navy-50'}`}>Services</Link>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <>
                <Link to={dashboardLink} className="flex items-center space-x-2 px-4 py-2 rounded-full text-navy-700 hover:bg-navy-50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                    <span className="text-orange-600 font-bold text-sm">{user.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className="font-medium text-sm">Dashboard</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-full text-navy-500 hover:text-red-500 hover:bg-red-50 transition-colors text-sm"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="font-medium">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-5 py-2 rounded-full text-sm font-medium text-navy-700 hover:bg-navy-50 transition-colors">Login</Link>
                <Link to="/register" className="px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 transition-colors shadow-sm">
                  Register
                </Link>
              </>
            )}
          </div>

          <div className="flex md:hidden items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-navy-700 hover:text-navy-900 focus:outline-none p-2 rounded-xl hover:bg-navy-50 transition-colors">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-white px-4 pt-3 pb-6 space-y-1 border-t border-navy-100 mt-3">
          <Link to="/" onClick={() => setIsOpen(false)} className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive('/') ? 'bg-orange-50 text-orange-600' : 'text-navy-700 hover:bg-navy-50'}`}>Home</Link>
          <button onClick={() => scrollToSection('about')} className="block w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-navy-700 hover:bg-navy-50 transition-colors">About</button>
          <button onClick={() => scrollToSection('features')} className="block w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-navy-700 hover:bg-navy-50 transition-colors">Features</button>
          <Link to="/services" onClick={() => setIsOpen(false)} className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive('/services') ? 'bg-orange-50 text-orange-600' : 'text-navy-700 hover:bg-navy-50'}`}>Services</Link>
          
          <div className="h-px bg-navy-100 my-3"></div>
          
          {user ? (
            <>
              <Link to={dashboardLink} onClick={() => setIsOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-medium text-navy-700 hover:bg-navy-50 transition-colors">Dashboard</Link>
              <button onClick={() => { handleLogout(); setIsOpen(false); }} className="block w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
                Logout
              </button>
            </>
          ) : (
            <div className="flex flex-col space-y-2 pt-2">
              <Link to="/login" onClick={() => setIsOpen(false)} className="text-center w-full px-4 py-2.5 rounded-xl text-sm font-medium text-navy-700 bg-navy-50 hover:bg-navy-100 transition-colors">Login</Link>
              <Link to="/register" onClick={() => setIsOpen(false)} className="text-center w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 transition-colors">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
