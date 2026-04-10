import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowLeft, School, Users, Gift, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const SchoolPool: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    schoolName: '',
    role: '',
    neighborhood: '',
    issue: '',
    goal: ''
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const steps = [
    {
      id: 1,
      question: "What school are we coordinating for?",
      field: "schoolName",
      placeholder: "e.g. Pinecrest Elementary",
      icon: School
    },
    {
      id: 2,
      question: "What is your role at the school?",
      field: "role",
      placeholder: "e.g. PTA President, Principal, Parent Organizer",
      icon: Users
    },
    {
      id: 3,
      question: "Which neighborhood is the primary focus?",
      field: "neighborhood",
      placeholder: "e.g. Coral Gables, Kendall",
      icon: ArrowRight
    },
    {
      id: 4,
      question: "What's the current transportation issue?",
      field: "issue",
      placeholder: "e.g. Long carpool lines, lack of busing",
      icon: ArrowRight
    }
  ];

  const currentStepData = steps.find(s => s.id === step);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <AnimatePresence mode="wait">
          {step <= steps.length ? (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-omw-pink rounded-2xl flex items-center justify-center text-omw-pink-dark">
                  {currentStepData && <currentStepData.icon className="w-6 h-6" />}
                </div>
                <div className="h-1 flex-1 bg-black/5 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-omw-pink-dark"
                    initial={{ width: 0 }}
                    animate={{ width: `${(step / steps.length) * 100}%` }}
                  />
                </div>
                <span className="label-omw !text-[10px]">
                  Step {step} of {steps.length}
                </span>
              </div>

              <div className="space-y-6">
                <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-omw-black">
                  {currentStepData?.question}
                </h1>
                <input
                  autoFocus
                  type="text"
                  value={(formData as any)[currentStepData?.field || '']}
                  onChange={(e) => setFormData({ ...formData, [currentStepData?.field || '']: e.target.value })}
                  placeholder={currentStepData?.placeholder}
                  className="w-full text-2xl font-normal bg-transparent border-b-2 border-black/10 focus:border-omw-pink-dark focus:outline-none py-4 transition-colors placeholder:text-black/10 font-sans"
                  onKeyDown={(e) => e.key === 'Enter' && nextStep()}
                />
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
                  className="btn-pink"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card-omw p-12 text-center space-y-8"
            >
              <div className="w-20 h-20 bg-omw-pink rounded-full flex items-center justify-center text-omw-pink-dark mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-4">
                <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-omw-black">Ready to launch.</h1>
                <p className="font-sans text-sm sm:text-base leading-7 text-omw-gray max-w-md mx-auto">
                  We'll review your request for <strong>{formData.schoolName}</strong> and set up your school dashboard. 
                  You'll be able to track interest and manage the 5% fundraiser kickback.
                </p>
              </div>
              <div className="pt-4">
                <Link to="/" className="btn-black inline-flex">
                  Return to Dashboard
                </Link>
              </div>
              
              <div className="pt-8 border-t border-black/5 flex items-center justify-center gap-8">
                <div className="flex items-center gap-2 label-omw !text-[10px] !text-omw-pink-dark">
                  <Gift className="w-4 h-4" /> 5% Fundraiser Active
                </div>
                <div className="flex items-center gap-2 label-omw !text-[10px] !text-omw-blue-dark">
                  <Users className="w-4 h-4" /> Community Verified
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SchoolPool;
