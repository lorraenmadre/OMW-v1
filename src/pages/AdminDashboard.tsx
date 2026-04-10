import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, updateDoc, doc, orderBy } from 'firebase/firestore';
import { Route, WaitlistRequest } from '../types';
import { CheckCircle2, XCircle, MapPin, Mail, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';

const AdminDashboard: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [waitlist, setWaitlist] = useState<WaitlistRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const qRoutes = query(collection(db, 'routes'), orderBy('createdAt', 'desc'));
    const unsubRoutes = onSnapshot(qRoutes, (snapshot) => {
      setRoutes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Route[]);
    });

    const qWaitlist = query(collection(db, 'waitlist'), orderBy('createdAt', 'desc'));
    const unsubWaitlist = onSnapshot(qWaitlist, (snapshot) => {
      setWaitlist(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as WaitlistRequest[]);
      setLoading(false);
    });

    return () => {
      unsubRoutes();
      unsubWaitlist();
    };
  }, []);

  const updateRouteStatus = async (id: string, status: Route['status']) => {
    await updateDoc(doc(db, 'routes', id), { status });
  };

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-omw-blue-dark"></div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className="label-omw bg-omw-black text-white">Admin Only</div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-omw-black">Dashboard</h1>
          <p className="font-sans text-sm sm:text-base leading-7 text-omw-gray">Review and moderate Miami school routes.</p>
        </div>
        <div className="flex gap-4">
          <div className="card-omw px-8 py-6 text-center">
            <span className="block text-3xl font-semibold text-omw-black font-sans">{routes.length}</span>
            <span className="label-omw !text-[10px]">Total Routes</span>
          </div>
          <div className="card-omw px-8 py-6 text-center">
            <span className="block text-3xl font-semibold text-omw-blue-dark font-sans">{routes.filter(r => r.status === 'Open').length}</span>
            <span className="label-omw !text-[10px]">Open</span>
          </div>
        </div>
      </header>

      <section className="space-y-6">
        <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-omw-black flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-omw-blue-dark" />
          Route Moderation
        </h2>
        <div className="card-omw overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-black/5">
                  <th className="px-8 py-6 label-omw !text-[10px]">Route</th>
                  <th className="px-8 py-6 label-omw !text-[10px]">Status</th>
                  <th className="px-8 py-6 label-omw !text-[10px]">Created</th>
                  <th className="px-8 py-6 label-omw !text-[10px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {routes.map((route) => (
                  <tr key={route.id} className="hover:bg-black/[0.02] transition-colors">
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <div className="font-semibold text-omw-black font-sans">{route.school}</div>
                        <div className="text-xs text-omw-gray font-normal font-sans">{route.pickupNeighborhood}</div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-medium uppercase tracking-widest font-sans",
                        route.status === 'Open' ? "bg-green-100 text-green-700" :
                        route.status === 'Forming' ? "bg-omw-blue text-omw-blue-dark" :
                        "bg-black/5 text-omw-gray"
                      )}>
                        {route.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-sm text-omw-gray font-normal font-sans">
                      {new Date(route.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => updateRouteStatus(route.id, 'Paused')}
                          className="p-2 text-omw-gray hover:text-red-600 transition-colors"
                          title="Pause Route"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => updateRouteStatus(route.id, 'Open')}
                          className="p-2 text-omw-gray hover:text-green-600 transition-colors"
                          title="Open Route"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-omw-black flex items-center gap-3">
          <MapPin className="w-8 h-8 text-omw-blue-dark" />
          Expansion Waitlist ({waitlist.length})
        </h2>
        <div className="card-omw overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-black/5">
                  <th className="px-8 py-6 label-omw !text-[10px]">Email</th>
                  <th className="px-8 py-6 label-omw !text-[10px]">County</th>
                  <th className="px-8 py-6 label-omw !text-[10px]">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {waitlist.map((req) => (
                  <tr key={req.id} className="hover:bg-black/[0.02] transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3 font-semibold text-omw-black font-sans">
                        <Mail className="w-4 h-4 text-omw-blue-dark" />
                        {req.email}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="label-omw bg-omw-blue text-omw-blue-dark font-sans">
                        {req.county}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-sm text-omw-gray font-normal font-sans">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {waitlist.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-8 py-12 text-center text-omw-gray font-normal italic font-sans">
                      No expansion requests yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
