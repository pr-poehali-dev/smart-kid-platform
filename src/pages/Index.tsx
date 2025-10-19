import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Progress } from '@/components/ui/progress';
import MathGame from '@/components/MathGame';
import LetterGame from '@/components/LetterGame';
import LogicGame from '@/components/LogicGame';
import NatureGame from '@/components/NatureGame';
import MultiplicationGame from '@/components/MultiplicationGame';
import Leaderboard from '@/components/Leaderboard';
import ParentsDashboard from '@/components/ParentsDashboard';
import Auth from '@/components/Auth';
import { loadProgress, addStars, addAchievement, updateBestScore, saveProgress } from '@/utils/storage';

interface World {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
  bgGradient: string;
}

const worlds: World[] = [
  {
    id: 'math',
    name: 'Цифроленд',
    emoji: '🔢',
    color: '#9b87f5',
    description: 'Королевство математики с дружелюбными цифрами',
    bgGradient: 'from-purple-400 to-purple-600'
  },
  {
    id: 'letters',
    name: 'Буквоград',
    emoji: '📚',
    color: '#0EA5E9',
    description: 'Страна слов и чтения с говорящими животными',
    bgGradient: 'from-blue-400 to-blue-600'
  },
  {
    id: 'logic',
    name: 'Логикус',
    emoji: '🧩',
    color: '#F2FCE2',
    description: 'Планета мышления с загадками',
    bgGradient: 'from-green-400 to-green-600'
  },
  {
    id: 'nature',
    name: 'Природния',
    emoji: '🌿',
    color: '#FEF7CD',
    description: 'Мир животных и растений',
    bgGradient: 'from-yellow-400 to-yellow-600'
  },
  {
    id: 'multiplication',
    name: 'Волшебный Сад',
    emoji: '🌺',
    color: '#F97316',
    description: 'Учим таблицу умножения',
    bgGradient: 'from-pink-400 to-rose-600'
  }
];

