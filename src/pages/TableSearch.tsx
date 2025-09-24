import { useState } from 'react';
import { Search, Users, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { findGuestByName, Guest } from '@/services/guestService';

const TableSearch = () => {
  const [searchName, setSearchName] = useState('');
  const [foundGuest, setFoundGuest] = useState<Guest | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!searchName.trim()) {
      setError('Пожалуйста, введите ваше имя');
      return;
    }

    setIsSearching(true);
    setError('');
    
    try {
      // Имитируем небольшую задержку для лучшего UX
      await new Promise(resolve => setTimeout(resolve, 500));
      const guest = await findGuestByName(searchName.trim());
      setFoundGuest(guest);
      if (!guest) {
        setError('К сожалению, мы не нашли вас в списке гостей. Пожалуйста, проверьте правильность написания имени или обратитесь к организаторам.');
      }
    } catch (e) {
      setError('Произошла ошибка при поиске. Попробуйте ещё раз.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      void handleSearch();
    }
  };

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      {/* Header */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-accent to-muted opacity-40" />
        
        {/* Floating decorative elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-accent/30 to-secondary/30 rounded-full blur-xl animate-float" />
        <div className="absolute bottom-32 right-16 w-24 h-24 bg-gradient-to-br from-secondary/30 to-accent/30 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }} />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          {/* Title */}
          <div className="staggered-fade mb-8">
            <h1 className="text-4xl md:text-6xl font-serif font-light text-primary mb-4">
              Поиск столика
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-light tracking-wide">
              Узнайте номер вашего столика
            </p>
          </div>

          {/* Search form */}
          <div className="staggered-fade mb-8">
            <div className="card-elegant rounded-2xl p-8 md:p-12 max-w-md mx-auto">
              <div className="mb-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Search className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-serif text-primary">Введите ваше имя</h2>
                </div>
                
                <Input
                  type="text"
                  placeholder="Ваше полное имя"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full mb-4"
                  disabled={isSearching}
                />
                
                <Button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="w-full btn-elegant bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-lg font-medium"
                >
                  {isSearching ? 'Поиск...' : 'Найти столик'}
                </Button>
              </div>

              {/* Error message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                </div>
              )}

              {/* Found guest info */}
              {foundGuest && (
                <div className="bg-accent/50 rounded-lg p-6 text-center">
                  <div className="mb-4">
                    <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h3 className="text-lg font-serif text-primary mb-2">Добро пожаловать!</h3>
                    <p className="text-muted-foreground font-light mb-1">
                      {foundGuest.names.join(', ')}
                    </p>
                  </div>
                  
                  <div className="bg-primary/10 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground font-light mb-1">Ваш столик</p>
                    <p className="text-4xl font-serif text-primary font-bold">№{foundGuest.tableNumber}</p>
                  </div>

                  {foundGuest.attending !== undefined && (
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground">
                        Статус: {foundGuest.attending ? 'Вы подтвердили участие' : 'Вы отказались от участия'}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="staggered-fade">
            <div className="card-elegant rounded-xl p-6 max-w-2xl mx-auto">
              <h3 className="text-lg font-serif text-primary mb-3">Как пользоваться</h3>
              <div className="text-sm text-muted-foreground font-light space-y-2">
                <p>• Введите ваше полное имя так, как оно указано в приглашении</p>
                <p>• Если не нашли себя, попробуйте другие варианты написания имени</p>
                <p>• При возникновении проблем обратитесь к организаторам</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default TableSearch;
