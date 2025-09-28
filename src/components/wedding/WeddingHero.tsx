import { Heart, Sparkles, Crown } from 'lucide-react';

interface WeddingHeroProps {
  guestName: string;
  gender: 'male' | 'female' | 'plural';
}

export function WeddingHero({ guestName, gender }: WeddingHeroProps) {
  const getGreeting = () => {
    switch (gender) {
      case 'female': return 'Уважаемая';
      case 'plural': return 'Уважаемые';
      default: return 'Уважаемый';
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
        {/* Couple names */}
        <div className="staggered-fade mb-8">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-light text-primary mb-4">
            Даниил
          </h1>
            <div className="flex items-center justify-center gap-8 my-8">
              <div className="h-px w-20 bg-gradient-to-r from-transparent to-primary/60" />
              <span className="text-4xl md:text-5xl font-serif text-primary font-medium">&</span>
              <div className="h-px w-20 bg-gradient-to-l from-transparent to-primary/60" />
            </div>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-light text-primary">
            Алина
          </h1>
        </div>

        {/* Guest name */}
        <div className="staggered-fade mb-8">
          <p className="text-lg md:text-xl text-muted-foreground font-light tracking-wide">
            {getGreeting()} {guestName}
          </p>
        </div>

        {/* Wedding date */}
        <div className="staggered-fade mb-16">
          <p className="text-lg md:text-xl text-muted-foreground font-light mb-4">
            Приглашаем вас на торжество, посвящённое нашему бракосочетанию
          </p>
          <h2 className="text-6xl md:text-8xl lg:text-9xl font-serif text-primary mb-4">
            15 ноября 2025
          </h2>
          <p className="text-lg text-muted-foreground font-light">
            Ставрополь
          </p>
        </div>
      </div>
    </section>
  );
}