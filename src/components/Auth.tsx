import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { saveProgress, loadProgress } from '@/utils/storage';

interface AuthProps {
  onLogin: (childName: string, parentEmail: string) => void;
}

const Auth = ({ onLogin }: AuthProps) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [childName, setChildName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!childName.trim()) {
      setError('Введите имя ребенка');
      return;
    }

    if (!parentEmail.trim() || !parentEmail.includes('@')) {
      setError('Введите корректный email родителя');
      return;
    }

    if (!password.trim() || password.length < 4) {
      setError('Пароль должен содержать минимум 4 символа');
      return;
    }

    if (mode === 'register') {
      const users = JSON.parse(localStorage.getItem('umnichka_users') || '{}');
      
      if (users[parentEmail]) {
        setError('Пользователь с таким email уже существует');
        return;
      }

      users[parentEmail] = {
        childName,
        password,
        createdAt: new Date().toISOString()
      };

      localStorage.setItem('umnichka_users', JSON.stringify(users));
      localStorage.setItem('umnichka_current_user', parentEmail);
      
      saveProgress({ childName, parentEmail });
      onLogin(childName, parentEmail);
    } else {
      const users = JSON.parse(localStorage.getItem('umnichka_users') || '{}');
      const user = users[parentEmail];

      if (!user) {
        setError('Пользователь не найден');
        return;
      }

      if (user.password !== password) {
        setError('Неверный пароль');
        return;
      }

      localStorage.setItem('umnichka_current_user', parentEmail);
      onLogin(user.childName, parentEmail);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-20 bg-cover bg-center" 
        style={{
          backgroundImage: `url('https://cdn.poehali.dev/projects/c7625961-89d8-4705-9c95-293ea8d63f60/files/61776511-6dc6-405a-a7e2-d6ed51e43369.jpg')`
        }}
      />

      <Card className="w-full max-w-md relative z-10 shadow-2xl border-4 border-primary">
        <div className="bg-gradient-to-r from-primary to-secondary p-8 text-white rounded-t-lg">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
              <span className="text-5xl">✨</span>
            </div>
          </div>
          <h1 className="text-4xl font-heading font-bold text-center mb-2">Умничка</h1>
          <p className="text-center text-purple-100">Обучение как приключение!</p>
        </div>

        <div className="p-8">
          <div className="flex gap-2 mb-6">
            <Button
              onClick={() => setMode('login')}
              variant={mode === 'login' ? 'default' : 'outline'}
              className="flex-1"
              size="lg"
            >
              Вход
            </Button>
            <Button
              onClick={() => setMode('register')}
              variant={mode === 'register' ? 'default' : 'outline'}
              className="flex-1"
              size="lg"
            >
              Регистрация
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="childName" className="text-base font-semibold">
                Имя ребенка
              </Label>
              <div className="relative mt-2">
                <Icon name="User" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  id="childName"
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder="Введите имя"
                  className="pl-10 h-12 text-base"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="parentEmail" className="text-base font-semibold">
                Email родителя
              </Label>
              <div className="relative mt-2">
                <Icon name="Mail" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  id="parentEmail"
                  type="email"
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="pl-10 h-12 text-base"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-base font-semibold">
                Пароль
              </Label>
              <div className="relative mt-2">
                <Icon name="Lock" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Минимум 4 символа"
                  className="pl-10 h-12 text-base"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <Icon name="AlertCircle" size={20} />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" size="lg" className="w-full text-lg h-12">
              {mode === 'login' ? (
                <>
                  <Icon name="LogIn" className="mr-2" size={20} />
                  Войти
                </>
              ) : (
                <>
                  <Icon name="UserPlus" className="mr-2" size={20} />
                  Зарегистрироваться
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-800">
              <div className="flex items-start gap-2">
                <Icon name="Info" size={16} className="mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold mb-1">
                    {mode === 'login' ? 'Первый раз?' : 'Зачем регистрация?'}
                  </p>
                  <p className="text-xs">
                    {mode === 'login' 
                      ? 'Создайте аккаунт для сохранения прогресса и доступа к родительской панели с аналитикой.'
                      : 'Регистрация позволяет отслеживать прогресс ребенка, получать рекомендации и видеть детальную аналитику обучения.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
