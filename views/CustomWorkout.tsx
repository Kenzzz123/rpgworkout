import React, { useState } from 'react';
import { Exercise, ExerciseType } from '../types';
import { Card, Button } from '../components/Shared';
import { Trash2, Plus, Play, Dumbbell, Timer, Info } from 'lucide-react';
import { getExerciseInfo } from '../data/exercises';
import { ExerciseModal } from '../components/ExerciseModal';
import { TRANSLATIONS } from '../data/translations';

interface CustomWorkoutProps {
  exercises: Exercise[];
  setExercises: (exercises: Exercise[]) => void;
  onStartSession: () => void;
  language: 'en' | 'id';
}

export const CustomWorkout: React.FC<CustomWorkoutProps> = ({ exercises, setExercises, onStartSession, language }) => {
  const [newExercise, setNewExercise] = useState<Partial<Exercise>>({
    name: '',
    type: 'REPS',
    target: 10,
    sets: 3,
    description: ''
  });

  const t = TRANSLATIONS[language];
  const [modalInfo, setModalInfo] = useState<any>(null);

  const handleAddExercise = () => {
    if (!newExercise.name || !newExercise.target || !newExercise.sets) return;

    const exercise: Exercise = {
      id: crypto.randomUUID(),
      name: newExercise.name,
      type: newExercise.type as ExerciseType,
      target: Number(newExercise.target),
      sets: Number(newExercise.sets),
      description: newExercise.description
    };

    setExercises([...exercises, exercise]);
    setNewExercise({ name: '', type: 'REPS', target: 10, sets: 3, description: '' });
  };

  const handleRemoveExercise = (id: string) => {
    setExercises(exercises.filter(e => e.id !== id));
  };

  const handleShowInfo = (name: string) => {
    const info = getExerciseInfo(name);
    if (info) {
      setModalInfo(info);
    } else {
      // Fallback
      setModalInfo({
        name: name,
        description: language === 'id' ? "Ikuti gerakan dengan postur yang benar." : "Standard exercise execution. Ensure maintain proper posture.",
        videoId: "IODxDxX7oi4", // Default
        difficulty: "General",
        muscleGroup: "General"
      });
    }
  };

  const canStart = exercises.length >= 5;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-2xl font-display font-bold text-white">{t.customWorkout}</h2>
           <p className="text-slate-400 text-sm">{language === 'id' ? 'Rancang sendiri siksaanmu.' : 'Design your training regimen.'}</p>
        </div>
        <div className="text-quest-primary text-sm font-mono border border-quest-primary/30 px-3 py-1 rounded bg-quest-primary/5">
          {exercises.length} / 5 REQUIRED
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <Card title={t.addExercise} className="lg:col-span-1 h-fit">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">{t.exerciseName}</label>
              <div className="flex gap-2">
                 <input 
                  type="text" 
                  value={newExercise.name}
                  onChange={(e) => setNewExercise({...newExercise, name: e.target.value})}
                  className="w-full bg-quest-bg border border-quest-border rounded-lg p-2 text-white focus:border-quest-primary outline-none text-sm"
                  placeholder={language === 'id' ? 'Contoh: Push Ups' : 'e.g. Push Ups'}
                />
                {newExercise.name && (
                   <button 
                     onClick={() => handleShowInfo(newExercise.name!)}
                     className="p-2 bg-quest-bg border border-quest-border rounded-lg text-quest-primary hover:text-white hover:bg-quest-primary transition-colors"
                     title="View Info"
                   >
                     <Info className="w-5 h-5" />
                   </button>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Type</label>
                <div className="flex bg-quest-bg rounded-lg p-1 border border-quest-border">
                  <button 
                    onClick={() => setNewExercise({...newExercise, type: 'REPS'})}
                    className={`flex-1 text-xs py-1.5 rounded transition-colors ${newExercise.type === 'REPS' ? 'bg-quest-card text-white shadow' : 'text-slate-500'}`}
                  >
                    {t.reps}
                  </button>
                  <button 
                    onClick={() => setNewExercise({...newExercise, type: 'MINUTES'})}
                    className={`flex-1 text-xs py-1.5 rounded transition-colors ${newExercise.type === 'MINUTES' ? 'bg-quest-card text-white shadow' : 'text-slate-500'}`}
                  >
                    {t.mins}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">{t.sets}</label>
                <input 
                  type="number" 
                  min="1"
                  max="10"
                  value={newExercise.sets}
                  onChange={(e) => setNewExercise({...newExercise, sets: parseInt(e.target.value)})}
                  className="w-full bg-quest-bg border border-quest-border rounded-lg p-2 text-white outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">
                {newExercise.type === 'REPS' ? t.reps : t.minutes}
              </label>
              <input 
                type="number" 
                min="1"
                value={newExercise.target}
                onChange={(e) => setNewExercise({...newExercise, target: parseInt(e.target.value)})}
                className="w-full bg-quest-bg border border-quest-border rounded-lg p-2 text-white outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Description (Optional)</label>
              <textarea 
                value={newExercise.description}
                onChange={(e) => setNewExercise({...newExercise, description: e.target.value})}
                className="w-full bg-quest-bg border border-quest-border rounded-lg p-2 text-white outline-none text-sm h-20 resize-none"
                placeholder={language === 'id' ? 'Instruksi singkat...' : 'Brief instructions...'}
              />
            </div>

            <Button onClick={handleAddExercise} className="w-full" disabled={!newExercise.name}>
              <Plus className="w-4 h-4" /> {t.addExercise}
            </Button>
          </div>
        </Card>

        {/* List */}
        <div className="lg:col-span-2 space-y-4">
          {exercises.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-quest-border rounded-xl text-slate-600">
              <Dumbbell className="w-12 h-12 mb-4 opacity-20" />
              <p>{language === 'id' ? 'Daftar Kosong.' : 'Sequence Empty.'}</p>
              <p className="text-sm">{language === 'id' ? 'Mulai tambah latihan!' : 'Initialize exercises to build routine.'}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {exercises.map((ex, idx) => {
                const exName = language === 'id' && getExerciseInfo(ex.name)?.nameId ? getExerciseInfo(ex.name)?.nameId : ex.name;
                return (
                  <div key={ex.id} className="bg-quest-card border border-quest-border p-4 rounded-lg flex items-center justify-between group hover:border-quest-primary/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-quest-bg flex items-center justify-center text-slate-400 font-bold text-sm border border-quest-border">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                           <h4 className="font-bold text-white">{exName}</h4>
                           <button onClick={() => handleShowInfo(ex.name)} className="text-quest-primary hover:text-white transition-colors">
                              <Info className="w-4 h-4" />
                           </button>
                        </div>
                        <div className="flex gap-4 text-xs text-slate-400 mt-1">
                          <span className="flex items-center gap-1">
                            {ex.type === 'REPS' ? <Dumbbell className="w-3 h-3"/> : <Timer className="w-3 h-3"/>}
                            {ex.target} {ex.type === 'REPS' ? t.reps : t.mins}
                          </span>
                          <span>{ex.sets} {t.sets}</span>
                        </div>
                        {ex.description && (
                          <p className="text-[10px] text-slate-500 mt-1 line-clamp-1 italic">{ex.description}</p>
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={() => handleRemoveExercise(ex.id)}
                      className="p-2 text-slate-500 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-quest-border">
            <Button 
              onClick={onStartSession} 
              disabled={!canStart} 
              className={`w-full py-4 text-lg ${canStart ? 'animate-pulse shadow-[0_0_20px_rgba(6,182,212,0.4)]' : ''}`}
            >
              <Play className="w-5 h-5" />
              {canStart ? t.startSession : `Add ${5 - exercises.length} more modules to execute`}
            </Button>
          </div>
        </div>
      </div>

      <ExerciseModal 
        isOpen={!!modalInfo} 
        info={modalInfo} 
        onClose={() => setModalInfo(null)}
        language={language}
      />
    </div>
  );
};