import React from 'react';
import { UserProfile, StatType } from '../types';
import { Card, StatBar, ProgressBar } from '../components/Shared';
import { Shield, BicepsFlexed, Zap, Clock, Medal } from 'lucide-react';

export const Character: React.FC<{ user: UserProfile }> = ({ user }) => {
  return (
    <div className="space-y-6 animate-fade-in">
       <div className="flex items-center gap-6 mb-8">
          <div className="w-32 h-32 bg-slate-800 rounded-full border-4 border-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
             <UserAvatarIcon className="w-20 h-20 text-slate-400" />
          </div>
          <div>
            <h2 className="text-4xl font-rpg font-bold text-white mb-2">{user.name}</h2>
            <div className="flex items-center gap-4 text-sm text-slate-400">
               <span className="px-3 py-1 bg-slate-800 rounded border border-slate-600">Level {user.level}</span>
               <span className="flex items-center gap-1 text-quest-gold"><Medal className="w-4 h-4"/> Rank: Novice</span>
            </div>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Core Stats */}
         <Card title="Attributes">
           <div className="space-y-6">
              <StatBar 
                label="Strength (Push Power)" 
                value={user.stats.strength} 
                icon={<BicepsFlexed className="w-4 h-4 text-red-400"/>} 
                color="bg-red-500" 
              />
              <StatBar 
                label="Endurance (Stamina)" 
                value={user.stats.endurance} 
                icon={<Clock className="w-4 h-4 text-blue-400"/>} 
                color="bg-blue-500" 
              />
              <StatBar 
                label="Mobility (Flexibility)" 
                value={user.stats.mobility} 
                icon={<Zap className="w-4 h-4 text-yellow-400"/>} 
                color="bg-yellow-500" 
              />
              <StatBar 
                label="Consistency (Willpower)" 
                value={user.stats.consistency} 
                icon={<Shield className="w-4 h-4 text-emerald-400"/>} 
                color="bg-emerald-500" 
              />
           </div>
         </Card>

         {/* XP Progress */}
         <Card title="Progression">
           <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2 text-sm text-slate-300">
                  <span>Current Level Progress</span>
                  <span className="font-mono text-emerald-400">{user.currentXp} / {user.maxXp} XP</span>
                </div>
                <ProgressBar value={user.currentXp} max={user.maxXp} />
              </div>
              
              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 mt-4">
                <h4 className="font-bold text-white mb-2 text-sm uppercase tracking-wider">Next Reward</h4>
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-slate-800 rounded border border-slate-600 flex items-center justify-center">
                     <span className="text-xl">🎁</span>
                   </div>
                   <div className="text-sm text-slate-400">
                     <p className="text-white font-medium">Level {user.level + 1} Badge</p>
                     <p>Unlock new custom avatar features.</p>
                   </div>
                </div>
              </div>
           </div>
         </Card>
       </div>
    </div>
  );
};

const UserAvatarIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);