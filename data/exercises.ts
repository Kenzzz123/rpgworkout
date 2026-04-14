import { ExerciseInfo } from '../types';

export const EXERCISE_DB: Record<string, ExerciseInfo> = {
  "push ups": {
    name: "Push Ups",
    nameId: "Push Up",
    description: "Keep body straight, lower chest to floor, push back up. Keep core tight and elbows at 45 degrees.",
    descriptionId: "Badan lurus, turunin dada sampe lantai, dorong naik lagi. Kunci perut, siku 45 derajat biar otot dada kena maksimal.",
    videoId: "_l3ySVKYVJ8", // Planet Fitness (Verified Embed)
    difficulty: "Beginner",
    muscleGroup: "Chest, Triceps"
  },
  "squats": {
    name: "Squats",
    nameId: "Squat",
    description: "Feet shoulder-width apart, keep back straight, lower hips until thighs are parallel to floor.",
    descriptionId: "Kaki selebar bahu, punggung tegak, turunin pantat kayak mau duduk sampe paha rata air. Jangan bungkuk!",
    videoId: "aclHkVaku9U", // Bowflex (Verified Embed)
    difficulty: "Beginner",
    muscleGroup: "Legs, Glutes"
  },
  "plank": {
    name: "Plank",
    nameId: "Plank",
    description: "Hold a push-up position on elbows. Keep body in a straight line from head to heels.",
    descriptionId: "Tahan posisi push-up pake siku. Badan harus lurus dari kepala sampe tumit. Tahan perut, jangan nungging!",
    videoId: "ASdvN_XEl_c", // Bowflex (Verified Embed)
    difficulty: "Beginner",
    muscleGroup: "Core"
  },
  "lunges": {
    name: "Lunges",
    nameId: "Lunges",
    description: "Step forward with one leg, lower hips until both knees are bent at 90 degrees.",
    descriptionId: "Langkah ke depan, turunin badan sampe kedua lutut nekuk 90 derajat. Ganti kaki bergantian.",
    videoId: "QOVaHwm-Q6U", // Bowflex (Verified Embed)
    difficulty: "Beginner",
    muscleGroup: "Legs"
  },
  "jumping jacks": {
    name: "Jumping Jacks",
    nameId: "Jumping Jacks",
    description: "Jump feet wide while raising arms, then jump feet together while lowering arms.",
    descriptionId: "Lompat buka kaki sambil tepuk tangan di atas, terus lompat tutup kaki tangan turun. Bakar kalori nih!",
    videoId: "iSSAk4XCsRA", // Gymra (Verified Embed)
    difficulty: "Beginner",
    muscleGroup: "Cardio"
  },
  "burpees": {
    name: "Burpees",
    nameId: "Burpees",
    description: "Drop to squat, kick feet back to plank, do a push-up, jump feet forward, jump up.",
    descriptionId: "Jongkok, tendang kaki ke belakang (plank), push-up, tarik kaki lagi, terus lompat tinggi. Capek tapi mantap!",
    videoId: "auBLPXO8Fww", // Bowflex (Verified Embed)
    difficulty: "Advanced",
    muscleGroup: "Full Body"
  },
  "mountain climbers": {
    name: "Mountain Climbers",
    nameId: "Mountain Climbers",
    description: "Plank position, alternate bringing knees to chest rapidly.",
    descriptionId: "Posisi plank, lari di tempat tapi posisi tiarap. Lutut tarik ke dada gantian cepet-cepet.",
    videoId: "nmwgirgXLIg", // Bowflex (Verified Embed)
    difficulty: "Intermediate",
    muscleGroup: "Core, Cardio"
  },
  "crunches": {
    name: "Crunches",
    nameId: "Crunches",
    description: "Lie on back, knees bent, lift shoulders off floor squeezing abs. Don't pull on neck.",
    descriptionId: "Tiduran, tekuk lutut, angkat bahu dikit aja remes perut. Jangan tarik leher pake tangan ya!",
    videoId: "Xyd_fa5zoEU", // Bowflex (Verified Embed)
    difficulty: "Beginner",
    muscleGroup: "Abs"
  }
};

export const getExerciseInfo = (name: string): ExerciseInfo | null => {
  const normalized = name.toLowerCase().trim();
  // Exact match
  if (EXERCISE_DB[normalized]) return EXERCISE_DB[normalized];
  
  // Partial match
  const key = Object.keys(EXERCISE_DB).find(k => normalized.includes(k));
  if (key) return EXERCISE_DB[key];

  return null;
};