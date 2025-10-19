interface GameProgress {
  stars: number;
  achievements: string[];
  gardenPlants: string[];
  multiplicationLevel: number;
  multiplicationScore: number;
  lastPlayed: string;
  totalGamesPlayed: number;
  childName?: string;
  parentEmail?: string;
  bestScores: {
    math: number;
    letters: number;
    logic: number;
    nature: number;
    multiplication: number;
    associations: number;
  };
}

const STORAGE_KEY = 'umnichka_progress';

const defaultProgress: GameProgress = {
  stars: 0,
  achievements: [],
  gardenPlants: [],
  multiplicationLevel: 1,
  multiplicationScore: 0,
  lastPlayed: new Date().toISOString(),
  totalGamesPlayed: 0,
  bestScores: {
    math: 0,
    letters: 0,
    logic: 0,
    nature: 0,
    multiplication: 0,
    associations: 0
  }
};

export const loadProgress = (): GameProgress => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...defaultProgress, ...parsed };
    }
  } catch (error) {
    console.error('Error loading progress:', error);
  }
  return defaultProgress;
};

export const saveProgress = (progress: Partial<GameProgress>): void => {
  try {
    const current = loadProgress();
    const updated = {
      ...current,
      ...progress,
      lastPlayed: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving progress:', error);
  }
};

export const addStars = (count: number): void => {
  const progress = loadProgress();
  saveProgress({ stars: progress.stars + count });
};

export const addAchievement = (achievement: string): void => {
  const progress = loadProgress();
  if (!progress.achievements.includes(achievement)) {
    saveProgress({ 
      achievements: [...progress.achievements, achievement],
      totalGamesPlayed: progress.totalGamesPlayed + 1
    });
  }
};

export const updateBestScore = (game: keyof GameProgress['bestScores'], score: number): void => {
  const progress = loadProgress();
  if (score > progress.bestScores[game]) {
    saveProgress({
      bestScores: {
        ...progress.bestScores,
        [game]: score
      }
    });
  }
};

export const addGardenPlant = (plant: string): void => {
  const progress = loadProgress();
  saveProgress({
    gardenPlants: [...progress.gardenPlants, plant]
  });
};

export const resetProgress = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

export const getStats = () => {
  const progress = loadProgress();
  return {
    totalStars: progress.stars,
    totalAchievements: progress.achievements.length,
    totalPlants: progress.gardenPlants.length,
    gamesPlayed: progress.totalGamesPlayed,
    lastPlayed: progress.lastPlayed,
    bestScores: progress.bestScores
  };
};