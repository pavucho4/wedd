import { Countdown } from './Countdown';

export function WeddingCountdown() {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif text-primary mb-6 staggered-fade">
            До торжества
          </h2>
          <p className="text-lg text-muted-foreground font-light staggered-fade">
            Осталось совсем немного до нашего особенного дня
          </p>
        </div>

        <div className="staggered-fade">
          <Countdown />
        </div>
      </div>
    </section>
  );
}
