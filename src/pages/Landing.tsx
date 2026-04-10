import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { MapPin, Shield, Clock, Users, ArrowRight, CheckCircle2, Send, Gift } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { cn } from '../lib/utils';

const Landing: React.FC = () => {
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistCounty, setWaitlistCounty] = useState<'West Palm' | 'Broward' | 'Other'>('Broward');
  const [submitting, setSubmitting] = useState(false);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'waitlist'), {
        email: waitlistEmail,
        county: waitlistCounty,
        createdAt: new Date().toISOString()
      });
      setWaitlistEmail('');
      alert('You have been added to the expansion waitlist!');
    } catch (err) {
      console.error('Error joining waitlist:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const featuredRoutes = [
    { id: '1', school: 'South Miami Middle', pickupZone: 'Kendall West', status: 'Forming', families: 4 },
    { id: '2', school: 'Coral Way K-8', pickupZone: 'Shenandoah', status: 'Open', families: 1 },
  ];

  return (
    <div className="pb-20 pt-4 px-4 space-y-12">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto text-center space-y-10 pt-20 pb-16">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-omw-blue/10 text-omw-blue-dark text-[10px] font-bold uppercase tracking-[0.2em] font-sans"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-omw-blue opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-omw-blue"></span>
            </span>
            On My Way: Miami Only
          </motion.div>
          
          <div className="space-y-4">
            <h1 className="text-6xl md:text-9xl font-bold tracking-tighter text-omw-black font-display leading-[0.8] uppercase">
              School Commute <br />
              <span className="text-omw-blue">Solved.</span>
            </h1>
            
            <h2 className="text-xl md:text-3xl font-semibold tracking-tight text-omw-gray font-display">
              Route Sharing Not Ride Sharing
            </h2>
          </div>

          <p className="text-sm md:text-base text-omw-gray font-sans max-w-lg mx-auto leading-relaxed uppercase tracking-wider">
            Public works <span className="text-omw-black font-bold">WORKS</span> when the public works.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 pt-8 max-w-sm mx-auto">
          <Link to="/post" className="btn-blue w-full py-5 text-lg shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
            Post your route
          </Link>
          <Link to="/school-pool" className="btn-pink w-full py-5 text-lg shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
            Start a school pool
          </Link>
          <Link to="/browse" className="btn-black w-full py-5 text-lg shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
            Browse routes
          </Link>
        </div>
      </section>

      {/* Featured Routes */}
      <section className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-omw-black font-display">
              Open routes right now
            </h2>
            <p className="text-sm text-omw-gray font-sans">
              Real-time demand in your neighborhood
            </p>
          </div>
          <Link to="/browse" className="text-sm font-semibold text-omw-blue-dark hover:underline">
            View all
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredRoutes.map((route) => (
            <motion.div
              key={route.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card-omw group cursor-pointer hover:border-omw-blue/30 transition-all"
            >
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="font-bold text-lg text-omw-black font-display group-hover:text-omw-blue transition-colors">
                      {route.school}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-omw-gray font-sans">
                      <MapPin className="w-4 h-4" />
                      <span>{route.pickupZone} → School</span>
                    </div>
                  </div>
                  <div className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    route.status === 'Forming' ? "bg-omw-blue/10 text-omw-blue-dark" : "bg-green-100 text-green-700"
                  )}>
                    {route.status}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-black/5">
                  <div className="flex items-center gap-2 text-sm font-medium text-omw-gray">
                    <Users className="w-4 h-4" />
                    <span>{route.families} families</span>
                  </div>
                  <Link 
                    to={`/route/${route.id}`}
                    className="text-sm font-bold text-omw-black group-hover:translate-x-1 transition-transform flex items-center gap-1"
                  >
                    View route <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Landing;
