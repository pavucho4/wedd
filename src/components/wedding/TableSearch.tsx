import { useState } from 'react';
import { Search, Users, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { getGuests } from '@/services/guestService';
import { getSavedRSVPs } from '@/services/rsvpService';
import { useToast } from '@/hooks/use-toast';

interface Guest {
  id: string;
  names: string[];
  tableNumber: string;
  attending?: boolean;
  timestamp?: string;
}

interface RSVPData {
  guestName: string;
  tableNumber: string;
  attending: boolean;
  timestamp: string;
  userAgent: string;
  url: string;
}

interface SearchResult {
  name: string;
  tableNumber: string;
  attending?: boolean;
  timestamp?: string;
  source: 'guest' | 'rsvp';
}

export function TableSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Ошибка",
        description: "Введите имя для поиска",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    try {
      const query = searchQuery.toLowerCase().trim();
      
      // Загружаем данные из обеих таблиц
      const [guests, rsvps] = await Promise.all([
        getGuests(),
        getSavedRSVPs()
      ]);

      // Ищем среди гостей
      const foundGuest = guests.find(guest =>
        guest.names.some(name => 
          name.toLowerCase().includes(query) || 
          query.includes(name.toLowerCase())
        )
      );

      // Ищем среди RSVP ответов
      const foundRSVP = rsvps.find(rsvp =>
        rsvp.guestName.toLowerCase().includes(query) ||
        query.includes(rsvp.guestName.toLowerCase())
      );

      // Приоритет RSVP ответам (если есть и гость, и RSVP)
      const result = foundRSVP ? {
        name: foundRSVP.guestName,
        tableNumber: foundRSVP.tableNumber,
        attending: foundRSVP.attending,
        timestamp: foundRSVP.timestamp,
        source: 'rsvp' as const
      } : foundGuest ? {
        name: foundGuest.names.join(', '),
        tableNumber: foundGuest.tableNumber,
        attending: foundGuest.attending,
        timestamp: foundGuest.timestamp,
        source: 'guest' as const
      } : null;

      if (result) {
        setSearchResult(result);
        toast({
          title: "Гость найден!",
          description: `Найден ${result.name}`
        });
      } else {
        setSearchResult(null);
        toast({
          title: "Гость не найден",
          description: "Попробуйте изменить поисковый запрос",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка поиска",
        description: "Не удалось выполнить поиск",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-6 bg-gradient-to-b from-primary/5 via-background to-muted/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-serif text-primary mb-6 staggered-fade">
              Поиск столика
            </h1>
            <p className="text-xl text-muted-foreground font-light staggered-fade max-w-2xl mx-auto">
              Введите ваше имя, чтобы найти номер вашего столика
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-muted/20 to-background">
        <div className="max-w-2xl mx-auto">
          <div className="card-elegant rounded-2xl p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-serif text-primary mb-2">
                Найдите свой столик
              </h2>
              <p className="text-muted-foreground font-light">
                Введите ваше имя или фамилию
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Например: Иван Петров"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="h-12 text-lg"
                />
              </div>
              
              <Button
                onClick={handleSearch}
                disabled={isSearching}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-lg font-medium"
              >
                {isSearching ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Поиск...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Найти столик
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search Results */}
      {searchResult && (
        <section className="py-20 px-6 bg-gradient-to-b from-background to-muted/20">
          <div className="max-w-2xl mx-auto">
            <Card className="card-elegant rounded-2xl overflow-hidden">
              <CardContent className="p-8 md:p-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="w-8 h-8 text-green-600" />
                  </div>
                  
                  <h3 className="text-2xl font-serif text-primary mb-4">
                    Добро пожаловать!
                  </h3>
                  
                    <div className="space-y-4">
                      <div>
                        <p className="text-lg text-muted-foreground mb-2">Ваше имя:</p>
                        <p className="text-2xl font-medium text-foreground">
                          {searchResult.name}
                        </p>
                      </div>
                      
                      <div className="bg-accent/50 rounded-lg p-6">
                        <div className="flex items-center justify-center mb-2">
                          <MapPin className="w-6 h-6 text-primary mr-2" />
                          <p className="text-sm text-muted-foreground font-light">Ваш столик</p>
                        </div>
                        <p className="text-4xl font-serif text-primary font-bold">
                          №{searchResult.tableNumber}
                        </p>
                      </div>
                    </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <p className="text-muted-foreground font-light mb-4">
              Не можете найти свой столик? Обратитесь к организаторам
            </p>
            <div className="card-elegant rounded-xl p-6 max-w-sm mx-auto">
              <p className="text-sm text-muted-foreground font-light mb-3">
                Контакты организаторов:
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  <span className="text-primary font-medium">+7 (928) 361-72-17</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  <span className="text-primary font-medium">+7 (999) 379-29-17</span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground font-light">
            15 ноября 2025 • Ставрополь
          </p>
        </div>
      </footer>
    </main>
  );
}
