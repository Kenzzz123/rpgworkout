import React from 'react';
import { UserProfile, Mission, RankType } from '../types';
import { Card, Button } from '../components/Shared';
import { Flame, Trophy, Shield, Activity, Zap, Target, ArrowRight, Star, Award, Crown } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';
import { RANKS } from '../data/ranks';

interface DashboardProps {
  user: UserProfile;
  dailyMissions: Mission[];
  onStartWorkout: () => void;
}

const RankLogo = ({ rank, className }: { rank: RankType; className?: string }) => {
  const rankInfo = RANKS[rank];
  const Icon = rank.includes('S') ? Crown : rank === 'A' ? Award : Star;
  
  return (
    <div className={`relative ${className}`}>
      <div className={`w-24 h-24 rounded-full bg-black border-2 flex items-center justify-center shadow-lg transition-all duration-500 ${rankInfo.color.replace('text-', 'border-').replace('drop-shadow-', '')}`}>
         <Icon className={`w-12 h-12 ${rankInfo.color}`} />
      </div>
      <div className={`absolute -bottom-2 -right-2 bg-quest-card border rounded-lg px-3 py-1 flex items-center justify-center text-sm font-bold shadow-xl ${rankInfo.color.replace('text-', 'border-')}`}>
        RANK {rank}
      </div>
    </div>
  );
};

export const Dashboard: React.FC<DashboardProps> = ({ user, dailyMissions, onStartWorkout }) => {
  const xpPercentage = (user.currentXp / user.maxXp) * 100;
  const t = TRANSLATIONS[user.language || 'en'];
  const currentRank = RANKS[user.rank || 'F'];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 relative overflow-hidden border-quest-primary/20">
          <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-quest-primary/10 to-transparent pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
            <RankLogo rank={user.rank || 'F'} />
            
            <div className="flex-1 w-full text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                 <h2 className="text-3xl font-display font-bold text-white tracking-wide">
                  {user.name || "Agent"}
                </h2>
                <span className={`px-2 py-0.5 rounded-full bg-quest-secondary/10 border border-quest-secondary/30 text-xs font-bold ${currentRank.color}`}>
                  {currentRank.label}
                </span>
              </div>
              <p className="text-slate-400 text-sm mb-2 italic">Benefit: {user.language === 'id' ? currentRank.benefitId : currentRank.benefit}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-quest-primary font-mono font-bold tracking-wider">
                  <span>LEVEL {user.level} PROGRESS</span>
                  <span>{user.currentXp} / {user.maxXp} {t.xp}</span>
                </div>
                <div className="h-2 bg-quest-bg rounded-full border border-quest-border overflow-hidden relative group">
                  <div 
                    className="h-full bg-quest-primary shadow-[0_0_10px_#06b6d4] transition-all duration-700 relative"
                    style={{ width: `${xpPercentage}%` }}
                  >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="flex flex-col items-center justify-center text-center border-quest-accent/30 bg-gradient-to-b from-quest-card to-quest-accent/5">
          <div className="mb-2 p-3 bg-quest-accent/10 rounded-full animate-pulse-slow border border-quest-accent/20">
            <Flame className="w-8 h-8 text-quest-accent" />
          </div>
          <h3 className="text-4xl font-display font-bold text-white mb-1">{user.streak}</h3>
          <p className="text-slate-400 text-xs uppercase tracking-widest font-semibold">{t.streak}</p>
          <div className="mt-4 text-xs text-quest-accent font-mono border border-quest-accent/30 px-2 py-1 rounded bg-quest-accent/5">
            MAINTAIN MOMENTUM
          </div>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         {[
           { label: t.workouts, val: user.totalWorkouts, icon: Activity, color: 'text-quest-primary' },
           { label: t.minutes, val: user.totalTimeMinutes, icon: Zap, color: 'text-quest-secondary' },
           { label: t.badges, val: user.badges.length, icon: Trophy, color: 'text-yellow-500' },
           { label: t.consistency, val: user.stats.consistency, icon: Shield, color: 'text-quest-success' }
         ].map((stat, i) => (
           <div key={i} className="bg-quest-card p-4 rounded-xl border border-quest-border flex flex-col items-center justify-center gap-2 hover:border-slate-600 transition-colors">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <div className="text-center">
                <p className="text-2xl font-bold text-white font-mono">{stat.val}</p>
                <p className="text-slate-500 text-[10px] uppercase tracking-wider">{stat.label}</p>
              </div>
           </div>
         ))}
      </div>

      {/* Daily Missions */}
      <div className="space-y-4">
        <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-quest-primary" />
          {t.dailyDirective}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dailyMissions.map((mission) => (
            <Card key={mission.id} className={`relative overflow-hidden border-l-4 ${mission.completed ? 'border-quest-success bg-quest-success/5' : 'border-quest-primary bg-quest-card'}`}>
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-white">{user.language === 'id' ? mission.titleId : mission.title}</h4>
                    {mission.completed && <Trophy className="w-4 h-4 text-quest-success" />}
                  </div>
                  <p className="text-xs text-slate-400 mb-3">{user.language === 'id' ? mission.descriptionId : mission.description}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-slate-500">PROGRESS</span>
                    <span className="text-quest-primary">{mission.currentValue} / {mission.targetValue}</span>
                  </div>
                  <div className="h-1.5 bg-quest-bg rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${mission.completed ? 'bg-quest-success' : 'bg-quest-primary'}`}
                      style={{ width: `${Math.min(100, (mission.currentValue / mission.targetValue) * 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-[10px] text-quest-success font-bold text-right">
                    +{mission.rewardXp} XP
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <Button 
          onClick={onStartWorkout}
          className="w-full py-4 animate-pulse shadow-[0_0_15px_rgba(6,182,212,0.2)]"
        >
          {t.startWorkout} <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
