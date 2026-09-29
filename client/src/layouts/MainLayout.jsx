import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Toaster } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-navy-50">
      <Navbar />
      <main className="flex-grow pt-20">
        <Outlet />
      </main>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            borderRadius: '12px',
            background: '#1a1816',
            color: '#faf9f7',
            fontSize: '14px',
            fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
          },
        }}
      />
      <footer className="bg-white border-t border-navy-100">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2.5 mb-4">
                <div className="bg-orange-500 p-2 rounded-xl">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                </div>
                <span className="font-bold text-xl text-navy-900">Fix<span className="text-orange-500">My</span>Home</span>
              </div>
              <p className="text-navy-500 text-sm leading-relaxed max-w-sm">
                Your trusted platform for all home repair and maintenance needs. Book verified professionals with just a few clicks.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-navy-900 mb-3 text-sm">Quick Links</h4>
              <ul className="space-y-2 text-sm text-navy-500">
                <li><a href="/services" className="hover:text-orange-500 transition-colors">Services</a></li>
                <li><a href="/register" className="hover:text-orange-500 transition-colors">Register</a></li>
                <li><a href="/login" className="hover:text-orange-500 transition-colors">Login</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-navy-900 mb-3 text-sm">Support</h4>
              <ul className="space-y-2 text-sm text-navy-500">
                <li><span className="hover:text-orange-500 transition-colors cursor-pointer">Help Center</span></li>
                <li><span className="hover:text-orange-500 transition-colors cursor-pointer">Privacy Policy</span></li>
                <li><span className="hover:text-orange-500 transition-colors cursor-pointer">Terms of Service</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-navy-100 mt-8 pt-6 text-center">
            <p className="text-sm text-navy-400">&copy; {new Date().getFullYear()} FixMyHome. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
