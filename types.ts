export type ViewState = 
  | 'LANDING'
  | 'ONBOARDING'
  | 'DASHBOARD' 
  | 'PROFILE' 
  | 'QUESTS' 
  | 'CUSTOM_WORKOUT' 
  | 'AI_GENERATOR' 
  | 'COACH' 
  | 'PROGRESS' 
  | 'INVENTORY' 
  | 'CALENDAR' 
  | 'SETTINGS'
  | 'ACTIVE_SESSION';

export type Language = 'en' | 'id';

export type RankType = 'F' | 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'S+' | 'S++';

export interface RankInfo {
  type: RankType;
  label: string;
  minLevel: number;
  multiplier: number; // XP/Stat multiplier
  benefit: string;
  benefitId: string;
  color: string;
}

export interface Mission {
  id: string;
  title: string;
  titleId: string;
  description: string;
  descriptionId: string;
  rewardXp: number;
  completed: boolean;
  targetValue: number;
  currentValue: number;
  type: 'WORKOUT_COUNT' | 'TIME_MINUTES' | 'XP_EARNED' | 'STREAK_DAYS';
}

export enum StatType {
  STRENGTH = 'Strength',
  ENDURANCE = 'Endurance',
  MOBILITY = 'Mobility',
  CONSISTENCY = 'Consistency'
}

export interface UserStats {
  strength: number;
  endurance: number;
  mobility: number;
  consistency: number;
}

export interface UserProfile {
  name: string;
  age: number | null;
  height: number | null; // cm
  weight: number | null; // kg
  goal: 'Lose Weight' | 'Build Muscle' | 'Stay Active' | null;
  abilityLevel: 'Beginner' | 'Intermediate' | 'Advanced' | null;
  notes: string;
  language: Language;
  
  level: number;
  currentXp: number;
  maxXp: number;
  streak: number;
  lastWorkoutDate: string | null; // ISO date string
  stats: UserStats;
  badges: string[]; // Badge IDs
  weightHistory: { date: string; weight: number }[];
  totalWorkouts: number;
  totalTimeMinutes: number;
  maxPushups: number;
  rank: RankType;
}

export type ExerciseType = 'REPS' | 'MINUTES';

export interface Exercise {
  id: string;
  name: string;
  type: ExerciseType;
  target: number; // Reps or Minutes count
  sets: number;
  description?: string;
  completed?: boolean;
}

export interface ExerciseInfo {
  name: string;
  nameId: string; // Indonesian Name
  description: string;
  descriptionId: string; // Indonesian Description
  videoId: string; // YouTube ID only
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  muscleGroup: string;
}

export interface WorkoutSession {
  id: string;
  date: string;
  name: string;
  exercises: Exercise[];
  durationMinutes: number;
  xpEarned: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (user: UserProfile) => boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface AppState {
  user: UserProfile;
  customRoutine: Exercise[];
  history: WorkoutSession[];
  dailyMissions: Mission[];
}

export const INITIAL_USER: UserProfile = {
  name: '',
  age: null,
  height: null,
  weight: null,
  goal: null,
  abilityLevel: null,
  notes: '',
  language: 'en', // Default
  
  level: 1,
  currentXp: 0,
  maxXp: 100,
  streak: 0,
  lastWorkoutDate: null,
  stats: {
    strength: 10,
    endurance: 10,
    mobility: 10,
    consistency: 0,
  },
  badges: [],
  weightHistory: [],
  totalWorkouts: 0,
  totalTimeMinutes: 0,
  maxPushups: 0,
  rank: 'F',
};
