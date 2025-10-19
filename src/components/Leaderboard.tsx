import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface LeaderboardProps {
  userStars: number;
  onClose: () => void;
}

interface Player {
  id: number;
  name: string;
  avatar: string;
  stars: number;
  level: number;
  achievements: number;
}

const players: Player[] = [
  { id: 1, name: 'Маша', avatar: '👧', stars: 156, level: 16, achievements: 24 },
  { id: 2, name: 'Саша', avatar: '👦', stars: 142, level: 15, achievements: 22 },
  { id: 3, name: 'Петя', avatar: '🧒', stars: 138, level: 14, achievements: 21 },
  { id: 4, name: 'Катя', avatar: '👧', stars: 125, level: 13, achievements: 19 },
  { id: 5, name: 'Вова', avatar: '👦', stars: 118, level: 12, achievements: 18 },
  { id: 6, name: 'Аня', avatar: '👧', stars: 105, level: 11, achievements: 16 },
  { id: 7, name: 'Дима', avatar: '👦', stars: 98, level: 10, achievements: 15 },
  { id: 8, name: 'Лена', avatar: '👧', stars: 87, level: 9, achievements: 13 }
];

const Leaderboard = ({ userStars, onClose }: LeaderboardProps) => {
  const userPosition = players.filter(p => p.stars > userStars).length + 1;
  const userLevel = Math.floor(userStars / 10) + 1;

  const getMedalEmoji = (position: number) => {
    if (position === 1) return '🥇';
    if (position === 2) return '🥈';
    if (position === 3) return '🥉';
    return `${position}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl border-4 border-primary">
        <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white z-10">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-heading font-bold mb-2">🏆 Таблица лидеров</h2>
              <p className="text-purple-100">Лучшие ученики этой недели</p>
            </div>
            <Button onClick={onClose} variant="secondary" size="lg" className="gap-2">
              <Icon name="X" size={20} />
              Закрыть
            </Button>
          </div>
        </div>

        <div className="p-6">
          <Card className="p-6 mb-6 bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-400">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-3xl shadow-lg">
                🎯
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-2xl font-bold">Твоя позиция</h3>
                  <Badge className="bg-primary text-2xl px-3 py-1">#{userPosition}</Badge>
                </div>
                <div className="flex gap-4 text-sm">
                  <span>⭐ {userStars} звезд</span>
                  <span>📊 Уровень {userLevel}</span>
                </div>
              </div>
            </div>
          </Card>

          <div className="space-y-3">
            {players.map((player, index) => {
              const position = index + 1;
              const isTopThree = position <= 3;

              return (
                <Card
                  key={player.id}
                  className={`p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                    isTopThree
                      ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-400'
                      : 'bg-white border-2 border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold ${
                      isTopThree
                        ? 'bg-gradient-to-br from-yellow-400 to-orange-400 text-white shadow-lg'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {getMedalEmoji(position)}
                    </div>

                    <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-3xl shadow-md">
                      {player.avatar}
                    </div>

                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-800">{player.name}</h4>
                      <div className="flex gap-3 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Icon name="Star" className="text-yellow-500" size={14} />
                          {player.stars}
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon name="TrendingUp" className="text-blue-500" size={14} />
                          Ур. {player.level}
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon name="Award" className="text-purple-500" size={14} />
                          {player.achievements}
                        </span>
                      </div>
                    </div>

                    {isTopThree && (
                      <div className="text-4xl animate-bounce-gentle">
                        {position === 1 ? '👑' : position === 2 ? '🌟' : '✨'}
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

          <Card className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300">
            <div className="text-center">
              <div className="text-4xl mb-3">💪</div>
              <h3 className="text-xl font-bold mb-2">Продолжай учиться!</h3>
              <p className="text-gray-600">
                Набери больше звёзд, чтобы подняться в рейтинге. Каждое выполненное задание приближает тебя к вершине!
              </p>
            </div>
          </Card>
        </div>
      </Card>
    </div>
  );
};

export default Leaderboard;
