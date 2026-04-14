import { Mission } from '../types';

export const MISSION_TEMPLATES: Omit<Mission, 'id' | 'completed' | 'currentValue' | 'targetValue'>[] = [
  {
    title: "Morning Routine",
    titleId: "Rutinitas Pagi",
    description: "Complete 1 workout session.",
    descriptionId: "Selesaikan 1 sesi latihan.",
    rewardXp: 50,
    type: 'WORKOUT_COUNT'
  },
  {
    title: "Iron Will",
    titleId: "Tekad Besi",
    description: "Train for 15 minutes.",
    descriptionId: "Latihan selama 15 menit.",
    rewardXp: 75,
    type: 'TIME_MINUTES'
  },
  {
    title: "XP Hunter",
    titleId: "Pemburu XP",
    description: "Earn 200 XP from workouts.",
    descriptionId: "Dapatkan 200 XP dari latihan.",
    rewardXp: 100,
    type: 'XP_EARNED'
  },
  {
    title: "Consistency is Key",
    titleId: "Konsistensi adalah Kunci",
    description: "Maintain a 2-day streak.",
    descriptionId: "Pertahankan streak 2 hari.",
    rewardXp: 150,
    type: 'STREAK_DAYS'
  },
  {
    title: "Double Duty",
    titleId: "Tugas Ganda",
    description: "Complete 2 workout sessions.",
    descriptionId: "Selesaikan 2 sesi latihan.",
    rewardXp: 120,
    type: 'WORKOUT_COUNT'
  },
  {
    title: "Endurance Test",
    titleId: "Tes Ketahanan",
    description: "Train for 30 minutes.",
    descriptionId: "Latihan selama 30 menit.",
    rewardXp: 150,
    type: 'TIME_MINUTES'
  },
  {
    title: "Level Up Grind",
    titleId: "Grinding Level",
    description: "Earn 500 XP.",
    descriptionId: "Dapatkan 500 XP.",
    rewardXp: 250,
    type: 'XP_EARNED'
  },
  {
    title: "Weekly Warrior",
    titleId: "Pejuang Mingguan",
    description: "Maintain a 7-day streak.",
    descriptionId: "Pertahankan streak 7 hari.",
    rewardXp: 500,
    type: 'STREAK_DAYS'
  }
];

// Generate 50+ missions by scaling templates
export const generateDailyMissions = (level: number): Mission[] => {
  const missions: Mission[] = [];
  const count = 3;
  const scale = 1 + (level * 0.1);

  for (let i = 0; i < count; i++) {
    const template = MISSION_TEMPLATES[Math.floor(Math.random() * MISSION_TEMPLATES.length)];
    const targetValue = Math.ceil((template.type === 'TIME_MINUTES' ? 15 : 
                                   template.type === 'WORKOUT_COUNT' ? 1 : 
                                   template.type === 'XP_EARNED' ? 200 : 2) * scale);

    missions.push({
      id: crypto.randomUUID(),
      ...template,
      targetValue,
      currentValue: 0,
      completed: false,
      rewardXp: Math.ceil(template.rewardXp * scale)
    });
  }
  return missions;
};