const Index = () => {
  const [selectedWorld, setSelectedWorld] = useState<string | null>(null);
  const [stars, setStars] = useState(0);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showParentsDashboard, setShowParentsDashboard] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [childName, setChildName] = useState('');
  const [parentEmail, setParentEmail] = useState('');

  useEffect(() => {
    const currentUser = localStorage.getItem('umnichka_current_user');
    if (currentUser) {
      const users = JSON.parse(localStorage.getItem('umnichka_users') || '{}');
      const user = users[currentUser];
      if (user) {
        setIsAuthenticated(true);
        setChildName(user.childName);
        setParentEmail(currentUser);
      }
    }
    
    const progress = loadProgress();
    setStars(progress.stars);
    setAchievements(progress.achievements);
  }, []);

  const handleLogin = (name: string, email: string) => {
    setIsAuthenticated(true);
    setChildName(name);
    setParentEmail(email);
    saveProgress({ childName: name, parentEmail: email });
  };

  const handleLogout = () => {
    localStorage.removeItem('umnichka_current_user');
    setIsAuthenticated(false);
    setChildName('');
    setParentEmail('');
    window.location.reload();
  };

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  const handleWorldClick = (worldId: string) => {
    setSelectedWorld(worldId);
  };

  const handleGameComplete = (earnedStars: number) => {
    addStars(earnedStars);
    if (selectedWorld) {
      addAchievement(selectedWorld);
      updateBestScore(selectedWorld as any, earnedStars);
    }
    setStars(prev => prev + earnedStars);
    setAchievements(prev => [...prev, selectedWorld || '']);
  };

  const handleBackToWorlds = () => {
    setSelectedWorld(null);
  };

  if (selectedWorld === 'math') {
    return <MathGame onComplete={handleGameComplete} onBack={handleBackToWorlds} />;
  }

  if (selectedWorld === 'letters') {
    return <LetterGame onComplete={handleGameComplete} onBack={handleBackToWorlds} />;
  }

  if (selectedWorld === 'logic') {
    return <LogicGame onComplete={handleGameComplete} onBack={handleBackToWorlds} />;
  }

  if (selectedWorld === 'nature') {
    return <NatureGame onComplete={handleGameComplete} onBack={handleBackToWorlds} />;
  }

  if (selectedWorld === 'multiplication') {
    return <MultiplicationGame onComplete={handleGameComplete} onBack={handleBackToWorlds} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <div 
        className="absolute inset-0 opacity-20 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://cdn.poehali.dev/projects/c7625961-89d8-4705-9c95-293ea8d63f60/files/61776511-6dc6-405a-a7e2-d6ed51e43369.jpg')`
        }}
      />

      <div className="relative z-10">
        <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b-4 border-primary">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center animate-bounce-gentle">
                  <span className="text-3xl">✨</span>
                </div>
                <div>
                  <h1 className="text-4xl font-heading font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Умничка
                  </h1>
                  <p className="text-sm text-muted-foreground">Обучение как приключение!</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right mr-2">
                  <p className="text-sm text-gray-600">Привет,</p>
                  <p className="font-bold text-lg">{childName}!</p>
                </div>
                <Badge variant="secondary" className="px-4 py-2 text-lg">
                  <Icon name="Star" className="mr-2 fill-yellow-400 text-yellow-400" size={20} />
                  {stars}
                </Badge>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="gap-2"
                  onClick={() => setShowLeaderboard(true)}
                >
                  <Icon name="Trophy" size={20} />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="gap-2"
                  onClick={handleLogout}
                >
                  <Icon name="LogOut" size={20} />
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-5xl font-heading font-bold text-foreground mb-4">
              Выбери своё приключение! 🚀
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Каждый мир полон увлекательных заданий, которые помогут тебе стать умнее
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
            {worlds.map((world, index) => (
              <Card
                key={world.id}
                className="group cursor-pointer overflow-hidden border-4 hover:border-primary transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => handleWorldClick(world.id)}
              >
                <div className={`h-32 bg-gradient-to-br ${world.bgGradient} flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-white/20 group-hover:bg-white/30 transition-colors" />
                  <span className="text-7xl animate-float relative z-10" style={{ animationDelay: `${index * 200}ms` }}>
                    {world.emoji}
                  </span>
                </div>
                <div className="p-6 bg-white">
                  <h3 className="text-2xl font-heading font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                    {world.name}
                  </h3>
                  <p className="text-muted-foreground mb-4">{world.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="gap-1">
                      <Icon name="Trophy" size={14} className="text-yellow-500" />
                      {achievements.filter(a => a === world.id).length}
                    </Badge>
                    <Icon name="ArrowRight" className="text-primary group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="p-6 bg-white/90 backdrop-blur-sm border-2 border-primary/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon name="Target" className="text-primary" size={24} />
                </div>
                <h3 className="text-2xl font-heading font-bold">Твой прогресс</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Общий уровень</span>
                    <span className="text-sm text-muted-foreground">Уровень {Math.floor(stars / 10) + 1}</span>
                  </div>
                  <Progress value={(stars % 10) * 10} className="h-3" />
                </div>
                <p className="text-sm text-muted-foreground">
                  До следующего уровня осталось {10 - (stars % 10)} звезд ⭐
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-accent/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-accent/50 flex items-center justify-center">
                  <Icon name="Award" className="text-purple-600" size={24} />
                </div>
                <h3 className="text-2xl font-heading font-bold">Достижения</h3>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <div
                    key={i}
                    className={`aspect-square rounded-lg flex items-center justify-center text-2xl ${
                      i <= achievements.length
                        ? 'bg-gradient-to-br from-yellow-400 to-orange-400 shadow-lg'
                        : 'bg-gray-200'
                    }`}
                  >
                    {i <= achievements.length ? '🏆' : '🔒'}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Card className="inline-block p-8 bg-gradient-to-r from-primary/10 to-secondary/10 border-2 border-primary/20">
              <div className="flex items-center gap-4">
                <img
                  src="https://cdn.poehali.dev/projects/c7625961-89d8-4705-9c95-293ea8d63f60/files/17b56e0a-6330-4ec4-b784-0141af38a56d.jpg"
                  alt="Знайка"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div className="text-left">
                  <h4 className="text-2xl font-heading font-bold mb-2">Привет! Я Знайка! 👋</h4>
                  <p className="text-muted-foreground max-w-md">
                    Я буду твоим проводником в мире знаний. Выбери любой мир и начни своё приключение!
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </main>

        <footer className="mt-16 py-8 bg-white/80 backdrop-blur-sm border-t-2 border-primary/20">
          <div className="container mx-auto px-4 text-center text-muted-foreground">
            <p className="mb-4">Умничка — обучение как приключение, которое длится всю жизнь! ✨</p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowParentsDashboard(true)}
              >
                Для родителей
              </Button>
              <Button variant="ghost" size="sm">Безопасность</Button>
              <Button variant="ghost" size="sm">Помощь</Button>
              <Button variant="ghost" size="sm">Тарифы</Button>
            </div>
          </div>
        </footer>
      </div>

      {showLeaderboard && (
        <Leaderboard userStars={stars} onClose={() => setShowLeaderboard(false)} />
      )}

      {showParentsDashboard && (
        <ParentsDashboard onClose={() => setShowParentsDashboard(false)} childName={childName} />
      )}
    </div>
  );
};

export default Index;