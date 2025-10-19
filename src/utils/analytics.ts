interface GameAttempt {
  game: string;
  timestamp: string;
  score: number;
  maxScore: number;
  timeSpent: number;
  mistakes: number;
  hintsUsed: number;
}

interface SkillAnalysis {
  skillName: string;
  level: 'excellent' | 'good' | 'needs-practice' | 'struggling';
  percentage: number;
  trend: 'improving' | 'stable' | 'declining';
  recommendations: string[];
}

interface ChildProfile {
  strengths: string[];
  weaknesses: string[];
  learningStyle: 'visual' | 'logical' | 'verbal' | 'kinesthetic' | 'mixed';
  attentionSpan: 'high' | 'medium' | 'low';
  preferredGames: string[];
  overallProgress: number;
}

export const trackGameAttempt = (attempt: GameAttempt): void => {
  const attempts = getGameAttempts();
  attempts.push(attempt);
  
  if (attempts.length > 100) {
    attempts.shift();
  }
  
  localStorage.setItem('umnichka_attempts', JSON.stringify(attempts));
};

export const getGameAttempts = (): GameAttempt[] => {
  try {
    const stored = localStorage.getItem('umnichka_attempts');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const analyzeSkills = (): SkillAnalysis[] => {
  const attempts = getGameAttempts();
  
  if (attempts.length === 0) {
    return [];
  }

  const gameGroups: Record<string, GameAttempt[]> = {
    math: attempts.filter(a => a.game === 'math' || a.game === 'multiplication'),
    letters: attempts.filter(a => a.game === 'letters'),
    logic: attempts.filter(a => a.game === 'logic'),
    nature: attempts.filter(a => a.game === 'nature')
  };

  const skills: SkillAnalysis[] = [];

  Object.entries(gameGroups).forEach(([skill, gameAttempts]) => {
    if (gameAttempts.length === 0) return;

    const avgScore = gameAttempts.reduce((sum, a) => sum + (a.score / a.maxScore), 0) / gameAttempts.length * 100;
    const avgMistakes = gameAttempts.reduce((sum, a) => sum + a.mistakes, 0) / gameAttempts.length;
    const avgHints = gameAttempts.reduce((sum, a) => sum + a.hintsUsed, 0) / gameAttempts.length;

    const recent = gameAttempts.slice(-5);
    const older = gameAttempts.slice(0, -5);
    
    let trend: 'improving' | 'stable' | 'declining' = 'stable';
    if (older.length > 0 && recent.length > 0) {
      const recentAvg = recent.reduce((sum, a) => sum + (a.score / a.maxScore), 0) / recent.length;
      const olderAvg = older.reduce((sum, a) => sum + (a.score / a.maxScore), 0) / older.length;
      
      if (recentAvg > olderAvg + 0.1) trend = 'improving';
      else if (recentAvg < olderAvg - 0.1) trend = 'declining';
    }

    let level: SkillAnalysis['level'];
    if (avgScore >= 90) level = 'excellent';
    else if (avgScore >= 70) level = 'good';
    else if (avgScore >= 50) level = 'needs-practice';
    else level = 'struggling';

    const recommendations: string[] = [];
    
    if (level === 'excellent') {
      recommendations.push(`Отличные результаты! Можно переходить к более сложным заданиям.`);
    } else if (level === 'struggling') {
      recommendations.push(`Требуется дополнительная практика. Уделите больше времени базовым заданиям.`);
      if (avgHints > 2) {
        recommendations.push(`Ребенок часто использует подсказки - это нормально! Продолжайте практику.`);
      }
    }

    if (avgMistakes > 3) {
      recommendations.push(`Много ошибок - возможно, задания слишком сложные. Попробуйте начать с более простых уровней.`);
    }

    if (trend === 'improving') {
      recommendations.push(`Заметен прогресс! Ребенок улучшает результаты.`);
    } else if (trend === 'declining') {
      recommendations.push(`Результаты ухудшаются. Возможно, ребенок устал или потерял интерес. Сделайте перерыв.`);
    }

    const skillNames: Record<string, string> = {
      math: 'Математика',
      letters: 'Чтение и грамотность',
      logic: 'Логическое мышление',
      nature: 'Окружающий мир'
    };

    skills.push({
      skillName: skillNames[skill] || skill,
      level,
      percentage: Math.round(avgScore),
      trend,
      recommendations
    });
  });

  return skills.sort((a, b) => b.percentage - a.percentage);
};

export const buildChildProfile = (): ChildProfile => {
  const attempts = getGameAttempts();
  const skills = analyzeSkills();

  const strengths: string[] = [];
  const weaknesses: string[] = [];

  skills.forEach(skill => {
    if (skill.level === 'excellent' || skill.level === 'good') {
      strengths.push(skill.skillName);
    } else if (skill.level === 'struggling') {
      weaknesses.push(skill.skillName);
    }
  });

  const gameCounts: Record<string, number> = {};
  attempts.forEach(a => {
    gameCounts[a.game] = (gameCounts[a.game] || 0) + 1;
  });

  const preferredGames = Object.entries(gameCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2)
    .map(([game]) => game);

  const avgTimeSpent = attempts.length > 0 
    ? attempts.reduce((sum, a) => sum + a.timeSpent, 0) / attempts.length 
    : 0;

  const attentionSpan: ChildProfile['attentionSpan'] = 
    avgTimeSpent > 300 ? 'high' :
    avgTimeSpent > 120 ? 'medium' : 'low';

  const visualGames = ['nature', 'multiplication'];
  const logicalGames = ['logic', 'math'];
  const verbalGames = ['letters'];

  const visualScore = attempts.filter(a => visualGames.includes(a.game)).length;
  const logicalScore = attempts.filter(a => logicalGames.includes(a.game)).length;
  const verbalScore = attempts.filter(a => verbalGames.includes(a.game)).length;

  let learningStyle: ChildProfile['learningStyle'] = 'mixed';
  const max = Math.max(visualScore, logicalScore, verbalScore);
  if (max > 0) {
    if (visualScore === max && visualScore > logicalScore + verbalScore) {
      learningStyle = 'visual';
    } else if (logicalScore === max && logicalScore > visualScore + verbalScore) {
      learningStyle = 'logical';
    } else if (verbalScore === max && verbalScore > visualScore + logicalScore) {
      learningStyle = 'verbal';
    }
  }

  const overallProgress = skills.length > 0
    ? skills.reduce((sum, s) => sum + s.percentage, 0) / skills.length
    : 0;

  return {
    strengths: strengths.length > 0 ? strengths : ['Только начинает обучение'],
    weaknesses: weaknesses.length > 0 ? weaknesses : [],
    learningStyle,
    attentionSpan,
    preferredGames,
    overallProgress: Math.round(overallProgress)
  };
};

export const getLearningStyleDescription = (style: ChildProfile['learningStyle']): string => {
  const descriptions: Record<string, string> = {
    visual: 'Визуальный - лучше учится через картинки, схемы и видео. Рекомендуем больше игр с яркой графикой.',
    logical: 'Логический - любит решать задачи, находить закономерности. Отлично подходят математические и логические игры.',
    verbal: 'Вербальный - хорошо воспринимает информацию через слова и тексты. Игры с буквами и чтением будут эффективны.',
    kinesthetic: 'Кинестетический - учится через действие и движение. Интерактивные игры с перетаскиванием объектов идеальны.',
    mixed: 'Смешанный - использует разные стили обучения. Разнообразие игр поможет развиваться гармонично.'
  };
  return descriptions[style];
};

export const getAttentionSpanDescription = (span: ChildProfile['attentionSpan']): string => {
  const descriptions: Record<string, string> = {
    high: 'Высокая концентрация - может долго заниматься одной задачей. Можно предлагать более длительные и сложные задания.',
    medium: 'Средняя концентрация - оптимальная сессия обучения 5-10 минут. Чередуйте задания для поддержания интереса.',
    low: 'Требуются короткие сессии - делайте частые перерывы. Игры по 2-3 минуты с наградами будут эффективнее.'
  };
  return descriptions[span];
};

export const getRecommendedGames = (profile: ChildProfile): { game: string; reason: string }[] => {
  const recommendations: { game: string; reason: string }[] = [];

  if (profile.weaknesses.includes('Математика')) {
    recommendations.push({
      game: 'Цифроленд или Волшебный Сад',
      reason: 'Укрепить навыки счета и умножения'
    });
  }

  if (profile.weaknesses.includes('Чтение и грамотность')) {
    recommendations.push({
      game: 'Буквоград',
      reason: 'Развить навыки чтения и работы с буквами'
    });
  }

  if (profile.learningStyle === 'visual') {
    recommendations.push({
      game: 'Природния или Волшебный Сад',
      reason: 'Визуальный стиль обучения - игры с яркой графикой'
    });
  }

  if (profile.learningStyle === 'logical') {
    recommendations.push({
      game: 'Логикус или Цифроленд',
      reason: 'Логический склад ума - задачи на мышление'
    });
  }

  if (profile.attentionSpan === 'low') {
    recommendations.push({
      game: 'Цифроленд',
      reason: 'Короткие раунды подходят для небольшой концентрации'
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      game: 'Любая игра',
      reason: 'Ребенок показывает хорошие результаты во всех направлениях!'
    });
  }

  return recommendations;
};
