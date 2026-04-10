import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { Route } from '../types';
import { MapPin, School, Clock, Users, Search, Filter, ArrowRight, Baby, Heart, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const BrowseRoutes: React.FC = () => {
  const navigate = useNavigate();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTiming, setFilterTiming] = useState<string>('all');

  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    const q = query(
      collection(db, 'routes'),
      where('miamiOnly', '==', true),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const routesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];
      setRoutes(routesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredRoutes = routes.filter(route => {
    const matchesSearch = (route.school?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                         (route.pickupZone?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesTiming = filterTiming === 'all' || route.timing === filterTiming;
    const matchesStatus = filterStatus === 'all' || route.status?.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesTiming && matchesStatus;
  });

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-omw-blue-dark"></div>
    </div>
  );

  return (
    <div className="space-y-8 pb-20 pt-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="font-display text-3xl font-bold text-omw-black">Browse routes</h1>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-omw-gray" />
            <input
              type="text"
              placeholder="Search school / area...."
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-black/5 bg-white shadow-sm focus:outline-none focus:border-omw-black transition-all font-sans"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {['School', 'Area', 'AM/PM', 'Open', 'Forming', 'Pool'].map((f) => (
              <button
                key={f}
                onClick={() => {
                  if (['AM/PM'].includes(f)) setFilterTiming(filterTiming === 'morning' ? 'afternoon' : 'morning');
                  else if (['Open', 'Forming', 'Pool'].includes(f)) setFilterStatus(f.toLowerCase());
                }}
                className={cn(
                  "px-4 py-2 rounded-full border border-black/5 bg-white text-xs font-bold uppercase tracking-wider transition-all",
                  (f === 'AM/PM' && filterTiming !== 'all') || (f.toLowerCase() === filterStatus)
                    ? "bg-omw-black text-white" 
                    : "text-omw-gray hover:bg-black/5"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {filteredRoutes.map((route) => (
          <motion.div
            key={route.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-omw p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 group"
          >
            <div className="space-y-2">
              <h3 className="font-display text-xl font-bold text-omw-black">{route.school}</h3>
              <p className="text-omw-gray font-sans">{route.pickupZone || route.pickupNeighborhood} → School</p>
              <div className="flex items-center gap-2 text-sm font-medium text-omw-gray">
                <span className={cn(
                  "px-2 py-0.5 rounded-md text-[10px] uppercase font-bold",
                  route.status === 'Open' ? "bg-green-100 text-green-700" : "bg-omw-blue/20 text-omw-blue-dark"
                )}>
                  {route.status}
                </span>
                <span>· {route.interestCount || 0} families</span>
              </div>
              <p className="text-xs text-omw-gray font-sans italic">
                {route.optionsWanted?.length > 0 ? `Wants: ${route.optionsWanted.join(' + ')}` : 'No specific options selected'}
              </p>
            </div>

            <Link
              to={`/route/${route.id}`}
              className="btn-black !py-3 !px-8 text-sm whitespace-nowrap"
            >
              View route
            </Link>
          </motion.div>
        ))}
      </div>

      {filteredRoutes.length === 0 && (
        <div className="text-center py-20 space-y-4">
          <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center text-omw-gray mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold font-sans">No routes found</h3>
          <p className="text-omw-gray">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
};

export default BrowseRoutes;
