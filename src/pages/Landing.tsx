import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { MapPin, Users, ArrowRight, MessageCircle } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { cn } from '../lib/utils';

const Landing: React.FC = () => {
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistCounty, setWaitlistCounty] = useState<'West Palm' | 'Broward' | 'Other'>('Broward');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
      setSubmitted(true);
    } catch (err) {
      console.error('Error joining waitlist:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const featuredRoutes = [
    { id: '1', school: 'Archimedean Academy', pickupZone: 'Kendall', status: 'Forming', families: 3 },
    { id: '2', school: 'Coral Way K-8', pickupZone: 'Shenandoah', status: 'Open', families: 2 },
  ];

  return (
    <div className="pb-20">

      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-[55fr_45fr] gap-10 md:gap-16 items-center">

          {/* Left — copy */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* ── Black rounded-corner heading box ── */}
            <div className="inline-block bg-omw-black rounded-[20px] px-8 py-7">
              <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-[#74D4FF] mb-2 font-sans">
                Family Travel Club
              </span>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tighter text-white font-display leading-[1.05]">
                Route sharing<br />
                for families.
              </h1>
            </div>

            {/* Brand descriptor pills */}
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#74D4FF] text-omw-black text-xs font-semibold font-sans">
                AI-powered
              </span>
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#FCCFE8] text-omw-black text-xs font-semibold font-sans">
                Perplexity AI
              </span>
              <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-omw-black/30 text-omw-black text-xs font-semibold font-sans">
                Social impact
              </span>
            </div>

            {/* Subheadline */}
            <p className="text-base md:text-lg text-omw-gray font-sans leading-relaxed max-w-md">
              A community-built solution for family transportation —
              share your route, start a school pool, and help your neighborhood move smarter.
            </p>

            {/* Trust line */}
            <p className="inline-block text-xs text-omw-gray font-sans bg-white border border-black/8 rounded-full px-4 py-2">
              Free to post a route. Joining the club is optional and paid.
            </p>

            {/* CTA pills */}
            <div className="flex flex-wrap gap-3 pt-1">
              <Link to="/post" className="btn-blue py-4 px-7 text-base shadow-[0_8px_24px_rgba(0,0,0,0.07)]">
                Post a route <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/school-pool" className="btn-pink py-4 px-7 text-base shadow-[0_8px_24px_rgba(0,0,0,0.07)]">
                Start a school pool
              </Link>
              <Link to="/browse" className="btn-black py-4 px-7 text-base">
                Join
              </Link>
              <Link
                to="/browse"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full border-[1.5px] border-omw-black text-omw-black text-base font-medium font-sans hover:opacity-80 transition-all active:scale-95"
              >
                Browse routes
              </Link>
            </div>

            {/* Tagline */}
            <p className="label-omw pt-1">TRAVEL · TRANSPORT · TRACKING</p>
          </motion.div>

          {/* Right — Lisey character */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-4 items-start md:items-center"
          >
            {/* Portrait frame — white background */}
            <div className="bg-white rounded-[20px] border border-black/8 overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.06)] w-full max-w-[300px]">
              <img
                src="/assets/lisey.png"
                alt="Lisey — your OMW guide"
                className="w-full h-auto block"
              />
            </div>

            {/* Meet Lisey badge */}
            <div className="inline-flex items-center gap-3 bg-white border border-black/8 rounded-full px-5 py-3 shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
              <MessageCircle className="w-5 h-5 text-omw-blue-dark flex-shrink-0" />
              <div>
                <span className="block text-sm font-bold text-omw-black font-sans leading-tight">Meet Lisey</span>
                <span className="block text-xs text-omw-gray font-sans">Text her any time</span>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────────────────── */}
      <section className="bg-white border-y border-black/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="space-y-3">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#74D4FF] text-omw-black text-xs font-semibold font-sans">
              How it works
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-omw-black font-display">
              Free to share. Better together.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                n: '01',
                title: 'Post your route',
                body: 'Share when you drive, where you go, and how many seats you have. No account needed.',
              },
              {
                n: '02',
                title: 'Start a school pool',
                body: 'Organize a carpool group with other families at your school. OMW helps coordinate.',
              },
              {
                n: '03',
                title: 'Join the club',
                body: 'Members get travel benefits, priority matching, and community perks. Optional and paid.',
              },
              {
                n: '04',
                title: 'Become a PAD',
                body: 'Parental Approved Drivers are vetted community members who help families when needed.',
              },
            ].map((step) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="card-omw p-7 space-y-4"
              >
                <div className="w-9 h-9 rounded-full bg-[#74D4FF] flex items-center justify-center text-[11px] font-bold text-omw-black font-sans">
                  {step.n}
                </div>
                <h3 className="text-lg font-bold text-omw-black font-display">{step.title}</h3>
                <p className="text-sm text-omw-gray font-sans leading-relaxed">{step.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── OPEN ROUTES ─────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
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
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card-omw group cursor-pointer hover:border-omw-blue/30 transition-all"
            >
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="font-bold text-lg text-omw-black font-display group-hover:text-omw-blue-dark transition-colors">
                      {route.school}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-omw-gray font-sans">
                      <MapPin className="w-4 h-4" />
                      <span>{route.pickupZone} → School</span>
                    </div>
                  </div>
                  <div className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    route.status === 'Forming' ? "bg-omw-blue/30 text-omw-blue-dark" : "bg-green-100 text-green-700"
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

      {/* ─── LISEY SECTION ─────────────────────────────────────────── */}
      <section className="bg-white border-y border-black/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-5">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#FCCFE8] text-omw-black text-xs font-semibold font-sans">
                Your OMW guide
              </span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-omw-black font-display">
                Say hello to Lisey.
              </h2>
              <p className="text-base text-omw-gray font-sans leading-relaxed max-w-md">
                Lisey is the face and voice of OMW. She'll help you find routes, answer questions,
                and keep your family moving — by text, by email, and on TikTok.
              </p>
              <p className="text-base text-omw-gray font-sans leading-relaxed max-w-md">
                She's warm, witty, and always on — because getting your kids to school
                shouldn't feel like a logistics problem.
              </p>
              <a
                href="sms:+13055550100"
                className="btn-black inline-flex py-4 px-8 text-base"
              >
                Text Lisey <MessageCircle className="w-4 h-4" />
              </a>
            </div>
            <div className="flex justify-center md:justify-end">
              <div className="bg-white rounded-[20px] border border-black/8 overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.06)] max-w-[280px] w-full">
                <img
                  src="/assets/lisey.png"
                  alt="Lisey"
                  className="w-full h-auto block"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PILOT PHOTO ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <img
          src="/assets/archimedean-rainbow.jpg"
          alt="Archimedean Academy pickup line — Miami"
          className="w-full h-[400px] md:h-[480px] object-cover object-[center_60%]"
        />
        <div className="absolute bottom-6 left-4 sm:left-8 bg-white rounded-[18px] border border-black/8 p-4 max-w-xs shadow-lg">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#74D4FF] text-omw-black text-[10px] font-bold font-sans uppercase tracking-wider mb-2">
            Pilot school
          </span>
          <p className="text-sm text-omw-gray font-sans">
            Archimedean Academy, Miami, FL — where OMW started.
          </p>
        </div>
      </section>

      {/* ─── JOIN SECTION ─────────────────────────────────────────── */}
      <section className="bg-white border-t border-black/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-omw-black rounded-[24px] p-12 md:p-16 max-w-2xl w-full space-y-5"
          >
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#FCCFE8] text-omw-black text-xs font-semibold font-sans">
              Founding members
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white font-display">
              Be part of the first club.
            </h2>
            <p className="text-base leading-relaxed font-sans text-white/70 max-w-md">
              OMW is launching its pilot in Miami. Founding members get early access,
              travel perks, and the chance to shape how the club grows.
            </p>
            <p className="inline-block text-xs text-white/40 border border-white/15 rounded-full px-4 py-2 font-sans">
              Free to post a route. Membership is optional and paid.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/browse"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white text-omw-black text-base font-semibold font-sans hover:opacity-90 transition-all active:scale-95"
              >
                Join the club <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/post" className="btn-blue py-4 px-7 text-base">
                Post a route first
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Landing;
