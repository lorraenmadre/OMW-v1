import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { auth } from '../firebase';
import { MapPin, Plus, LayoutDashboard, User, LogOut, Menu, X, Users } from 'lucide-react';
import { cn } from '../lib/utils';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleSignOut = async () => {
    await auth.signOut();
    navigate('/');
  };

  const navItems = [
    { name: 'Post your route', path: '/post', color: 'text-omw-blue-dark hover:bg-omw-blue/50', activeColor: 'bg-omw-blue text-omw-blue-dark' },
    { name: 'Start a school pool', path: '/school-pool', color: 'text-omw-pink-dark hover:bg-omw-pink/50', activeColor: 'bg-omw-pink text-omw-pink-dark' },
    { name: 'Browse routes', path: '/browse', color: 'text-omw-black hover:bg-black/5', activeColor: 'bg-omw-black text-white' },
  ];

  return (
    <div className="min-h-screen bg-omw-bg text-omw-black font-sans pb-20 md:pb-0">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex flex-col">
              <span className="text-xl font-bold tracking-tighter text-omw-black font-sans leading-none">OMW</span>
              <span className="text-[10px] font-medium text-omw-gray uppercase tracking-widest">Miami</span>
            </Link>

            <div className="flex items-center gap-4">
              {isAdmin && (
                <Link to="/admin" className="p-2 text-omw-gray hover:text-omw-black transition-colors">
                  <LayoutDashboard className="w-5 h-5" />
                </Link>
              )}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-omw-black"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Bottom Nav for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-black/5 z-50 md:hidden">
        <div className="grid grid-cols-4 h-16">
          {[
            { name: 'Home', path: '/', icon: MapPin },
            { name: 'Routes', path: '/browse', icon: Plus },
            { name: 'Pool', path: '/school-pool', icon: Users },
            { name: 'Ledger', path: '/ledger', icon: LayoutDashboard },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-colors",
                location.pathname === item.path ? "text-omw-blue-dark" : "text-omw-gray"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto">
        {children}
      </main>

      <footer className="bg-omw-black text-white/50 py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-omw-black font-semibold text-sm font-sans">
                O
              </div>
              <span className="text-xl font-semibold tracking-tighter text-white font-sans">OMW</span>
            </div>
            
            <div className="flex gap-8 text-sm font-medium font-sans">
              <Link to="/browse" className="hover:text-white transition-colors">Browse</Link>
              <Link to="/post" className="hover:text-white transition-colors">Post</Link>
              <Link to="/school-pool" className="hover:text-white transition-colors">Schools</Link>
            </div>
            
            <div className="text-center md:text-right space-y-2">
              <p className="font-sans text-xs italic font-normal">“Public Works WORKS when the Public works.”</p>
              <p className="font-sans text-[10px] uppercase tracking-[0.18em] opacity-30 font-medium">© 2026 OMW Miami. Civic Elegance.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
