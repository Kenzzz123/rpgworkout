import React, { useState } from 'react';
import { UserProfile, RankType } from '../types';
import { Card, StatBar, ProgressBar, Button } from '../components/Shared';
import { Shield, Activity, Zap, Clock, Medal, User, Edit2, Save, Scale, Target, Star, Award, Crown } from 'lucide-react';
import { RANKS } from '../data/ranks';

interface ProfileProps {
  user: UserProfile;
  onUpdate: (updates: Partial<UserProfile>) => void;
}

const RankBadge = ({ rank }: { rank: RankType }) => {
  const rankInfo = RANKS[rank];
  const Icon = rank.includes('S') ? Crown : rank === 'A' ? Award : Star;
  
  return (
    <div className="flex items-center gap-3 bg-quest-card border border-quest-border p-3 rounded-xl">
      <div className={`p-2 rounded-lg bg-black border ${rankInfo.color.replace('text-', 'border-').replace('drop-shadow-', '')}`}>
        <Icon className={`w-6 h-6 ${rankInfo.color}`} />
      </div>
      <div>
        <p className={`text-sm font-bold ${rankInfo.color}`}>RANK {rank}</p>
        <p className="text-[10px] text-slate-500 uppercase tracking-wider">{rankInfo.label}</p>
      </div>
    </div>
  );
};

