import { Link } from 'react-router-dom';
import { Search, CheckCircle, Star, Shield, Clock, Award, Users, ArrowRight, Zap, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../utils/api';

const Home = () => {
  const [popularServices, setPopularServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await api.get('/services');
        setPopularServices(data.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch services", error);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative bg-white min-h-[85vh] flex items-center justify-center overflow-hidden pt-8">
        {/* Warm gradient blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-orange-100 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute bottom-0 -left-20 w-[400px] h-[400px] bg-amber-50 rounded-full blur-3xl opacity-70"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-50 rounded-full blur-3xl opacity-40"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center space-x-2 bg-orange-50 px-4 py-2 rounded-full mb-8 border border-orange-100">
            <Heart className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span className="text-sm font-medium text-orange-700">Trusted by 50,000+ homeowners</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight text-navy-900">
            Home repairs made
            <br />
            <span className="text-orange-500">simple & reliable</span>
          </h1>
          
          <p className="text-lg md:text-xl text-navy-500 mb-10 max-w-2xl leading-relaxed">
            Book trusted, verified professionals for all your home needs. From plumbing to painting — get it done right, every time.
          </p>
          
          {/* Search Bar */}
          <div className="w-full max-w-xl bg-white p-2 rounded-2xl flex flex-col sm:flex-row items-center shadow-lg border border-navy-100">
            <div className="flex w-full items-center pl-4">
              <Search className="text-navy-400 h-5 w-5 flex-shrink-0" />
              <input 
                type="text" 
                placeholder="What service do you need?" 
                className="w-full p-3 bg-transparent text-navy-900 placeholder-navy-400 outline-none text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Link to="/services" className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-xl whitespace-nowrap text-sm font-semibold flex items-center justify-center transition-colors">
              Find Services
            </Link>
          </div>
          
          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 text-center">
            {[
              { value: '50k+', label: 'Happy Customers' },
              { value: '4.9/5', label: 'Average Rating' },
              { value: '10k+', label: 'Verified Pros' },
              { value: '100%', label: 'Satisfaction' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/80 backdrop-blur-sm px-6 py-4 rounded-2xl border border-navy-100">
                <h4 className="text-2xl font-bold text-navy-900 mb-1">{stat.value}</h4>
                <p className="text-navy-500 text-xs font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-navy-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <span className="text-orange-500 font-semibold text-sm mb-2 block">Why FixMyHome?</span>
            <h3 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4">Built for your convenience</h3>
            <p className="text-navy-500 leading-relaxed">We take the hassle out of home maintenance so you can focus on what matters.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Zap, color: 'orange', title: 'Lightning Fast', desc: 'Book a service in under 60 seconds. Our smart system finds the perfect professional for your needs.' },
              { icon: Shield, color: 'blue', title: 'Secure & Verified', desc: 'Every professional is background-checked. Your safety and home security are our top priorities.' },
              { icon: Award, color: 'emerald', title: 'Quality Assured', desc: 'Backed by our FixIt Guarantee — if the job isn\'t done right, we\'ll fix it at no extra cost.' },
            ].map((feature) => (
              <div key={feature.title} className="bg-white p-8 rounded-2xl border border-navy-100 hover:-translate-y-1 transition-all duration-200 group">
                <div className={`w-12 h-12 rounded-xl bg-${feature.color}-50 text-${feature.color}-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-bold text-navy-900 mb-2">{feature.title}</h4>
                <p className="text-navy-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 relative">
              <div className="absolute inset-0 bg-orange-100 rounded-3xl transform -rotate-2 scale-105 -z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="About FixMyHome" 
                className="rounded-3xl shadow-lg object-cover h-[450px] w-full"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-5 rounded-2xl shadow-lg border border-navy-100 hidden md:flex items-center space-x-3">
                <div className="bg-orange-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-xl font-bold text-navy-900">10k+</p>
                  <p className="text-navy-500 text-sm font-medium">Trusted Pros</p>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2">
              <span className="text-orange-500 font-semibold text-sm mb-2 block">About Us</span>
              <h3 className="text-3xl md:text-4xl font-bold text-navy-900 mb-5 leading-tight">
                Home care, simplified
              </h3>
              <p className="text-navy-500 text-sm mb-4 leading-relaxed">
                Founded in 2023, FixMyHome was born from a simple frustration: finding reliable, skilled professionals was too hard. We created a seamless platform connecting homeowners with top-tier providers.
              </p>
              <p className="text-navy-500 text-sm mb-6 leading-relaxed">
                Today, we're the leading destination for all home service needs — from leaky faucets to complete renovations, done with precision and care.
              </p>
              <ul className="space-y-3 mb-8">
                {['Transparent Upfront Pricing', 'Fully Insured Professionals', '24/7 Customer Support'].map(item => (
                  <li key={item} className="flex items-center text-navy-800 text-sm font-medium">
                    <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center mr-3 flex-shrink-0">
                      <CheckCircle className="h-3.5 w-3.5 text-orange-500" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/register" className="btn-primary inline-flex items-center">
                Join Our Community <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-20 px-4 bg-navy-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10">
            <div className="max-w-xl">
              <span className="text-orange-500 font-semibold text-sm mb-2 block">Top Rated</span>
              <h3 className="text-3xl font-bold text-navy-900 mb-2">Popular Services</h3>
              <p className="text-navy-500 text-sm">Our most requested services, ready to book in a few clicks.</p>
            </div>
            <Link to="/services" className="hidden md:flex items-center text-orange-500 font-semibold text-sm hover:text-orange-600 transition-colors group mt-4 md:mt-0">
              View All <ArrowRight className="ml-1.5 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularServices.map((service) => (
              <Link key={service._id} to={`/services/${service._id}`} className="bg-white rounded-2xl border border-navy-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group block">
                <div className="relative h-48 overflow-hidden">
                  <img src={service.image} alt={service.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-navy-900 flex items-center shadow-sm">
                    <Star className="h-3.5 w-3.5 text-amber-400 mr-1 fill-current" />
                    {service.averageRating || 'New'}
                  </div>
                </div>
                <div className="p-5">
                  <span className="text-xs font-semibold text-orange-500 uppercase tracking-wider mb-1.5 block">{service.category}</span>
                  <h3 className="text-base font-bold text-navy-900 mb-3 truncate">{service.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-navy-900">₹{service.price}</span>
                    <span className="text-orange-500 bg-orange-50 group-hover:bg-orange-500 group-hover:text-white px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors duration-200">
                      Book Now
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link to="/services" className="btn-outline inline-flex items-center justify-center w-full">
              View All Services <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-orange-500 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-orange-400 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-orange-600 rounded-full blur-3xl opacity-50"></div>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to fix your home?</h2>
          <p className="text-lg text-orange-100 mb-8 max-w-xl mx-auto">Join thousands of satisfied homeowners who trust FixMyHome for all their maintenance needs.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register" className="bg-white text-orange-600 hover:bg-orange-50 px-6 py-3 rounded-full font-semibold transition-colors shadow-sm text-sm">Get Started Today</Link>
            <Link to="/services" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-full font-semibold transition-colors border border-orange-400 text-sm">
              Browse Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
