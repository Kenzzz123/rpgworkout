import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './views/Dashboard';
import { CustomWorkout } from './views/CustomWorkout';
import { ActiveSession } from './views/ActiveSession';
import { AIGenerator } from './views/AIGenerator';
import { Coach } from './views/Coach';
import { Profile } from './views/Profile';
import { Onboarding } from './views/Onboarding';
import { Landing } from './views/Landing';
import { Card } from './components/Shared';
import { 
  AppState, 
  ViewState, 
  Exercise, 
  WorkoutSession,
  Language 
} from './types';
import { loadGameData, saveGameData, saveWorkoutSession } from './services/storage';
import { auth } from './firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { Menu, Calendar as CalendarIcon, Trophy, LogIn, LogOut } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { generateDailyMissions } from './data/missions';
import { getRankByLevel, RANKS } from './data/ranks';

function App() {
  const [view, setView] = useState<ViewState>('DASHBOARD');
  const [data, setData] = useState<AppState | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Initialize Data & Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        const loadedData = await loadGameData();
        
        // Initialize Daily Missions if empty
        if (!loadedData.dailyMissions || !Array.isArray(loadedData.dailyMissions) || loadedData.dailyMissions.length === 0) {
          loadedData.dailyMissions = generateDailyMissions(loadedData.user.level);
        }

        // Check for daily reset
        const today = new Date().toISOString().split('T')[0];
        if (loadedData.user.lastWorkoutDate && loadedData.user.lastWorkoutDate.split('T')[0] !== today) {
           if (loadedData.dailyMissions.every(m => m.completed)) {
              loadedData.dailyMissions = generateDailyMissions(loadedData.user.level);
           }
        }

        // If logged in but no data, maybe it's a new cloud user
        if (user && !loadedData.user.name) {
          setView('ONBOARDING');
        } else if (!user) {
          setView('LANDING');
        } else if (user && loadedData.user.name && view === 'LANDING') {
          setView('DASHBOARD');
        }

        setData(loadedData);
        setIsAuthReady(true);
      } catch (error) {
        console.error("Initialization error:", error);
        setIsAuthReady(true); // Still set ready to show ErrorBoundary if it crashes later or handle here
      }
    });

    return () => unsubscribe();
  }, []);

  // Auto-Save
  useEffect(() => {
    if (data && isAuthReady) {
      saveGameData(data);
    }
  }, [data, isAuthReady]);

  if (!data || !isAuthReady) return <div className="min-h-screen bg-black flex items-center justify-center text-white font-mono">INITIALIZING SYSTEM...</div>;

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setView('LANDING');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleUpdateUser = (updates: Partial<typeof data.user>) => {
    setData(prev => prev ? { ...prev, user: { ...prev.user, ...updates } } : null);
  };

  const handleUpdateExercises = (exercises: Exercise[]) => {
    setData(prev => prev ? { ...prev, customRoutine: exercises } : null);
  };

  const handleOnboardingComplete = (profile: Partial<typeof data.user>) => {
    handleUpdateUser(profile);
    setView('DASHBOARD');
  };

  const handleSetLanguage = (lang: Language) => {
    handleUpdateUser({ language: lang });
  }

  const handleWorkoutComplete = async (duration: number) => {
    if (!data) return;
    
    const currentRank = RANKS[data.user.rank || 'F'];
    
    // XP Calculation with Rank Multiplier
    let xpEarned = Math.ceil((100 + (duration * 5)) * currentRank.multiplier);
    
    // Mission Progress
    const missions = Array.isArray(data.dailyMissions) ? data.dailyMissions : [];
    const updatedMissions = missions.map(mission => {
      if (mission.completed) return mission;
      
      let newValue = mission.currentValue;
      if (mission.type === 'WORKOUT_COUNT') newValue += 1;
      if (mission.type === 'TIME_MINUTES') newValue += duration;
      if (mission.type === 'XP_EARNED') newValue += xpEarned;
      
      const isNowCompleted = newValue >= mission.targetValue;
      if (isNowCompleted && !mission.completed) {
        xpEarned += mission.rewardXp;
      }

      return {
        ...mission,
        currentValue: newValue,
        completed: isNowCompleted
      };
    });

    let newXp = data.user.currentXp + xpEarned;
    let newLevel = data.user.level;
    
    // Level Up Logic
    while (newXp >= data.user.maxXp) {
      newXp = newXp - data.user.maxXp;
      newLevel += 1;
      data.user.maxXp = newLevel * 100;
    }

    // Rank Update
    const newRank = getRankByLevel(newLevel);

    const session: WorkoutSession = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11),
      date: new Date().toISOString(),
      name: "Custom Protocol",
      exercises: data.customRoutine,
      durationMinutes: duration,
      xpEarned
    };

    // Save to cloud specifically
    await saveWorkoutSession(session);

    const newHistory = [session, ...data.history];

    const today = new Date().toISOString().split('T')[0];
    const lastDate = data.user.lastWorkoutDate ? data.user.lastWorkoutDate.split('T')[0] : null;
    let newStreak = data.user.streak;

    if (lastDate !== today) {
       newStreak += 1;
    }

    // Stat Bonuses from Rank
    const statBonus = currentRank.multiplier > 1.2 ? Math.floor(currentRank.multiplier) : 1;

    setData({
      ...data,
      user: {
        ...data.user,
        level: newLevel,
        currentXp: newXp,
        maxXp: newLevel * 100, 
        totalWorkouts: data.user.totalWorkouts + 1,
        totalTimeMinutes: data.user.totalTimeMinutes + duration,
        streak: newStreak,
        lastWorkoutDate: new Date().toISOString(),
        rank: newRank,
        stats: {
           ...data.user.stats,
           strength: data.user.stats.strength + statBonus,
           endurance: data.user.stats.endurance + (duration > 20 ? statBonus : 0),
           consistency: data.user.stats.consistency + 1
        }
      },
      history: newHistory,
      dailyMissions: updatedMissions
    });
    
    setView('DASHBOARD');
  };

  if (view === 'LANDING') {
    return <Landing onLogin={handleLogin} />;
  }

  if (view === 'ONBOARDING') {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const currentLang = data.user.language || 'en';

  const renderContent = () => {
    switch (view) {
      case 'DASHBOARD':
        return <Dashboard 
          user={data.user} 
          dailyMissions={data.dailyMissions} 
          onStartWorkout={() => setView('CUSTOM_WORKOUT')}
        />;
      case 'PROFILE':
        return <Profile user={data.user} onUpdate={handleUpdateUser} />;
      case 'CUSTOM_WORKOUT':
        return <CustomWorkout 
          exercises={data.customRoutine} 
          setExercises={handleUpdateExercises}
          onStartSession={() => setView('ACTIVE_SESSION')}
          language={currentLang}
        />;
      case 'ACTIVE_SESSION':
        return <ActiveSession 
          exercises={data.customRoutine}
          onComplete={handleWorkoutComplete}
          onCancel={() => setView('CUSTOM_WORKOUT')}
          language={currentLang}
        />;
      case 'AI_GENERATOR':
        return <AIGenerator 
           rank={data.user.rank || 'F'}
           onPlanGenerated={(plan) => {
             handleUpdateExercises(plan);
             setView('CUSTOM_WORKOUT');
           }}
        />;
      case 'COACH':
        return <Coach user={data.user} />;
      case 'PROGRESS':
        return (
          <div className="space-y-6 animate-fade-in">
             <h2 className="text-3xl font-display font-bold text-white">Data Log</h2>
             <Card title="Activity Analysis">
               <div className="h-64">
                 <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={data.history.slice().reverse().map((h, i) => ({ name: i, duration: h.durationMinutes }))}>
                     <XAxis dataKey="name" stroke="#475569" />
                     <YAxis stroke="#475569" />
                     <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a' }} />
                     <Line type="monotone" dataKey="duration" stroke="#06b6d4" strokeWidth={2} dot={{r: 4, fill: '#06b6d4'}} />
                   </LineChart>
                 </ResponsiveContainer>
               </div>
             </Card>
             <div className="space-y-2">
               {data.history.map(session => (
                 <div key={session.id} className="bg-quest-card p-4 rounded-lg border border-quest-border flex justify-between items-center">
                   <div>
                     <p className="font-bold text-white">{new Date(session.date).toLocaleDateString()}</p>
                     <p className="text-sm text-slate-400">{session.name}</p>
                   </div>
                   <div className="text-quest-primary font-mono">+{session.xpEarned} XP</div>
                 </div>
               ))}
             </div>
          </div>
        );
      case 'CALENDAR':
         return (
            <div className="animate-fade-in text-center py-20">
               <CalendarIcon className="w-16 h-16 text-slate-700 mx-auto mb-4" />
               <h2 className="text-2xl font-bold text-white">Schedule Locked</h2>
               <p className="text-slate-500">Feature available in next patch.</p>
            </div>
         );
       case 'INVENTORY':
         return (
            <div className="animate-fade-in text-center py-20">
               <Trophy className="w-16 h-16 text-slate-700 mx-auto mb-4" />
               <h2 className="text-2xl font-bold text-white">Inventory Locked</h2>
               <p className="text-slate-500">Feature available in next patch.</p>
            </div>
         );
       case 'QUESTS':
         return (
             <div className="animate-fade-in text-center py-20">
               <h2 className="text-2xl font-bold text-white">Mission Log</h2>
               <p className="text-slate-500">Additional missions unlocking at Level 5.</p>
            </div>
         );
       case 'SETTINGS':
          return (
             <div className="animate-fade-in space-y-6">
                <h2 className="text-2xl font-bold text-white">System Settings</h2>
                <Card>
                  <div className="space-y-4">
                     <button 
                       onClick={() => {
                         if(confirm("Factory Reset? This action is irreversible.")) {
                            localStorage.clear();
                            window.location.reload();
                         }
                       }}
                       className="w-full p-3 bg-rose-900/20 text-rose-500 border border-rose-900/50 rounded hover:bg-rose-900/40 transition-colors"
                     >
                        Factory Reset
                     </button>
                  </div>
                </Card>
             </div>
          );
      default:
        return <div>View not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-quest-bg text-slate-200 font-sans flex overflow-hidden">
      <Sidebar 
        currentView={view} 
        setView={setView} 
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
        language={currentLang}
        setLanguage={handleSetLanguage}
        user={auth.currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      <main className="flex-1 overflow-y-auto h-screen relative">
        <header className="lg:hidden h-16 border-b border-quest-border flex items-center px-4 justify-between bg-quest-bg/90 backdrop-blur sticky top-0 z-20">
          <span className="font-display font-bold text-white tracking-widest">IRON<span className="text-quest-primary">QUEST</span></span>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-slate-300">
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;