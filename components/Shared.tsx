import React from 'react';

export const Card: React.FC<{ children: React.ReactNode; className?: string; title?: string }> = ({ children, className = '', title }) => (
  <div className={`bg-quest-card border border-quest-border rounded-xl shadow-lg overflow-hidden ${className}`}>
    {title && (
      <div className="bg-quest-bg/50 px-6 py-4 border-b border-quest-border flex items-center justify-between">
        <h3 className="text-lg font-bold text-white font-display tracking-wide">{title}</h3>
        <div className="h-1 w-8 bg-quest-primary rounded-full"></div>
      </div>
    )}
    <div className="p-6">
      {children}
    </div>
  </div>
);

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' }> = 
  ({ children, className = '', variant = 'primary', ...props }) => {
    const baseStyles = "px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide";
    const variants = {
      primary: "bg-quest-primary hover:bg-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]",
      secondary: "bg-quest-secondary hover:bg-violet-400 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]",
      danger: "bg-rose-600 hover:bg-rose-500 text-white",
      ghost: "bg-transparent hover:bg-quest-border text-slate-400 hover:text-white",
      outline: "bg-transparent border border-quest-border hover:border-quest-primary text-slate-300 hover:text-white"
    };

    return (
      <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
        {children}
      </button>
    );
};

export const ProgressBar: React.FC<{ value: number; max: number; color?: string; label?: string; showText?: boolean }> = ({ value, max, color = "bg-quest-success", label, showText = true }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
          <span>{label}</span>
          {showText && <span>{value} / {max}</span>}
        </div>
      )}
      <div className="w-full bg-quest-bg rounded-full h-2 border border-quest-border overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-500 ease-out ${color} relative shadow-[0_0_10px_currentColor]`} 
          style={{ width: `${percentage}%` }}
        >
        </div>
      </div>
    </div>
  );
};

export const StatBar: React.FC<{ label: string; value: number; icon?: React.ReactNode; color?: string }> = ({ label, value, icon, color = "bg-blue-500" }) => (
  <div className="mb-4 group">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2 text-slate-400 group-hover:text-white transition-colors">
        {icon}
        <span className="font-medium text-sm">{label}</span>
      </div>
      <span className="text-white font-bold font-mono">{value}</span>
    </div>
    <div className="h-1.5 bg-quest-bg rounded-full overflow-hidden border border-quest-border/50">
      <div className={`h-full ${color} shadow-[0_0_8px_currentColor]`} style={{ width: `${Math.min(100, value)}%` }} />
    </div>
  </div>
);