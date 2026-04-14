import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Button, Card } from '../components/Shared';
import { ChevronRight, Check } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: Partial<UserProfile>) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: '',
    age: null,
    height: null,
    weight: null,
    goal: null,
    abilityLevel: null,
    maxPushups: 0,
    notes: ''
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else onComplete(formData);
  };

  const isStepValid = () => {
    if (step === 1) return formData.name && formData.age && formData.height && formData.weight;
    if (step === 2) return formData.goal && formData.abilityLevel;
    return true;
  };

  return (
    <div className="min-h-screen bg-quest-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background FX */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-[100vw] h-[100vw] bg-quest-primary/5 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-[100vw] h-[100vw] bg-quest-secondary/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-lg relative z-10">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-display font-bold text-white mb-2">IRON<span className="text-quest-primary">QUEST</span></h1>
          <p className="text-slate-400">Initialize your physical augmentation program.</p>
        </div>

        <Card className="border-quest-primary/20 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
          <div className="mb-6 flex gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-1 flex-1 rounded-full transition-all ${step >= i ? 'bg-quest-primary' : 'bg-quest-border'}`} />
            ))}
          </div>

          <div className="min-h-[300px]">
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <h2 className="text-xl font-bold text-white mb-4">Identity & Metrics</h2>
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Display Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-quest-bg border border-quest-border rounded-lg p-3 text-white focus:border-quest-primary outline-none"
                    placeholder="Enter Agent Name"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                   <div>
                    <label className="text-sm text-slate-400 mb-1 block">Age</label>
                    <input type="number" className="w-full bg-quest-bg border border-quest-border rounded-lg p-3 text-white focus:border-quest-primary outline-none" 
                       value={formData.age || ''} onChange={e => setFormData({...formData, age: Number(e.target.value)})} />
                   </div>
                   <div>
                    <label className="text-sm text-slate-400 mb-1 block">Height (cm)</label>
                    <input type="number" className="w-full bg-quest-bg border border-quest-border rounded-lg p-3 text-white focus:border-quest-primary outline-none"
                      value={formData.height || ''} onChange={e => setFormData({...formData, height: Number(e.target.value)})} />
                   </div>
                   <div>
                    <label className="text-sm text-slate-400 mb-1 block">Weight (kg)</label>
                    <input type="number" className="w-full bg-quest-bg border border-quest-border rounded-lg p-3 text-white focus:border-quest-primary outline-none"
                      value={formData.weight || ''} onChange={e => setFormData({...formData, weight: Number(e.target.value)})} />
                   </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-bold text-white mb-4">Directives & Assessment</h2>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Primary Objective</label>
                  <div className="grid grid-cols-1 gap-2">
                    {['Lose Weight', 'Build Muscle', 'Stay Active'].map((goal) => (
                      <button
                        key={goal}
                        onClick={() => setFormData({...formData, goal: goal as any})}
                        className={`p-3 rounded-lg border text-left transition-all ${formData.goal === goal ? 'bg-quest-primary/10 border-quest-primary text-white' : 'bg-quest-bg border-quest-border text-slate-400 hover:border-slate-500'}`}
                      >
                        {goal}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                   <label className="text-sm text-slate-400 mb-2 block">Current Ability Level</label>
                   <div className="grid grid-cols-3 gap-2">
                    {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                      <button
                        key={level}
                        onClick={() => setFormData({...formData, abilityLevel: level as any})}
                        className={`p-2 rounded-lg border text-sm transition-all ${formData.abilityLevel === level ? 'bg-quest-secondary/10 border-quest-secondary text-white' : 'bg-quest-bg border-quest-border text-slate-400 hover:border-slate-500'}`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                   <label className="text-sm text-slate-400 mb-1 block">Max Push-ups (Test)</label>
                   <input type="number" className="w-full bg-quest-bg border border-quest-border rounded-lg p-3 text-white focus:border-quest-primary outline-none" 
                     placeholder="How many can you do right now?"
                     value={formData.maxPushups || ''} onChange={e => setFormData({...formData, maxPushups: Number(e.target.value)})} />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 animate-fade-in">
                 <h2 className="text-xl font-bold text-white mb-4">Additional Notes</h2>
                 <p className="text-slate-400 text-sm mb-2">Any injuries, equipment limitations, or specific notes for your AI Coach?</p>
                 <textarea 
                   className="w-full h-32 bg-quest-bg border border-quest-border rounded-lg p-3 text-white focus:border-quest-primary outline-none resize-none"
                   placeholder="e.g. Weak left knee, only have dumbbells..."
                   value={formData.notes}
                   onChange={e => setFormData({...formData, notes: e.target.value})}
                 />
              </div>
            )}
          </div>

          <div className="mt-8 pt-4 border-t border-quest-border flex justify-end">
            <Button onClick={handleNext} disabled={!isStepValid()} className="w-full sm:w-auto">
              {step === 3 ? 'Initialize System' : 'Next Step'} <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};