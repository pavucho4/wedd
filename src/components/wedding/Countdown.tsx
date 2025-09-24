import { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';

export function Countdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('2025-11-15T12:40:00+03:00').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="card-elegant rounded-xl p-8 max-w-lg mx-auto">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Calendar className="w-6 h-6 text-primary" />
          <p className="text-lg text-muted-foreground font-light">
            15 ноября 2025
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-4">
        <div className="text-center">
          <div className="bg-primary/10 rounded-lg p-4 mb-3">
            <span className="text-3xl font-bold text-primary">{timeLeft.days}</span>
          </div>
          <p className="text-sm text-muted-foreground font-light">дней</p>
        </div>
        
        <div className="text-center">
          <div className="bg-primary/10 rounded-lg p-4 mb-3">
            <span className="text-3xl font-bold text-primary">{timeLeft.hours}</span>
          </div>
          <p className="text-sm text-muted-foreground font-light">часов</p>
        </div>
        
        <div className="text-center">
          <div className="bg-primary/10 rounded-lg p-4 mb-3">
            <span className="text-3xl font-bold text-primary">{timeLeft.minutes}</span>
          </div>
          <p className="text-sm text-muted-foreground font-light">минут</p>
        </div>
        
        <div className="text-center">
          <div className="bg-primary/10 rounded-lg p-4 mb-3">
            <span className="text-3xl font-bold text-primary">{timeLeft.seconds}</span>
          </div>
          <p className="text-sm text-muted-foreground font-light">секунд</p>
        </div>
      </div>
    </div>
  );
}
