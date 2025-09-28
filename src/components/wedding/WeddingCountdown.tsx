import { useState, useEffect, useRef } from 'react';
import { Calendar, Clock } from 'lucide-react';

export function WeddingCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const weddingDate = new Date('2025-11-15T12:40:00');
    
    const updateCountdown = () => {
      const now = new Date();
      const difference = weddingDate.getTime() - now.getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      ref={sectionRef}
      className={`py-16 px-6 bg-gradient-to-t from-secondary/20 to-background transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      <div className="max-w-4xl mx-auto text-center">
        <div className="staggered-fade mb-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/50" />
            <Calendar className="w-6 h-6 text-primary" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/50" />
          </div>
          
          <h3 className="text-2xl md:text-3xl font-serif text-primary mb-4">
            До торжества осталось
          </h3>
        </div>

        <div className="card-elegant rounded-2xl p-8 max-w-2xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div className="text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl md:text-3xl font-bold text-primary">{timeLeft.days}</span>
              </div>
              <p className="text-sm font-medium text-muted-foreground">дней</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl md:text-3xl font-bold text-primary">{timeLeft.hours}</span>
              </div>
              <p className="text-sm font-medium text-muted-foreground">часов</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl md:text-3xl font-bold text-primary">{timeLeft.minutes}</span>
              </div>
              <p className="text-sm font-medium text-muted-foreground">минут</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl md:text-3xl font-bold text-primary">{timeLeft.seconds}</span>
              </div>
              <p className="text-sm font-medium text-muted-foreground">секунд</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}