export const Profile: React.FC<ProfileProps> = ({ user, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user.name,
    weight: user.weight,
    goal: user.goal,
    abilityLevel: user.abilityLevel
  });

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  const currentRank = RANKS[user.rank || 'F'];

  return (
    <div className="space-y-6 animate-fade-in">
       {/* Header */}
       <div className="relative rounded-2xl bg-gradient-to-r from-quest-card to-quest-bg border border-quest-border p-8 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-quest-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
             <div className="w-32 h-32 rounded-full bg-black border-2 border-quest-primary p-1 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                <div className="w-full h-full rounded-full bg-quest-card flex items-center justify-center overflow-hidden">
                  <User className="w-16 h-16 text-slate-500" />
                </div>
             </div>
             
             <div className="flex-1 text-center md:text-left space-y-2">
                {isEditing ? (
                  <input 
                    type="text" 
                    value={editData.name}
                    onChange={e => setEditData({...editData, name: e.target.value})}
                    className="bg-black/50 border border-quest-border text-2xl font-display font-bold text-white rounded px-2 py-1 outline-none focus:border-quest-primary"
                  />
                ) : (
                  <h2 className="text-3xl font-display font-bold text-white">{user.name}</h2>
                )}
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-slate-400">
                   <span className="px-3 py-1 bg-quest-card rounded border border-quest-border text-quest-primary font-mono">Level {user.level}</span>
                   <span className="flex items-center gap-1"><Medal className="w-4 h-4 text-quest-secondary"/> {user.abilityLevel}</span>
                   <span className="flex items-center gap-1"><Target className="w-4 h-4 text-quest-accent"/> {user.goal}</span>
                </div>
             </div>

             <div className="flex flex-col gap-2">
               <RankBadge rank={user.rank || 'F'} />
               <Button variant={isEditing ? 'primary' : 'outline'} onClick={isEditing ? handleSave : () => setIsEditing(true)}>
                 {isEditing ? <><Save className="w-4 h-4"/> Save Profile</> : <><Edit2 className="w-4 h-4"/> Edit Profile</>}
               </Button>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Stats */}
         <div className="lg:col-span-2 space-y-6">
            <Card title="Rank Benefits">
              <div className="p-4 bg-quest-bg border border-quest-border rounded-xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-full bg-black border ${currentRank.color.replace('text-', 'border-').replace('drop-shadow-', '')}`}>
                    <Star className={`w-6 h-6 ${currentRank.color}`} />
                  </div>
                  <div>
                    <h4 className={`font-bold ${currentRank.color}`}>{currentRank.label} Privileges</h4>
                    <p className="text-xs text-slate-400">Active benefits for your current rank</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-quest-card rounded-lg border border-quest-border">
                    <span className="text-sm text-slate-300">XP Multiplier</span>
                    <span className="text-sm font-bold text-quest-primary">x{currentRank.multiplier.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-quest-card rounded-lg border border-quest-border">
                    <span className="text-sm text-slate-300">Stat Bonus</span>
                    <span className="text-sm font-bold text-quest-secondary">{user.language === 'id' ? currentRank.benefitId : currentRank.benefit}</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Performance Stats">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <StatBar label="Strength" value={user.stats.strength} icon={<Activity className="w-4 h-4"/>} color="bg-rose-500" />
                  <StatBar label="Endurance" value={user.stats.endurance} icon={<Clock className="w-4 h-4"/>} color="bg-blue-500" />
                  <StatBar label="Mobility" value={user.stats.mobility} icon={<Zap className="w-4 h-4"/>} color="bg-yellow-500" />
                  <StatBar label="Consistency" value={user.stats.consistency} icon={<Shield className="w-4 h-4"/>} color="bg-emerald-500" />
               </div>
            </Card>

            <Card title="Physical Metrics">
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-quest-bg p-4 rounded-lg border border-quest-border">
                     <p className="text-slate-400 text-xs uppercase mb-1">Current Weight</p>
                     {isEditing ? (
                       <div className="flex items-center gap-2">
                         <input 
                           type="number" 
                           value={editData.weight || ''} 
                           onChange={e => setEditData({...editData, weight: Number(e.target.value)})}
                           className="w-20 bg-black border border-quest-border rounded px-2 py-1 text-white outline-none"
                         />
                         <span className="text-slate-500">kg</span>
                       </div>
                     ) : (
                       <p className="text-2xl font-mono text-white flex items-center gap-2">
                         <Scale className="w-5 h-5 text-quest-primary"/> {user.weight} <span className="text-sm text-slate-500">kg</span>
                       </p>
                     )}
                  </div>
                   <div className="bg-quest-bg p-4 rounded-lg border border-quest-border">
                     <p className="text-slate-400 text-xs uppercase mb-1">Max Push-ups</p>
                     <p className="text-2xl font-mono text-white flex items-center gap-2">
                       <Activity className="w-5 h-5 text-quest-secondary"/> {user.maxPushups}
                     </p>
                  </div>
               </div>
            </Card>
         </div>

         {/* Level Progression */}
         <div className="space-y-6">
            <Card title="Level Progress">
               <div className="text-center mb-6">
                  <div className="inline-block relative">
                     <svg className="w-32 h-32 transform -rotate-90">
                        <circle cx="64" cy="64" r="60" stroke="#27272a" strokeWidth="8" fill="transparent" />
                        <circle cx="64" cy="64" r="60" stroke="#06b6d4" strokeWidth="8" fill="transparent" 
                           strokeDasharray={377} strokeDashoffset={377 - (377 * user.currentXp / user.maxXp)} className="transition-all duration-1000 ease-out" />
                     </svg>
                     <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <span className="text-3xl font-bold text-white">{Math.round((user.currentXp / user.maxXp) * 100)}%</span>
                        <span className="text-xs text-slate-500">to Level {user.level + 1}</span>
                     </div>
                  </div>
               </div>
               <div className="space-y-2">
                  <div className="flex justify-between text-sm text-slate-300">
                     <span>Current XP</span>
                     <span className="font-mono text-quest-primary">{user.currentXp} / {user.maxXp}</span>
                  </div>
                  <ProgressBar value={user.currentXp} max={user.maxXp} showText={false} color="bg-gradient-to-r from-quest-primary to-blue-500" />
                  <p className="text-xs text-slate-500 mt-2 text-center">Complete missions to earn XP</p>
               </div>
            </Card>
         </div>
       </div>
    </div>
  );
};