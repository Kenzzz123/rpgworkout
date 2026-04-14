import React, { useState } from 'react';
import { Button } from '../components/Shared';
import { Shield, Zap, Trophy, Sword, Sparkles, LogIn } from 'lucide-react';

interface LandingProps {
  onLogin: (email?: string, password?: string, isSignUp?: boolean) => void;
  isLoggingIn?: boolean;
  loginError?: string | null;
}

export const Landing: React.FC<LandingProps> = ({ onLogin, isLoggingIn, loginError }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    onLogin(email, password, isSignUp);
  };
  return (
    <div className="min-h-screen bg-black text-white selection:bg-quest-primary selection:text-black overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative pt-20 pb-32 flex flex-col items-center justify-center px-4">
        {/* Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-quest-primary/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-quest-secondary/5 rounded-full blur-[100px] -z-10"></div>

        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-quest-card border border-quest-border animate-bounce">
            <Sparkles className="w-4 h-4 text-quest-primary" />
            <span className="text-xs font-mono tracking-widest text-quest-primary uppercase">The RPG Fitness Revolution</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-display font-black tracking-tighter leading-none">
            LEVEL UP YOUR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-quest-primary via-quest-secondary to-quest-accent">REAL LIFE STATS</span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
            Transform your workouts into an epic RPG quest. Track progress, earn ranks, 
            and build your character while building your body.
          </p>

          <div className="pt-8 flex flex-col items-center justify-center gap-4 w-full max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="w-full space-y-4 bg-quest-card/50 p-6 rounded-2xl border border-quest-border backdrop-blur-sm">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1 text-left">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/50 border border-quest-border rounded-lg p-3 text-white focus:border-quest-primary outline-none transition-colors"
                  placeholder="hero@ironquest.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1 text-left">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/50 border border-quest-border rounded-lg p-3 text-white focus:border-quest-primary outline-none transition-colors"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>

              <button 
                type="submit"
                disabled={isLoggingIn}
                className={`w-full group relative px-8 py-4 bg-quest-primary text-black font-display font-black text-lg rounded-xl transition-all ${isLoggingIn ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] active:scale-95'}`}
              >
                <div className="flex items-center justify-center gap-3">
                  {isLoggingIn ? (
                    <div className="w-5 h-5 border-4 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Sword className="w-5 h-5 animate-pulse" />
                  )}
                  {isLoggingIn ? 'CONNECTING...' : (isSignUp ? 'CREATE CHARACTER' : 'ENTER REALM')}
                </div>
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-sm text-slate-400 hover:text-quest-primary transition-colors"
                >
                  {isSignUp ? 'Already have an account? Login' : 'New hero? Create an account'}
                </button>
              </div>
            </form>
            
            {loginError && (
              <div className="w-full p-4 bg-rose-900/50 border border-rose-500/50 rounded-xl text-rose-200 text-sm animate-fade-in text-center">
                {loginError}
              </div>
            )}
          </div>
        </div>

        {/* Floating Icons */}
        <div className="absolute top-1/4 left-10 animate-float opacity-20 hidden lg:block">
          <Shield className="w-20 h-20 text-quest-primary" />
        </div>
        <div className="absolute bottom-1/4 right-10 animate-float-delayed opacity-20 hidden lg:block">
          <Zap className="w-20 h-20 text-quest-secondary" />
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 py-24 border-t border-quest-border/30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Trophy className="w-8 h-8 text-quest-primary" />}
            title="Rank System"
            description="Progress from Rank F to S++. Unlock exclusive benefits and multipliers as you grow stronger."
          />
          <FeatureCard 
            icon={<Zap className="w-8 h-8 text-quest-secondary" />}
            title="AI Coach"
            description="Personalized workout plans generated by Gemini AI, tailored to your rank and goals."
          />
          <FeatureCard 
            icon={<Shield className="w-8 h-8 text-quest-accent" />}
            title="Daily Missions"
            description="Complete 3 unique missions every day to earn XP and maintain your consistency streak."
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 border-t border-quest-border/10 text-center text-slate-600 font-mono text-sm">
        <p>© 2026 IRON QUEST // NO LIMITS // ONLY PROGRESS</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="p-8 rounded-3xl bg-quest-card border border-quest-border hover:border-quest-primary/50 transition-all group">
    <div className="mb-6 p-4 rounded-2xl bg-black border border-quest-border w-fit group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-2xl font-display font-bold text-white mb-4">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{description}</p>
  </div>
);
