import React from 'react';
import { 
  LayoutDashboard, 
  User, 
  Target, 
  Dumbbell, 
  Bot, 
  MessageSquare, 
  TrendingUp, 
  Box, 
  Calendar, 
  Settings,
  Languages,
  LogIn,
  LogOut
} from 'lucide-react';
import { ViewState, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  user: any;
  onLogin: () => void;
  onLogout: () => void;
}

const NAV_ITEMS = (lang: Language): { id: ViewState; label: string; icon: React.ElementType }[] => {
  const t = TRANSLATIONS[lang];
  return [
    { id: 'DASHBOARD', label: t.dashboard, icon: LayoutDashboard },
    { id: 'PROFILE', label: t.profile, icon: User },
    { id: 'QUESTS', label: t.missions, icon: Target },
    { id: 'CUSTOM_WORKOUT', label: t.customWorkout, icon: Dumbbell },
    { id: 'AI_GENERATOR', label: "AI Architect", icon: Bot },
    { id: 'COACH', label: t.aiCoach, icon: MessageSquare },
    { id: 'PROGRESS', label: t.dataLog, icon: TrendingUp },
    { id: 'INVENTORY', label: "Inventory", icon: Box },
    { id: 'CALENDAR', label: "Calendar", icon: Calendar },
    { id: 'SETTINGS', label: t.settings, icon: Settings },
  ];
};

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isMobileOpen, setIsMobileOpen, language, setLanguage, user, onLogin, onLogout }) => {
  const t = TRANSLATIONS[language];
  
  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-30 h-full w-64 bg-quest-bg border-r border-quest-border
        transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static flex flex-col
      `}>
        <div className="flex items-center justify-center h-20 border-b border-quest-border bg-quest-bg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-quest-primary/5 to-transparent"></div>
          <h1 className="text-2xl font-display font-bold text-white tracking-widest relative z-10">
            IRON<span className="text-quest-primary">QUEST</span>
          </h1>
        </div>
        
        <nav className="p-4 space-y-1 overflow-y-auto flex-1">
          {NAV_ITEMS(language).map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setView(item.id);
                setIsMobileOpen(false);
              }}
              className={`
                flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group
                ${currentView === item.id 
                  ? 'bg-quest-card text-quest-primary border border-quest-border shadow-lg shadow-black/20' 
                  : 'text-slate-500 hover:bg-quest-card hover:text-slate-200'}
              `}
            >
              <item.icon className={`w-5 h-5 mr-3 transition-colors ${currentView === item.id ? 'text-quest-primary drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]' : 'group-hover:text-slate-300'}`} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-quest-border space-y-4">
           {/* Language Toggle */}
           <div className="flex items-center justify-between px-2 bg-quest-card p-2 rounded-lg border border-quest-border">
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                 <Languages className="w-4 h-4" />
                 <span>Language</span>
              </div>
              <div className="flex gap-1">
                 <button 
                   onClick={() => setLanguage('en')}
                   className={`px-2 py-1 text-xs rounded ${language === 'en' ? 'bg-quest-primary text-black font-bold' : 'text-slate-500 hover:text-white'}`}
                 >
                   EN
                 </button>
                 <button 
                   onClick={() => setLanguage('id')}
                   className={`px-2 py-1 text-xs rounded ${language === 'id' ? 'bg-quest-primary text-black font-bold' : 'text-slate-500 hover:text-white'}`}
                 >
                   ID
                 </button>
              </div>
           </div>

           {/* Auth Button */}
           {user ? (
             <button 
               onClick={onLogout}
               className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 text-rose-500 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20"
             >
               <LogOut className="w-5 h-5 mr-3" />
               {language === 'id' ? 'Keluar' : 'Logout'}
             </button>
           ) : (
             <button 
               onClick={onLogin}
               className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 text-quest-primary hover:bg-quest-primary/10 border border-transparent hover:border-quest-primary/20"
             >
               <LogIn className="w-5 h-5 mr-3" />
               {language === 'id' ? 'Masuk Cloud' : 'Cloud Login'}
             </button>
           )}

          <div className="text-xs text-slate-600 text-center font-mono">V 1.2.0 SYSTEM ONLINE</div>
        </div>
      </aside>
    </>
  );
};