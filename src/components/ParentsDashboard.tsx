import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { getStats, loadProgress, resetProgress } from '@/utils/storage';

interface ParentsDashboardProps {
  onClose: () => void;
}

const ParentsDashboard = ({ onClose }: ParentsDashboardProps) => {
  const stats = getStats();
  const progress = loadProgress();

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
    multiplication: 'Волшебный Сад'
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in overflow-y-auto">
      <Card className="w-full max-w-4xl my-8 bg-white shadow-2xl border-4 border-primary">
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white z-10 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-heading font-bold mb-2">👨‍👩‍👧 Родительская панель</h2>
              <p className="text-blue-100">Статистика и прогресс вашего ребенка</p>
            </div>
            <Button onClick={onClose} variant="secondary" size="lg" className="gap-2">
              <Icon name="X" size={20} />
              Закрыть
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
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

          <Card className="p-6 border-2 border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <Icon name="Trophy" className="text-orange-500" size={24} />
              <h3 className="text-2xl font-heading font-bold">Лучшие результаты по мирам</h3>
            </div>

            <div className="space-y-4">
              {Object.entries(stats.bestScores).map(([game, score]) => (
                <div key={game}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold">{gameNames[game]}</span>
                      {score > 0 && (
                        <Badge variant="secondary" className="gap-1">
                          <Icon name="Star" className="text-yellow-500" size={14} />
                          {score}
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm text-gray-600">
                      {score === 0 ? 'Не пройдено' : `${score} звёзд`}
                    </span>
                  </div>
                  <Progress value={score * 20} className="h-2" />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-pink-50 to-yellow-50 border-2 border-pink-300">
            <div className="flex items-center gap-3 mb-6">
              <Icon name="Flower" className="text-pink-500" size={24} />
              <h3 className="text-2xl font-heading font-bold">Волшебный сад</h3>
            </div>

            <div className="bg-white rounded-2xl p-6 border-4 border-dashed border-pink-300 mb-4">
              <div className="grid grid-cols-10 gap-2">
                {progress.gardenPlants.slice(0, 50).map((plant, index) => (
                  <div key={index} className="text-2xl">
                    {plant}
                  </div>
                ))}
                {progress.gardenPlants.length === 0 && (
                  <div className="col-span-10 text-center text-gray-400 py-4">
                    Сад пока пуст
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Выращено растений: {stats.totalPlants}
              </p>
              <Badge variant="outline">
                Уровень умножения: {progress.multiplicationLevel}
              </Badge>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-300">
            <div className="flex items-center gap-3 mb-4">
              <Icon name="Lightbulb" className="text-orange-500" size={24} />
              <h3 className="text-xl font-bold">Рекомендации</h3>
            </div>

            <div className="space-y-3">
              {stats.totalStars < 10 && (
                <div className="flex items-start gap-2 p-3 bg-white rounded-lg">
                  <div className="text-xl">🎯</div>
                  <div>
                    <p className="font-semibold text-sm">Начинающий исследователь</p>
                    <p className="text-xs text-gray-600">
                      Отличное начало! Продолжайте проходить простые уровни для укрепления базовых навыков.
                    </p>
                  </div>
                </div>
              )}

              {stats.bestScores.multiplication === 0 && (
                <div className="flex items-start gap-2 p-3 bg-white rounded-lg">
                  <div className="text-xl">🌸</div>
                  <div>
                    <p className="font-semibold text-sm">Попробуйте Волшебный Сад</p>
                    <p className="text-xs text-gray-600">
                      Новая игра для изучения таблицы умножения! Визуальные подсказки помогут быстрее запомнить.
                    </p>
                  </div>
                </div>
              )}

              {stats.gamesPlayed > 20 && (
                <div className="flex items-start gap-2 p-3 bg-white rounded-lg">
                  <div className="text-xl">🏆</div>
                  <div>
                    <p className="font-semibold text-sm">Активный ученик!</p>
                    <p className="text-xs text-gray-600">
                      Отличная вовлеченность! Ребенок регулярно занимается и показывает стабильные результаты.
                    </p>
                  </div>
                </div>
              )}
            </div>
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
