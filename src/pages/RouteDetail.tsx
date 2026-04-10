import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, onSnapshot, collection, query, addDoc, updateDoc } from 'firebase/firestore';
import { Route, RouteInterest, LedgerEntry } from '../types';
import { useAuth } from '../AuthContext';
import { 
  MapPin, 
  School, 
  Clock, 
  Users, 
  CheckCircle2, 
  MessageSquare, 
  DollarSign, 
  History, 
  Baby, 
  Heart, 
  Info, 
  CreditCard, 
  Calendar, 
  Star, 
  Send,
  ChevronRight,
  ShieldCheck,
  Gift,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const RouteDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [route, setRoute] = useState<any | null>(null);
  const [interests, setInterests] = useState<RouteInterest[]>([]);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [interestForm, setInterestForm] = useState({ offerType: '', capacityNote: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;

    const unsubRoute = onSnapshot(doc(db, 'routes', id), (docSnap) => {
      if (docSnap.exists()) {
        setRoute({ id: docSnap.id, ...docSnap.data() } as Route);
      }
      setLoading(false);
    });

    const qInterests = query(collection(db, 'routes', id, 'interests'));
    const unsubInterests = onSnapshot(qInterests, (snapshot) => {
      setInterests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as RouteInterest[]);
    });

    const qLedger = query(collection(db, 'routes', id, 'ledger'));
    const unsubLedger = onSnapshot(qLedger, (snapshot) => {
      setLedger(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as LedgerEntry[]);
    });

    return () => {
      unsubRoute();
      unsubInterests();
      unsubLedger();
    };
  }, [id]);

  const handleInterestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'routes', id, 'interests'), {
        ...interestForm,
        routeId: id,
        userId: user.uid,
        status: 'Pending',
        createdAt: new Date().toISOString()
      });
      setInterestForm({ offerType: '', capacityNote: '' });
    } catch (err) {
      console.error('Error submitting interest:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (newStatus: Route['status']) => {
    if (!id || !route) return;
    try {
      await updateDoc(doc(db, 'routes', id), { status: newStatus });
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-omw-blue-dark"></div>
    </div>
  );

  if (!route) return (
    <div className="min-h-[60vh] flex items-center justify-center text-center px-4">
      <div className="space-y-4">
        <h2 className="text-3xl font-semibold tracking-tighter">Route not found</h2>
        <p className="text-omw-gray font-medium">The route you're looking for doesn't exist or has been removed.</p>
      </div>
    </div>
  );

  const isCreator = user?.uid === route.createdBy;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8 pb-32">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-omw-gray hover:text-omw-black transition-colors font-sans text-sm font-bold uppercase tracking-wider"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Header Section */}
      <header className="space-y-4">
        <div className="space-y-1">
          <h1 className="font-display text-3xl font-bold text-omw-black">
            {route.school}
          </h1>
          <p className="text-xl text-omw-gray font-sans font-medium">
            {route.pickupZone || route.pickupNeighborhood} → School
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className={cn(
            "px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest font-sans",
            route.status === 'Open' ? "bg-green-100 text-green-700" : "bg-omw-blue/20 text-omw-blue-dark"
          )}>
            {route.status}
          </span>
          <span className="text-omw-gray text-xs font-bold uppercase tracking-wider">
            {route.interestCount || 0} families interested
          </span>
        </div>

        {isCreator && (
          <div className="flex flex-wrap gap-2 pt-2">
            {['Open', 'Forming', 'Covered', 'Waitlist', 'Paused'].map(s => (
              <button
                key={s}
                onClick={() => updateStatus(s as any)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all font-sans",
                  route.status === s ? "bg-omw-black text-white" : "bg-black/5 text-omw-gray hover:bg-black/10"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </header>

      <div className="space-y-8">
        {/* Wants Section */}
        <section className="space-y-4">
          <h2 className="font-display text-lg font-bold text-omw-black uppercase tracking-wider">Wants</h2>
          <div className="flex flex-wrap gap-3">
            {route.optionsWanted?.map((option: string) => (
              <div key={option} className="px-4 py-2 rounded-xl bg-omw-blue/10 text-omw-blue-dark font-bold text-xs uppercase tracking-wider border border-omw-blue/20">
                {option}
              </div>
            )) || <p className="text-omw-gray text-sm italic">No specific options selected</p>}
          </div>
        </section>

        {/* The Issue Section */}
        <section className="space-y-4 p-6 rounded-3xl bg-omw-pink/10 border border-omw-pink/20">
          <h2 className="font-display text-lg font-bold text-omw-pink-dark uppercase tracking-wider">The Issue</h2>
          <p className="font-sans text-lg leading-relaxed text-omw-black font-medium italic">
            "{route.currentIssue || route.painPoint || 'Looking for better transportation options for this route.'}"
          </p>
        </section>

        {/* Schedule Section */}
        <section className="space-y-4">
          <h2 className="font-display text-lg font-bold text-omw-black uppercase tracking-wider">Schedule</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-black/5 border border-black/5">
              <span className="text-[10px] font-bold text-omw-gray uppercase tracking-widest block mb-1">Timing</span>
              <p className="text-lg font-bold text-omw-black capitalize">{route.timing}</p>
            </div>
            <div className="p-4 rounded-2xl bg-black/5 border border-black/5">
              <span className="text-[10px] font-bold text-omw-gray uppercase tracking-widest block mb-1">Days</span>
              <div className="flex gap-1">
                {['M', 'T', 'W', 'T', 'F'].map((day, i) => (
                  <span 
                    key={i} 
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold",
                      route.daysNeeded?.includes(day) || route.daysOfWeek?.length > i
                        ? "bg-omw-black text-white" 
                        : "bg-white text-omw-gray border border-black/5"
                    )}
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Requirements Section */}
        {(route.carSeatRequired || route.specialNeeds || route.requirementsNote) && (
          <section className="space-y-4">
            <h2 className="font-display text-lg font-bold text-omw-black uppercase tracking-wider">Requirements</h2>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                {route.carSeatRequired && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-omw-blue text-omw-blue-dark font-bold text-xs uppercase tracking-wider">
                    <Baby className="w-4 h-4" /> Car Seat Required
                  </div>
                )}
                {route.specialNeeds && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-omw-blue text-omw-blue-dark font-bold text-xs uppercase tracking-wider">
                    <Heart className="w-4 h-4" /> Special Needs
                  </div>
                )}
              </div>
              {route.requirementsNote && (
                <div className="p-4 rounded-2xl bg-black/5 border border-black/5">
                  <p className="text-sm text-omw-black font-medium">{route.requirementsNote}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="pt-8 border-t border-black/5">
          {!isCreator && (
            <button 
              onClick={() => {
                const el = document.getElementById('interest-form');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full btn-black !py-5 text-lg"
            >
              Interested?
            </button>
          )}
        </section>

        {/* Interest Form (Existing) */}
        {!isCreator && (
          <section id="interest-form" className="card-omw p-8 space-y-6 scroll-mt-24">
            <div className="space-y-2">
              <h3 className="font-display text-2xl font-bold text-omw-black">Can you help?</h3>
              <p className="font-sans text-sm text-omw-gray">
                Submit your interest to connect with this parent.
              </p>
            </div>

            <form onSubmit={handleInterestSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-omw-gray uppercase tracking-widest">I am a...</label>
                <select
                  required
                  className="w-full bg-black/5 border-none p-4 rounded-2xl text-omw-black font-bold focus:ring-2 focus:ring-omw-blue-dark focus:outline-none appearance-none font-sans"
                  value={interestForm.offerType}
                  onChange={e => setInterestForm({ ...interestForm, offerType: e.target.value })}
                >
                  <option value="">Select type...</option>
                  <option value="Carpool">Parent (Carpool)</option>
                  <option value="Private Bus">Private Bus Operator</option>
                  <option value="Independent Driver">Independent Driver</option>
                  <option value="Public Transit">Transit Guide</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-omw-gray uppercase tracking-widest">Message</label>
                <textarea
                  required
                  placeholder="e.g. I have 2 seats available, vetted driver."
                  className="w-full bg-black/5 border-none p-4 rounded-2xl text-omw-black font-medium focus:ring-2 focus:ring-omw-blue-dark focus:outline-none min-h-[120px] font-sans"
                  value={interestForm.capacityNote}
                  onChange={e => setInterestForm({ ...interestForm, capacityNote: e.target.value })}
                />
              </div>
              <button
                disabled={submitting}
                type="submit"
                className="w-full btn-black"
              >
                {submitting ? 'Sending...' : 'Send Interest'} <Send className="w-4 h-4" />
              </button>
            </form>
          </section>
        )}

        {/* Activity Section (Existing) */}
        <section className="space-y-6">
          <h2 className="font-display text-2xl font-bold text-omw-black flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-omw-blue-dark" />
            Activity ({interests.length})
          </h2>

          <div className="space-y-4">
            {interests.map((interest) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={interest.id} 
                className="card-omw p-6 flex justify-between items-start gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-omw-black font-sans">{interest.offerType}</span>
                    <span className="px-2 py-0.5 bg-omw-blue/20 text-omw-blue-dark text-[10px] font-bold uppercase tracking-widest rounded-full font-sans">
                      {interest.status}
                    </span>
                  </div>
                  <p className="text-omw-gray font-medium text-sm font-sans">{interest.capacityNote}</p>
                </div>
                <span className="text-[10px] font-bold text-omw-gray uppercase tracking-widest whitespace-nowrap font-sans">
                  {new Date(interest.createdAt).toLocaleDateString()}
                </span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Ledger Section (Existing) */}
        {(isCreator || isAdmin) && ledger.length > 0 && (
          <section className="space-y-6">
            <h2 className="font-display text-2xl font-bold text-omw-black flex items-center gap-3">
              <History className="w-6 h-6 text-omw-blue-dark" />
              Trip Ledger
            </h2>
            <div className="card-omw overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-black/5">
                      <th className="px-6 py-4 text-[10px] font-bold text-omw-gray uppercase tracking-widest font-sans">Date</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-omw-gray uppercase tracking-widest font-sans">Mode</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-omw-gray uppercase tracking-widest font-sans">Cost</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-omw-gray uppercase tracking-widest text-right font-sans">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {ledger.map((entry) => (
                      <tr key={entry.id} className="hover:bg-black/[0.02] transition-colors">
                        <td className="px-6 py-4 font-bold text-omw-black font-sans text-sm">{entry.date}</td>
                        <td className="px-6 py-4 text-omw-gray font-medium font-sans text-sm">{entry.mode}</td>
                        <td className="px-6 py-4 font-bold text-omw-black font-sans text-sm">${entry.cost}</td>
                        <td className="px-6 py-4 text-right">
                          {entry.parentConfirmed ? (
                            <span className="inline-flex items-center gap-1 text-green-600 text-[10px] font-bold uppercase tracking-widest font-sans">
                              <CheckCircle2 className="w-3 h-3" /> Confirmed
                            </span>
                          ) : (
                            <span className="text-omw-gray text-[10px] font-bold uppercase tracking-widest font-sans">Pending</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default RouteDetail;
