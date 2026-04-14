import React, { useState } from 'react';
import { generateWorkoutPlan } from '../services/gemini';
import { Exercise } from '../types';
import { Card, Button } from '../components/Shared';
import { Bot, Loader2, Dumbbell, ArrowRight } from 'lucide-react';

interface AIGeneratorProps {
  rank: string;
  onPlanGenerated: (exercises: Exercise[]) => void;
}

export const AIGenerator: React.FC<AIGeneratorProps> = ({ rank, onPlanGenerated }) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    pushups: '',
    goal: 'Build Muscle',
    notes: '',
    specialRequest: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const plan = await generateWorkoutPlan(
        Number(formData.age),
        Number(formData.weight),
        Number(formData.pushups),
        formData.goal,
        formData.notes,
        rank,
        formData.specialRequest
      );
      onPlanGenerated(plan);
    } catch (error) {
      alert("The oracles are silent. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-6 animate-fade-in">
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-20 animate-pulse"></div>
          <Bot className="w-16 h-16 text-emerald-400 animate-bounce" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-rpg font-bold text-white">Consulting the Archives...</h2>
          <p className="text-slate-400">Gemini AI is crafting your destiny.</p>
        </div>
        <Loader2 className="w-8 h-8 text-quest-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-rpg font-bold text-white mb-2">AI Workout Architect</h2>
        <p className="text-slate-400">Provide your stats, and our AI will forge a path for you.</p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Age</label>
              <input 
                required
                type="number" 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-emerald-500 outline-none transition-colors"
                value={formData.age}
                onChange={e => setFormData({...formData, age: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Body Weight (kg)</label>
              <input 
                required
                type="number" 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-emerald-500 outline-none transition-colors"
                value={formData.weight}
                onChange={e => setFormData({...formData, weight: e.target.value})}
              />
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-400 mb-1">Max Consecutive Push-ups</label>
             <input 
                required
                type="number" 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-emerald-500 outline-none transition-colors"
                value={formData.pushups}
                onChange={e => setFormData({...formData, pushups: e.target.value})}
                placeholder="Be honest, hero."
              />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Primary Goal</label>
            <div className="grid grid-cols-2 gap-4">
              {['Lose Weight', 'Build Muscle'].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setFormData({...formData, goal: g})}
                  className={`p-4 rounded-lg border text-sm font-bold transition-all ${formData.goal === g ? 'bg-emerald-900/50 border-emerald-500 text-emerald-400' : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Any Injuries or Notes?</label>
            <textarea 
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-emerald-500 outline-none transition-colors h-24 resize-none"
              placeholder="e.g. Bad knees, have dumbbells..."
              value={formData.notes}
              onChange={e => setFormData({...formData, notes: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Special Request (AI Customization)</label>
            <textarea 
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-emerald-500 outline-none transition-colors h-24 resize-none"
              placeholder="e.g. Focus on core, only 15 minutes, include yoga..."
              value={formData.specialRequest}
              onChange={e => setFormData({...formData, specialRequest: e.target.value})}
            />
          </div>

          <Button type="submit" className="w-full py-4 text-lg group">
             Generate Plan <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </form>
      </Card>
    </div>
  );
};