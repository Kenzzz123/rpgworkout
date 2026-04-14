import React from 'react';
import { ExerciseInfo } from '../types';
import { X, ExternalLink, Play } from 'lucide-react';

interface ExerciseModalProps {
  info: ExerciseInfo | null;
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'id';
}

export const ExerciseModal: React.FC<ExerciseModalProps> = ({ info, isOpen, onClose, language }) => {
  if (!isOpen || !info) return null;

  const name = language === 'id' && info.nameId ? info.nameId : info.name;
  const description = language === 'id' && info.descriptionId ? info.descriptionId : info.description;
  const videoId = info.videoId || 'IODxDxX7oi4';
  
  // Standard Youtube Embed which is more reliable than nocookie for some videos
  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-quest-card border border-quest-border w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden relative flex flex-col md:flex-row h-[85vh] md:h-auto max-h-[85vh]">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-quest-primary text-white rounded-full transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Video Section */}
        <div className="w-full md:w-3/5 bg-black flex items-center justify-center relative group h-1/2 md:h-auto">
          <iframe 
            src={embedUrl}
            title={name}
            className="w-full h-full absolute inset-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>

        {/* Info Section */}
        <div className="w-full md:w-2/5 p-6 md:p-8 flex flex-col overflow-y-auto bg-gradient-to-b from-quest-card to-black h-1/2 md:h-auto">
          <h3 className="text-3xl font-display font-bold text-white mb-3 tracking-wide">{name}</h3>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <span className={`px-3 py-1 rounded text-xs font-bold border uppercase tracking-wider ${
              info.difficulty === 'Beginner' ? 'border-green-500 text-green-500 bg-green-500/10' :
              info.difficulty === 'Intermediate' ? 'border-yellow-500 text-yellow-500 bg-yellow-500/10' :
              'border-red-500 text-red-500 bg-red-500/10'
            }`}>
              {info.difficulty}
            </span>
            <span className="px-3 py-1 rounded text-xs font-bold border border-quest-secondary text-quest-secondary bg-quest-secondary/10 uppercase tracking-wider">
              {info.muscleGroup}
            </span>
          </div>

          <div className="space-y-6 text-sm text-slate-300 flex-1">
            <div>
              <h4 className="text-quest-primary font-bold mb-2 uppercase text-xs tracking-widest border-b border-quest-primary/20 pb-1">
                 {language === 'id' ? 'CARA LATIHAN' : 'PROPER FORM'}
              </h4>
              <p className="leading-relaxed">{description}</p>
            </div>
            
            <div className="p-4 bg-quest-bg rounded-xl border border-quest-border relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-quest-primary"></div>
              <h4 className="text-white font-bold mb-1 flex items-center gap-2">
                 <Play className="w-3 h-3 text-quest-primary fill-current" /> 
                 {language === 'id' ? 'TIPS SUHU' : 'PRO TIP'}
              </h4>
              <p className="text-xs text-slate-400 italic">
                {language === 'id' 
                 ? 'Fokus gerakan pelan tapi pasti. Kualitas lebih penting daripada jumlah biar XP deres!' 
                 : 'Focus on slow, controlled movements. Quality over quantity ensures better XP gain and safety.'}
              </p>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-quest-border/50">
            <a 
              href={`https://www.youtube.com/results?search_query=how+to+do+${info.name}+exercise`} 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2 text-xs text-slate-500 hover:text-white transition-colors group"
            >
              <ExternalLink className="w-3 h-3 group-hover:text-quest-primary" /> 
              {language === 'id' ? 'Cari video lain di YouTube' : 'Find alternative videos'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};