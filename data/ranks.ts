import { RankInfo, RankType } from '../types';

export const RANKS: Record<RankType, RankInfo> = {
  'F': {
    type: 'F',
    label: 'F-Rank Rookie',
    minLevel: 1,
    multiplier: 1.0,
    benefit: 'Standard XP gain.',
    benefitId: 'XP standar.',
    color: 'text-slate-500'
  },
  'E': {
    type: 'E',
    label: 'E-Rank Novice',
    minLevel: 5,
    multiplier: 1.1,
    benefit: '10% XP Bonus.',
    benefitId: 'Bonus XP 10%.',
    color: 'text-green-500'
  },
  'D': {
    type: 'D',
    label: 'D-Rank Soldier',
    minLevel: 10,
    multiplier: 1.2,
    benefit: '20% XP Bonus.',
    benefitId: 'Bonus XP 20%.',
    color: 'text-blue-500'
  },
  'C': {
    type: 'C',
    label: 'C-Rank Warrior',
    minLevel: 20,
    multiplier: 1.3,
    benefit: '30% XP Bonus, +1 STR per workout.',
    benefitId: 'Bonus XP 30%, +1 STR tiap latihan.',
    color: 'text-yellow-500'
  },
  'B': {
    type: 'B',
    label: 'B-Rank Knight',
    minLevel: 35,
    multiplier: 1.5,
    benefit: '50% XP Bonus, +2 STR per workout.',
    benefitId: 'Bonus XP 50%, +2 STR tiap latihan.',
    color: 'text-orange-500'
  },
  'A': {
    type: 'A',
    label: 'A-Rank Master',
    minLevel: 50,
    multiplier: 1.8,
    benefit: '80% XP Bonus, +3 STR/END per workout.',
    benefitId: 'Bonus XP 80%, +3 STR/END tiap latihan.',
    color: 'text-red-500'
  },
  'S': {
    type: 'S',
    label: 'S-Rank Hero',
    minLevel: 75,
    multiplier: 2.2,
    benefit: '120% XP Bonus, +5 All Stats per workout.',
    benefitId: 'Bonus XP 120%, +5 Semua Stat tiap latihan.',
    color: 'text-purple-500'
  },
  'S+': {
    type: 'S+',
    label: 'S+-Rank Legend',
    minLevel: 100,
    multiplier: 3.0,
    benefit: '200% XP Bonus, +10 All Stats per workout.',
    benefitId: 'Bonus XP 200%, +10 Semua Stat tiap latihan.',
    color: 'text-cyan-400'
  },
  'S++': {
    type: 'S++',
    label: 'S++-Rank Sovereign',
    minLevel: 150,
    multiplier: 5.0,
    benefit: '400% XP Bonus, God-like Stat Gain.',
    benefitId: 'Bonus XP 400%, Stat Dewa.',
    color: 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]'
  }
};

export const getRankByLevel = (level: number): RankType => {
  const rankTypes: RankType[] = ['S++', 'S+', 'S', 'A', 'B', 'C', 'D', 'E', 'F'];
  for (const type of rankTypes) {
    if (level >= RANKS[type].minLevel) return type;
  }
  return 'F';
};
