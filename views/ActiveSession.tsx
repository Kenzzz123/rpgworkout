import React, { useState, useEffect, useRef } from 'react';
import { Exercise, ExerciseType, Language } from '../types';
import { Card, Button, ProgressBar } from '../components/Shared';
import { Play, Pause, RotateCcw, CheckCircle, ArrowRight, ShieldCheck, X, Zap, Trophy, Flame, Activity } from 'lucide-react';
import { getExerciseInfo } from '../data/exercises';
import { TRANSLATIONS } from '../data/translations';

interface ActiveSessionProps {
  exercises: Exercise[];
  onComplete: (durationMinutes: number) => void;
  onCancel: () => void;
  language: Language;
}

export const ActiveSession: React.FC<ActiveSessionProps> = ({ exercises, onComplete, onCancel, language }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [timer, setTimer] = useState(0); 
  const [isActive, setIsActive] = useState(true);
  
  const [exerciseTimer, setExerciseTimer] = useState(0);
  const [isExerciseTimerRunning, setIsExerciseTimerRunning] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [combo, setCombo] = useState(0);

  const t = TRANSLATIONS[language];
  const currentExercise = exercises[currentIndex];
  const exerciseInfo = getExerciseInfo(currentExercise.name);
  const isTimeBased = currentExercise.type === 'MINUTES';
  const targetTimeSeconds = isTimeBased ? currentExercise.target * 60 : 0;

  useEffect(() => {
    let interval: any;
    if (isActive) {
      interval = setInterval(() => {
        setTimer(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  useEffect(() => {
    let interval: any;
    if (isExerciseTimerRunning && isTimeBased && exerciseTimer > 0) {
      interval = setInterval(() => {
        setExerciseTimer(t => {
          if (t <= 1) {
            setIsExerciseTimerRunning(false);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isExerciseTimerRunning, isTimeBased, exerciseTimer]);

  useEffect(() => {
    if (isTimeBased) {
      setExerciseTimer(targetTimeSeconds);
      setIsExerciseTimerRunning(false); 
    }
  }, [currentIndex, currentSet, isTimeBased, targetTimeSeconds]);

  const triggerCelebration = () => {
    setShowCelebration(true);
    setCombo(c => c + 1);
    setTimeout(() => setShowCelebration(false), 1500);
  };

  const handleNextSet = () => {
    triggerCelebration();
    if (currentSet < currentExercise.sets) {
      setCurrentSet(c => c + 1);
    } else {
      if (currentIndex < exercises.length - 1) {
        setTimeout(() => {
           setCurrentIndex(c => c + 1);
           setCurrentSet(1);
        }, 500);
      } else {
        setIsActive(false);
        onComplete(Math.ceil(timer / 60));
      }
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progress = ((currentIndex) / exercises.length) * 100;
  const videoId = exerciseInfo?.videoId || 'IODxDxX7oi4';
  const exerciseName = language === 'id' && exerciseInfo?.nameId ? exerciseInfo.nameId : currentExercise.name;
  const exerciseDescription = currentExercise.description || (language === 'id' ? exerciseInfo?.descriptionId : exerciseInfo?.description);

  // Optimized Embed URL to fix Error 153 and ensure looping/autoplay
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&playsinline=1&enablejsapi=1`;

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col md:flex-row animate-fade-in overflow-y-auto md:overflow-hidden">
      
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none z-[60] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-quest-primary/20 animate-pulse"></div>
          <div className="relative z-10 text-center">
             <div className="text-6xl md:text-8xl font-display font-bold text-quest-primary animate-bounce drop-shadow-[0_0_50px_rgba(6,182,212,0.8)]">
               {language === 'id' ? 'MANTAP!' : 'GREAT!'}
             </div>
             {combo > 1 && (
               <div className="text-2xl text-yellow-400 font-mono mt-2 animate-pulse">
                 COMBO x{combo}
               </div>
             )}
          </div>
          {/* Simple Particle Effect via CSS */}
          <div className="absolute top-0 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-[ping_1s_infinite]"></div>
          <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-quest-primary rounded-full animate-[ping_1.5s_infinite]"></div>
          <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-quest-accent rounded-full animate-[ping_0.8s_infinite]"></div>
        </div>
      )}

      {/* Left/Top: Video Player */}
      <div className="relative w-full md:w-1/2 h-[40vh] md:h-full bg-slate-900 border-b-4 md:border-b-0 md:border-r-4 border-quest-primary shadow-[0_0_50px_rgba(6,182,212,0.2)]">
        {exerciseInfo ? (
          <div className="w-full h-full relative group">
             <iframe 
               src={embedUrl} 
               title={currentExercise.name}
               className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
               allowFullScreen
               loading="lazy"
             />
             {/* Gradient Overlay for Text Readability */}
             <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-2">
             <Zap className="w-10 h-10 text-slate-700" />
             <p>Visual Data Offline</p>
          </div>
        )}
        
        {/* Info Overlay on Video */}
        <div className="absolute top-0 left-0 w-full p-4 pointer-events-none flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent">
          <div className="max-w-[80%]">
             <h2 className="text-2xl md:text-4xl font-display font-bold text-white drop-shadow-md tracking-wider">
               {exerciseName}
             </h2>
             {exerciseDescription && (
               <p className="text-slate-300 text-xs md:text-sm mt-1 line-clamp-2 md:line-clamp-none bg-black/20 p-1 rounded backdrop-blur-sm">
                 {exerciseDescription}
               </p>
             )}
             <div className="flex flex-wrap gap-2 mt-2">
                 <span className="px-3 py-1 bg-quest-primary text-black text-xs font-bold rounded shadow-lg shadow-quest-primary/20 flex items-center gap-1">
                    <Activity className="w-3 h-3"/> SET {currentSet} / {currentExercise.sets}
                 </span>
                 {language === 'id' && exerciseInfo?.nameId && (
                   <span className="px-3 py-1 bg-black/60 border border-white/20 text-white text-xs font-bold rounded backdrop-blur-md">
                      {exerciseInfo.name}
                   </span>
                 )}
             </div>
          </div>
          <button onClick={onCancel} className="pointer-events-auto p-2 bg-rose-600/80 hover:bg-rose-500 text-white rounded-full backdrop-blur-sm transition-transform hover:rotate-90">
             <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Right/Bottom: Controls & Counter */}
      <div className="flex-1 bg-quest-bg relative flex flex-col p-6 md:p-12 overflow-hidden justify-between">
        {/* Dynamic Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-quest-primary/5 via-transparent to-transparent animate-pulse-slow"></div>

        {/* Header Stats */}
        <div className="flex justify-between items-center relative z-10 text-slate-400 text-sm font-mono border-b border-quest-border pb-4">
           <div className="flex flex-col">
             <span className="text-xs uppercase tracking-widest text-slate-500">{t.timeElapsed}</span>
             <span className="text-xl text-white font-bold">{formatTime(timer)}</span>
           </div>
           <div className="flex flex-col items-end">
             <span className="text-xs uppercase tracking-widest text-slate-500">Progress</span>
             <span className="text-xl text-white font-bold">{currentIndex + 1} / {exercises.length}</span>
           </div>
        </div>
        
        {/* Progress Bar */}
        <div className="relative z-10 mt-2">
           <ProgressBar value={progress} max={100} showText={false} color="bg-gradient-to-r from-quest-primary to-quest-secondary" />
        </div>

        {/* Main Counter Area */}
        <div className="flex-1 flex flex-col items-center justify-center relative z-10 gap-8 py-8">
            
            {/* Rep Counter or Timer Circle */}
            <div className={`
              relative w-56 h-56 md:w-72 md:h-72 rounded-full border-[6px] flex items-center justify-center bg-black/40 backdrop-blur-md
              shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all duration-300
              ${isTimeBased && isExerciseTimerRunning ? 'border-quest-accent shadow-[0_0_60px_rgba(244,63,94,0.3)] scale-105' : 'border-quest-border'}
            `}>
              {/* Inner Rings for Animation */}
              <div className={`absolute inset-0 rounded-full border-2 border-dashed border-white/10 ${isExerciseTimerRunning ? 'animate-[spin_10s_linear_infinite]' : ''}`}></div>
              <div className={`absolute -inset-2 rounded-full border border-quest-primary/20 ${isExerciseTimerRunning ? 'animate-pulse' : ''}`}></div>

              {isTimeBased ? (
                <div className="text-center">
                  <div className={`text-7xl font-mono font-bold transition-all ${exerciseTimer < 10 && exerciseTimer > 0 ? 'text-red-500 scale-110' : 'text-white'}`}>
                    {formatTime(exerciseTimer)}
                  </div>
                  <div className="flex gap-4 justify-center mt-6">
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsExerciseTimerRunning(!isExerciseTimerRunning);
                      }}
                      className="p-6 md:p-4 bg-quest-card border border-quest-border rounded-full hover:bg-quest-primary hover:text-black transition-all hover:scale-110 active:scale-95 shadow-lg touch-manipulation"
                    >
                      {isExerciseTimerRunning ? <Pause className="w-10 h-10 md:w-8 md:h-8"/> : <Play className="w-10 h-10 md:w-8 md:h-8 pl-1"/>}
                    </button>
                    <button 
                       type="button"
                       onClick={(e) => {
                         e.preventDefault();
                         setIsExerciseTimerRunning(false);
                         setExerciseTimer(targetTimeSeconds);
                       }}
                       className="p-6 md:p-4 bg-quest-card border border-quest-border rounded-full hover:text-white hover:bg-slate-700 transition-all hover:scale-110 active:scale-95 shadow-lg touch-manipulation"
                    >
                      <RotateCcw className="w-10 h-10 md:w-8 md:h-8"/>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center flex flex-col items-center">
                   <div className="text-8xl font-display font-bold text-white mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                     {currentExercise.target}
                   </div>
                   <div className="text-quest-primary uppercase tracking-[0.2em] text-lg font-bold bg-quest-primary/10 px-4 py-1 rounded-full border border-quest-primary/20">
                     {t.reps}
                   </div>
                </div>
              )}
            </div>

            {/* Complete Button */}
            <Button 
              onClick={handleNextSet}
              className={`
                w-full max-w-sm py-6 text-xl tracking-widest font-bold shadow-[0_0_30px_rgba(16,185,129,0.2)]
                transition-all hover:scale-105 active:scale-95 relative overflow-hidden group
              `}
              variant="primary"
              style={{ backgroundColor: '#10b981', color: 'black' }}
            >
               <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              {currentSet === currentExercise.sets && currentIndex === exercises.length - 1 ? (
                <span className="flex items-center gap-3 relative z-10"><Trophy className="w-6 h-6 animate-bounce" /> {t.completeQuest}</span>
              ) : (
                <span className="flex items-center gap-3 relative z-10"><CheckCircle className="w-6 h-6" /> {t.completeSet}</span>
              )}
            </Button>
        </div>

        {/* Up Next Preview */}
        {currentIndex < exercises.length - 1 && (
           <div className="mt-auto pt-6 border-t border-quest-border text-center text-slate-500 text-sm flex items-center justify-between relative z-10 bg-black/20 p-3 rounded-lg">
            <span className="uppercase tracking-wider text-xs font-bold">{t.next}</span>
            <span className="text-white font-medium flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-quest-secondary animate-pulse"></span>
               {language === 'id' && getExerciseInfo(exercises[currentIndex+1].name)?.nameId ? getExerciseInfo(exercises[currentIndex+1].name)?.nameId : exercises[currentIndex + 1].name}
            </span>
            <ArrowRight className="w-4 h-4 text-quest-secondary" />
          </div>
        )}
      </div>
    </div>
  );
};