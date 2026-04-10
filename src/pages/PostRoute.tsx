import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../AuthContext';
import { 
  MapPin, 
  School, 
  Clock, 
  Info, 
  Baby, 
  Heart, 
  ArrowLeft, 
  ArrowRight,
  Shield,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const PostRoute: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    school: '',
    pickupZone: '',
    timing: 'morning' as 'morning' | 'afternoon' | 'both',
    daysNeeded: ['M', 'T', 'W', 'T', 'F'],
    currentIssue: '',
    optionsWanted: [] as string[],
    carSeatRequired: false,
    specialNeeds: false,
    requirementsNote: ''
  });

  const nextStep = () => setStep(s => Math.min(s + 1, 6));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    if (!user) return;
    setSubmitting(true);
    try {
      const docRef = await addDoc(collection(db, 'routes'), {
        ...formData,
        status: 'Open',
        visibility: 'Public',
        createdBy: user.uid,
        createdAt: new Date().toISOString(),
        miamiOnly: true,
        interestCount: 0
      });
      navigate(`/route/${docRef.id}`);
    } catch (err) {
      console.error('Error posting route:', err);
      setSubmitting(false);
    }
  };

  const issues = [
    "Traffic is too heavy",
    "Carpool line is too long",
    "Bus was cancelled",
    "Need a more reliable driver",
    "Other"
  ];

  const options = [
    "Carpool",
    "Private Bus",
    "Independent Driver",
    "Public Transit"
  ];

  const nearbySchools = [
    "South Miami Middle",
    "Coral Way K-8",
    "Downtown Doral Charter"
  ];

  const days = ['M', 'T', 'W', 'T', 'F'];

  const toggleDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      daysNeeded: prev.daysNeeded.includes(day)
        ? prev.daysNeeded.filter(d => d !== day)
        : [...prev.daysNeeded, day]
    }));
  };

  const toggleOption = (option: string) => {
    setFormData(prev => ({
      ...prev,
      optionsWanted: prev.optionsWanted.includes(option)
        ? prev.optionsWanted.filter(o => o !== option)
        : [...prev.optionsWanted, option]
    }));
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <AnimatePresence mode="wait">
          {step < 6 ? (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-4">
                <div className="h-1 flex-1 bg-black/5 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-omw-blue-dark"
                    initial={{ width: 0 }}
                    animate={{ width: `${(step / 6) * 100}%` }}
                  />
                </div>
                <span className="label-omw !text-[10px]">
                  {step}/6
                </span>
              </div>

              <div className="space-y-6">
                {step === 1 && (
                  <div className="space-y-6">
                    <h1 className="font-display text-3xl font-bold text-omw-black">What school is this for?</h1>
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search school..."
                      className="w-full p-4 rounded-2xl border border-black/10 focus:border-omw-blue-dark focus:outline-none font-sans bg-white"
                      value={formData.school}
                      onChange={e => setFormData({ ...formData, school: e.target.value })}
                    />
                    <div className="space-y-3">
                      <p className="label-omw !text-[10px]">Nearby schools</p>
                      {nearbySchools.map(school => (
                        <button
                          key={school}
                          onClick={() => setFormData({ ...formData, school })}
                          className={cn(
                            "w-full text-left p-4 rounded-2xl border transition-all font-sans text-sm",
                            formData.school === school ? "border-omw-blue-dark bg-omw-blue/10" : "border-black/5 bg-white hover:bg-black/5"
                          )}
                        >
                          ○ {school}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <h1 className="font-display text-3xl font-bold text-omw-black">Where are you coming from?</h1>
                    <input
                      autoFocus
                      type="text"
                      placeholder="Neighborhood / zone..."
                      className="w-full p-4 rounded-2xl border border-black/10 focus:border-omw-blue-dark focus:outline-none font-sans bg-white"
                      value={formData.pickupZone}
                      onChange={e => setFormData({ ...formData, pickupZone: e.target.value })}
                    />
                    <p className="text-sm text-omw-gray font-sans italic">Optional exact pickup later</p>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h1 className="font-display text-3xl font-bold text-omw-black">When do you need help?</h1>
                      <div className="flex gap-2">
                        {['Morning', 'Afternoon', 'Both'].map(t => (
                          <button
                            key={t}
                            onClick={() => setFormData({ ...formData, timing: t.toLowerCase() as any })}
                            className={cn(
                              "flex-1 py-3 rounded-full border-2 font-sans font-bold text-sm transition-all",
                              formData.timing === t.toLowerCase() ? "border-omw-blue-dark bg-omw-blue text-omw-blue-dark" : "border-black/5 bg-white text-omw-gray"
                            )}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <p className="label-omw !text-[10px]">Days needed</p>
                      <div className="flex gap-2">
                        {days.map((day, i) => (
                          <button
                            key={i}
                            onClick={() => toggleDay(day)}
                            className={cn(
                              "w-10 h-10 rounded-xl border-2 flex items-center justify-center font-bold text-sm transition-all",
                              formData.daysNeeded.includes(day) ? "border-omw-blue-dark bg-omw-blue text-omw-blue-dark" : "border-black/5 bg-white text-omw-gray"
                            )}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-6">
                    <h1 className="font-display text-3xl font-bold text-omw-black">What is the current issue?</h1>
                    <div className="space-y-3">
                      {issues.map(issue => (
                        <button
                          key={issue}
                          onClick={() => setFormData({ ...formData, currentIssue: issue })}
                          className={cn(
                            "w-full text-left p-4 rounded-2xl border transition-all font-sans text-sm",
                            formData.currentIssue === issue ? "border-omw-blue-dark bg-omw-blue/10" : "border-black/5 bg-white hover:bg-black/5"
                          )}
                        >
                          ○ {issue}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h1 className="font-display text-3xl font-bold text-omw-black">What options are you open to?</h1>
                      <div className="space-y-3">
                        {options.map(option => (
                          <button
                            key={option}
                            onClick={() => toggleOption(option)}
                            className={cn(
                              "w-full text-left p-4 rounded-2xl border transition-all font-sans text-sm flex items-center gap-3",
                              formData.optionsWanted.includes(option) ? "border-omw-blue-dark bg-omw-blue/10" : "border-black/5 bg-white hover:bg-black/5"
                            )}
                          >
                            <div className={cn(
                              "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                              formData.optionsWanted.includes(option) ? "bg-omw-blue-dark border-omw-blue-dark text-white" : "border-black/10"
                            )}>
                              {formData.optionsWanted.includes(option) && <CheckCircle2 className="w-3 h-3" />}
                            </div>
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-black/5 space-y-4">
                      <p className="label-omw !text-[10px]">Special Requirements</p>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, carSeatRequired: !formData.carSeatRequired })}
                          className={cn(
                            "p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group",
                            formData.carSeatRequired 
                              ? "border-omw-blue-dark bg-omw-blue text-omw-blue-dark" 
                              : "border-black/5 bg-white hover:border-black/10 text-omw-gray"
                          )}
                        >
                          <Baby className="w-6 h-6" />
                          <span className="font-sans text-xs font-semibold">Car Seat</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, specialNeeds: !formData.specialNeeds })}
                          className={cn(
                            "p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group",
                            formData.specialNeeds 
                              ? "border-omw-blue-dark bg-omw-blue text-omw-blue-dark" 
                              : "border-black/5 bg-white hover:border-black/10 text-omw-gray"
                          )}
                        >
                          <Heart className="w-6 h-6" />
                          <span className="font-sans text-xs font-semibold">Special Needs</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-8">
                <button
                  onClick={prevStep}
                  disabled={step === 1}
                  className="flex items-center gap-2 text-omw-gray font-medium hover:text-omw-black disabled:opacity-0 transition-all font-sans"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={nextStep}
                  className="btn-blue px-8"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card-omw p-8 space-y-8"
            >
              <div className="space-y-2">
                <div className="label-omw text-omw-blue-dark">Review your route</div>
                <h1 className="font-display text-3xl font-bold text-omw-black">6/6</h1>
              </div>

              <div className="space-y-6">
                <div className="space-y-1">
                  <h2 className="font-display text-2xl font-bold text-omw-black">{formData.school}</h2>
                  <p className="text-omw-gray font-sans">{formData.pickupZone} → School</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="label-omw !text-[10px]">Timing</p>
                    <p className="font-sans font-semibold capitalize">{formData.timing} · {formData.daysNeeded.join(' ')}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="label-omw !text-[10px]">Wants</p>
                    <p className="font-sans font-semibold">{formData.optionsWanted.join(', ') || 'None selected'}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="label-omw !text-[10px]">Issue</p>
                  <p className="font-sans font-semibold">{formData.currentIssue}</p>
                </div>

                {(formData.carSeatRequired || formData.specialNeeds) && (
                  <div className="flex gap-2">
                    {formData.carSeatRequired && (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-omw-blue text-omw-blue-dark text-xs font-semibold font-sans">
                        <Baby className="w-3.5 h-3.5" /> Car Seat
                      </div>
                    )}
                    {formData.specialNeeds && (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-omw-blue text-omw-blue-dark text-xs font-semibold font-sans">
                        <Heart className="w-3.5 h-3.5" /> Special Needs
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 p-4 rounded-pill border border-black/10 font-medium hover:bg-black/5 transition-all font-sans"
                >
                  Edit
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-2 btn-blue"
                >
                  {submitting ? 'Posting...' : 'Post route'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PostRoute;
