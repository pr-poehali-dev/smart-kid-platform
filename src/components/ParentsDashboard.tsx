import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { getStats, loadProgress, resetProgress } from '@/utils/storage';
import { 
  analyzeSkills, 
  buildChildProfile, 
  getLearningStyleDescription, 
  getAttentionSpanDescription,
  getRecommendedGames 
} from '@/utils/analytics';

interface ParentsDashboardProps {
  onClose: () => void;
  childName?: string;
}

const ParentsDashboard = ({ onClose, childName = 'ребенка' }: ParentsDashboardProps) => {
  const stats = getStats();
  const progress = loadProgress();
  const skills = analyzeSkills();
  const profile = buildChildProfile();
  const recommendations = getRecommendedGames(profile);

  const handleReset = () => {
    if (confirm('Вы уверены, что хотите сбросить весь прогресс? Это действие нельзя отменить.')) {
      resetProgress();
      window.location.reload();
    }
  };

  const lastPlayedDate = new Date(stats.lastPlayed);
  const formattedDate = lastPlayedDate.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const gameNames: Record<string, string> = {
    math: 'Цифроленд',
    letters: 'Буквоград',
    logic: 'Логикус',
    nature: 'Природния',
    multiplication: 'Волшебный Сад',
    associations: 'Ассоциации'
  };

  const levelColors = {
    excellent: 'from-green-400 to-emerald-500',
    good: 'from-blue-400 to-cyan-500',
    'needs-practice': 'from-yellow-400 to-orange-500',
    struggling: 'from-red-400 to-rose-500'
  };

  const levelEmojis = {
    excellent: '🌟',
    good: '👍',
    'needs-practice': '📚',
    struggling: '💪'
  };

  const levelTexts = {
    excellent: 'Отлично',
    good: 'Хорошо',
    'needs-practice': 'Нужна практика',
    struggling: 'Требует внимания'
  };

  const trendEmojis = {
    improving: '📈',
    stable: '➡️',
    declining: '📉'
  };

  const trendTexts = {
    improving: 'Улучшается',
    stable: 'Стабильно',
    declining: 'Снижается'
  };

  const learningStyleEmojis: Record<string, string> = {
    visual: '👁️',
    logical: '🧠',
    verbal: '💬',
    kinesthetic: '🤸',
    mixed: '🎨'
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in overflow-y-auto">
      <Card className="w-full max-w-6xl my-8 bg-white shadow-2xl border-4 border-primary">
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white z-10 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-heading font-bold mb-2">👨‍👩‍👧 Родительский контроль</h2>
              <p className="text-blue-100">Прогресс {childName} и интеллектуальная аналитика</p>
            </div>
            <Button onClick={onClose} variant="secondary" size="lg" className="gap-2">
              <Icon name="X" size={20} />
              Закрыть
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <Card className="p-6 bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-400">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <Icon name="Brain" className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-heading font-bold">Профиль обучения {childName}</h3>
                <p className="text-purple-700">Анализ на основе активности и результатов</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 border-2 border-purple-300">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{learningStyleEmojis[profile.learningStyle]}</span>
                  <h4 className="font-bold text-lg">Стиль обучения</h4>
                </div>
                <Badge className="mb-2 text-base px-3 py-1">
                  {profile.learningStyle === 'visual' ? 'Визуальный' :
                   profile.learningStyle === 'logical' ? 'Логический' :
                   profile.learningStyle === 'verbal' ? 'Вербальный' :
                   profile.learningStyle === 'kinesthetic' ? 'Кинестетический' : 'Смешанный'}
                </Badge>
                <p className="text-sm text-gray-700">
                  {getLearningStyleDescription(profile.learningStyle)}
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 border-2 border-blue-300">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">⏱️</span>
                  <h4 className="font-bold text-lg">Концентрация внимания</h4>
                </div>
                <Badge variant="outline" className="mb-2 text-base px-3 py-1">
                  {profile.attentionSpan === 'high' ? 'Высокая' :
                   profile.attentionSpan === 'medium' ? 'Средняя' : 'Требуются короткие сессии'}
                </Badge>
                <p className="text-sm text-gray-700">
                  {getAttentionSpanDescription(profile.attentionSpan)}
                </p>
              </div>
            </div>

            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 border-2 border-green-300">
                <div className="flex items-center gap-2 mb-3">
                  <Icon name="TrendingUp" className="text-green-600" size={20} />
                  <h4 className="font-bold">Сильные стороны</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.strengths.map((strength, i) => (
                    <Badge key={i} className="bg-green-100 text-green-800 border-green-300">
                      ✨ {strength}
                    </Badge>
                  ))}
                </div>
              </div>

              {profile.weaknesses.length > 0 && (
                <div className="bg-white rounded-xl p-4 border-2 border-orange-300">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon name="Target" className="text-orange-600" size={20} />
                    <h4 className="font-bold">Направления для развития</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.weaknesses.map((weakness, i) => (
                      <Badge key={i} variant="outline" className="border-orange-300 text-orange-800">
                        📚 {weakness}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 bg-white rounded-xl p-4 border-2 border-blue-300">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold">Общий прогресс обучения</h4>
                <Badge className="text-lg px-3 py-1">{profile.overallProgress}%</Badge>
              </div>
              <Progress value={profile.overallProgress} className="h-3" />
            </div>
          </Card>

          {skills.length > 0 && (
            <Card className="p-6 border-2 border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <Icon name="BarChart3" className="text-blue-600" size={24} />
                <h3 className="text-2xl font-heading font-bold">Детальный анализ навыков</h3>
              </div>

              <div className="space-y-4">
                {skills.map((skill, index) => (
                  <Card key={index} className={`p-4 bg-gradient-to-r ${levelColors[skill.level]} text-white`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{levelEmojis[skill.level]}</span>
                        <div>
                          <h4 className="text-xl font-bold">{skill.skillName}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-sm">
                              {levelTexts[skill.level]}
                            </Badge>
                            <Badge variant="outline" className="text-sm bg-white/20 border-white/40">
                              {trendEmojis[skill.trend]} {trendTexts[skill.trend]}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-4xl font-bold">{skill.percentage}%</div>
                        <div className="text-xs opacity-90">успешность</div>
                      </div>
                    </div>

                    <Progress value={skill.percentage} className="h-2 mb-3 bg-white/30" />

                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 space-y-2">
                      {skill.recommendations.map((rec, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <Icon name="Lightbulb" size={16} className="mt-0.5 flex-shrink-0" />
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          )}

          <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400">
            <div className="flex items-center gap-3 mb-6">
              <Icon name="Target" className="text-green-600" size={24} />
              <h3 className="text-2xl font-heading font-bold">Рекомендованные игры</h3>
            </div>

            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <div key={index} className="bg-white rounded-lg p-4 border-2 border-green-300">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon name="Star" className="text-white" size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-green-800">{rec.game}</h4>
                      <p className="text-sm text-gray-700 mt-1">{rec.reason}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid md:grid-cols-3 gap-4">
            <Card className="p-6 bg-gradient-to-br from-yellow-100 to-orange-100 border-2 border-yellow-400">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Icon name="Star" className="text-white" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Всего звёзд</p>
                  <p className="text-3xl font-bold text-yellow-700">{stats.totalStars}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-400">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-purple-400 rounded-full flex items-center justify-center">
                  <Icon name="Award" className="text-white" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Достижения</p>
                  <p className="text-3xl font-bold text-purple-700">{stats.totalAchievements}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-green-400">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center">
                  <Icon name="Gamepad2" className="text-white" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Игр сыграно</p>
                  <p className="text-3xl font-bold text-green-700">{stats.gamesPlayed}</p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300">
            <div className="flex items-center gap-3 mb-4">
              <Icon name="Clock" className="text-blue-600" size={24} />
              <h3 className="text-xl font-bold">Последняя активность</h3>
            </div>
            <p className="text-gray-700">{formattedDate}</p>
          </Card>

          <Card className="p-6 bg-gray-50 border-2 border-gray-300">
            <div className="flex items-center gap-3 mb-4">
              <Icon name="Settings" className="text-gray-600" size={24} />
              <h3 className="text-xl font-bold">Настройки</h3>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleReset}
                variant="destructive"
                size="lg"
                className="w-full gap-2"
              >
                <Icon name="RotateCcw" size={20} />
                Сбросить весь прогресс
              </Button>
              <p className="text-xs text-gray-500 text-center">
                ⚠️ Это действие удалит все достижения и статистику
              </p>
            </div>
          </Card>
        </div>
      </Card>
    </div>
  );
};

export default ParentsDashboard;