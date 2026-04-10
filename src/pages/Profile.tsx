import React from 'react';
import { auth, db } from '../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useAuth } from '../AuthContext';
import { User, ShieldCheck, Truck, Car, LogOut, ChevronRight } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { UserRole } from '../types';
import { cn } from '../lib/utils';

const Profile: React.FC = () => {
  const { user, profile, loading } = useAuth();

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const updateRole = async (role: UserRole) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), { role });
    } catch (error) {
      console.error('Update role error:', error);
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-omw-blue-dark"></div>
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full card-omw p-12 text-center space-y-8">
          <div className="w-20 h-20 bg-omw-blue rounded-3xl flex items-center justify-center mx-auto text-omw-blue-dark">
            <User className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-omw-black">Welcome to OMW</h1>
            <p className="font-sans text-sm sm:text-base leading-7 text-omw-gray">Sign in to post routes, browse options, and manage your school transportation.</p>
          </div>
          <button
            onClick={handleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-black/5 p-5 rounded-pill font-semibold hover:bg-black/5 transition-all font-sans"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6" alt="Google" />
            Continue with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      <div className="card-omw p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
        <img 
          src={user.photoURL || ''} 
          className="w-32 h-32 rounded-full border-4 border-omw-blue" 
          alt="Profile" 
          referrerPolicy="no-referrer"
        />
        <div className="space-y-2 flex-1">
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-omw-black">{user.displayName}</h1>
          <p className="font-sans text-lg sm:text-xl font-normal text-omw-gray">{user.email}</p>
          <div className="pt-2">
            <span className="label-omw bg-omw-blue text-omw-blue-dark">
              {profile?.role || 'Parent'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <section className="card-omw p-8 space-y-8">
          <div className="space-y-2">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-omw-black flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-omw-blue-dark" />
              Account Role
            </h2>
            <p className="font-sans text-sm font-normal text-omw-gray">How are you using OMW today?</p>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={() => updateRole('parent')}
              className={cn(
                "p-6 rounded-2xl border-2 transition-all text-left flex items-center gap-4 font-sans",
                profile?.role === 'parent' ? "border-omw-blue-dark bg-omw-blue text-omw-blue-dark" : "border-black/5 hover:border-black/10"
              )}
            >
              <div className="w-12 h-12 bg-white/50 rounded-xl flex items-center justify-center">
                <Car className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <span className="block font-semibold">Parent</span>
                <span className="text-xs font-normal opacity-70">Posting routes for my kids</span>
              </div>
              {profile?.role === 'parent' && <ChevronRight className="w-5 h-5" />}
            </button>
            <button
              onClick={() => updateRole('provider')}
              className={cn(
                "p-6 rounded-2xl border-2 transition-all text-left flex items-center gap-4 font-sans",
                profile?.role === 'provider' ? "border-omw-black bg-omw-black text-white" : "border-black/5 hover:border-black/10"
              )}
            >
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <span className="block font-semibold">Provider</span>
                <span className="text-xs font-normal opacity-70">Offering transportation services</span>
              </div>
              {profile?.role === 'provider' && <ChevronRight className="w-5 h-5" />}
            </button>
          </div>
        </section>

        <section className="card-omw p-8 space-y-8">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-omw-black">Quick Actions</h2>
          <div className="space-y-4">
            <button
              onClick={() => auth.signOut()}
              className="w-full flex items-center justify-between p-6 rounded-2xl bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition-all font-sans"
            >
              Sign Out
              <LogOut className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 bg-black/5 rounded-2xl space-y-2">
            <h4 className="label-omw !text-[10px] !text-omw-gray">Vetting Status</h4>
            <p className="font-sans text-sm font-semibold text-omw-black">Not yet vetted</p>
            <p className="font-sans text-xs font-normal leading-relaxed text-omw-gray">
              Providers must complete a background check and vehicle inspection before accepting routes.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
