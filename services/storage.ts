import { doc, getDoc, setDoc, collection, getDocs, query, orderBy, limit, writeBatch } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { AppState, INITIAL_USER, WorkoutSession, Exercise } from '../types';

const STORAGE_KEY = 'IRON_QUEST_DATA_V1';

// Local Fallback
const saveLocal = (data: AppState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const saveGameData = async (data: AppState) => {
  const user = auth.currentUser;
  if (!user) {
    saveLocal(data);
    return;
  }

  try {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, data.user);

    // Save Routine
    const routineRef = doc(db, 'users', user.uid, 'customRoutine', 'default');
    await setDoc(routineRef, { exercises: data.customRoutine });

    // Save Missions
    const missionsRef = doc(db, 'users', user.uid, 'missions', 'daily');
    await setDoc(missionsRef, { missions: data.dailyMissions });
  } catch (e) {
    console.error('Failed to save to Firebase', e);
    saveLocal(data);
  }
};

export const loadGameData = async (): Promise<AppState> => {
  const user = auth.currentUser;
  
  // Try local first for immediate UI
  let localData: AppState | null = null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) localData = JSON.parse(stored);
  } catch (e) {}

  if (!user) {
    return localData || {
      user: INITIAL_USER,
      customRoutine: [],
      history: [],
      dailyMissions: []
    };
  }

  try {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data() as any;
      
      const routineRef = doc(db, 'users', user.uid, 'customRoutine', 'default');
      const routineSnap = await getDoc(routineRef);
      const routineData = routineSnap.exists() ? routineSnap.data().exercises : [];

      const missionsRef = doc(db, 'users', user.uid, 'missions', 'daily');
      const missionsSnap = await getDoc(missionsRef);
      const missionsData = missionsSnap.exists() ? missionsSnap.data().missions : [];

      const historyRef = collection(db, 'users', user.uid, 'history');
      const historyQuery = query(historyRef, orderBy('date', 'desc'), limit(50));
      const historySnap = await getDocs(historyQuery);
      const historyData = historySnap.docs.map(doc => doc.data() as WorkoutSession);

      return {
        user: { ...INITIAL_USER, ...userData }, // Merge with initial to handle new fields like rank
        customRoutine: routineData,
        history: historyData,
        dailyMissions: missionsData
      };
    }
  } catch (e) {
    console.error('Failed to load from Firebase', e);
  }

  return localData || {
    user: INITIAL_USER,
    customRoutine: [],
    history: [],
    dailyMissions: []
  };
};

export const saveWorkoutSession = async (session: WorkoutSession) => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const historyRef = doc(db, 'users', user.uid, 'history', session.id);
    await setDoc(historyRef, session);
  } catch (e) {
    console.error('Failed to save session', e);
  }
};

export const exportSave = (data: AppState) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `iron-quest-save-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
};