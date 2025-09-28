import { Heart, Sparkles, Crown } from 'lucide-react';

interface WeddingHeroProps {
  guestName: string;
  gender: 'male' | 'female' | 'plural';
}

export function WeddingHero({ guestName, gender }: WeddingHeroProps) {
  const getGreeting = () => {
    switch (gender) {
      case 'female': return 'Дорогая';
      case 'plural': return 'Дорогие';
      default: return 'Дорогой';
    }
  };
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary via-accent to-muted opacity-40" />
      
      {/* Floating decorative elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-accent/30 to-secondary/30 rounded-full blur-xl animate-float" />
      <div className="absolute bottom-32 right-16 w-24 h-24 bg-gradient-to-br from-secondary/30 to-accent/30 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-br from-muted/40 to-secondary/40 rounded-full blur-lg animate-float" style={{ animationDelay: '4s' }} />
      
      {/* Wedding decorative elements */}
      <div className="absolute bottom-20 left-16 opacity-20">
        <Crown className="w-6 h-6 text-accent animate-float" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        {/* Guest name */}
        <div className="staggered-fade mb-8">
          <p className="text-lg md:text-xl text-muted-foreground font-light tracking-wide">
            {getGreeting()} {guestName}
          </p>
        </div>

        {/* Couple names */}
        <div className="staggered-fade mb-8">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-light text-primary mb-4">
            Даниил
          </h1>
            <div className="flex items-center justify-center gap-8 my-8">
              <div className="h-px w-20 bg-gradient-to-r from-transparent to-primary/60" />
              <span className="text-4xl md:text-5xl font-serif text-primary font-medium">&</span>
              <div className="h-px w-20 bg-gradient-to-l from-transparent to-primary/60" />
            </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-light text-primary">
            Алина
          </h1>
        </div>

        {/* Love story moments */}
        <div className="staggered-fade mb-16">
          <div className="max-w-2xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="card-elegant rounded-xl p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/30 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-serif text-lg text-primary mb-2">Первая встреча</h3>
                <p className="text-sm text-muted-foreground font-light mb-1">Влюбились друг в друга</p>
                <p className="text-primary font-medium">18 июля 2021</p>
              </div>
              <div className="card-elegant rounded-xl p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-accent/20 to-primary/30 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-serif text-lg text-primary mb-2">Предложение</h3>
                <p className="text-sm text-muted-foreground font-light mb-1">Решили пожениться</p>
                <p className="text-primary font-medium">8 июля 2025</p>
              </div>
            </div>
          </div>
        </div>

        {/* Wedding date */}
        <div className="staggered-fade">
          <div className="card-elegant rounded-2xl p-8 md:p-12 max-w-md mx-auto">
            <p className="text-sm md:text-base text-muted-foreground font-light mb-2">
              Приглашаем вас на нашу свадьбу
            </p>
            <h2 className="text-3xl md:text-4xl font-serif text-primary mb-2">
              15 ноября 2025
            </h2>
            <p className="text-muted-foreground font-light">
              Ставрополь
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}