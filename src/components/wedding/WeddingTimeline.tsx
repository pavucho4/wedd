import { Clock, Users, Utensils, PartyPopper } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface WeddingTimelineProps {
  showRegistration?: boolean;
}

export function WeddingTimeline({ showRegistration = true }: WeddingTimelineProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleEvents, setVisibleEvents] = useState<boolean[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const eventRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const eventObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = eventRefs.current.indexOf(entry.target as HTMLDivElement);
            if (index !== -1) {
              setVisibleEvents(prev => {
                const newEvents = [...prev];
                newEvents[index] = true;
                return newEvents;
              });
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    eventRefs.current.forEach((ref) => {
      if (ref) eventObserver.observe(ref);
    });

    return () => {
      observer.disconnect();
      eventObserver.disconnect();
    };
  }, []);

  const allEvents = [
    {
      time: '12:40',
      title: 'Регистрация',
      description: 'Церемония бракосочетания',
      note: 'посещение свободное',
      icon: Clock,
      isRegistration: true,
    },
    {
      time: '16:30',
      title: 'Сбор гостей',
      description: 'Встреча и приветствие гостей',
      note: 'фуршет',
      icon: Users,
    },
    {
      time: '17:00',
      title: 'Банкет',
      description: 'Праздничный ужин и торжество',
      note: 'основная программа',
      icon: Utensils,
    },
    {
      time: '00:00',
      title: 'Окончание',
      description: 'Завершение торжества',
      note: 'до свидания!',
      icon: PartyPopper,
    }
  ];

  const timelineEvents = showRegistration 
    ? allEvents 
    : allEvents.filter(event => !event.isRegistration);

  return (
    <section 
      ref={sectionRef}
      className={`py-20 px-6 bg-gradient-to-b from-background to-secondary/20 transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="staggered-fade text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-primary mb-4">
            Расписание
          </h2>
          <p className="text-muted-foreground font-light max-w-md mx-auto">
            нашего особенного дня
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-full bg-gradient-to-b from-primary/30 to-transparent hidden md:block" />
          
          <div className="space-y-12">
            {timelineEvents.map((event, index) => {
              const IconComponent = event.icon;
              const isEven = index % 2 === 0;
              
              return (
                <div
                  key={index}
                  ref={(el) => (eventRefs.current[index] = el)}
                  className={`relative flex items-center ${
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  } flex-col gap-8 transition-all duration-700 ease-out ${
                    visibleEvents[index] 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background shadow-lg hidden md:block z-10" />
                  
                  {/* Content card */}
                  <div className="flex-1 max-w-md">
                    <div className="timeline-card rounded-2xl p-8 relative">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-accent/30 flex items-center justify-center">
                          <IconComponent className="w-7 h-7 text-primary" />
                        </div>
                        <div className="text-3xl font-serif text-primary font-light">
                          {event.time}
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-serif text-primary mb-3">
                        {event.title}
                      </h3>
                      <p className="text-muted-foreground font-light mb-2 leading-relaxed">
                        {event.description}
                      </p>
                      <p className="text-sm text-primary/70 font-light italic">
                        {event.note}
                      </p>
                    </div>
                  </div>
                  
                  {/* Spacer for alternating layout */}
                  <div className="flex-1 hidden md:block" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}