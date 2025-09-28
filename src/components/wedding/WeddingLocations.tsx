import { MapPin, Navigation, Clock } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface LocationCardProps {
  title: string;
  address: string;
  time: string;
  description: string;
  isOptional?: boolean;
}

function LocationCard({ title, address, time, description, isOptional }: LocationCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleDirections = () => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://yandex.ru/maps/?text=${encodedAddress}`, '_blank');
  };

  return (
    <div 
      ref={cardRef}
      className={`card-elegant rounded-xl p-6 group hover:shadow-floating transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <MapPin className="w-6 h-6 text-primary" />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-medium text-foreground">{title}</h3>
            {isOptional && (
              <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                по желанию
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2 mb-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="font-medium text-primary">{time}</span>
          </div>
          
          <p className="text-muted-foreground font-light mb-3 text-sm">{description}</p>
          
          <div className="flex items-start gap-2 mb-4">
            <Navigation className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">{address}</p>
          </div>
          
          <button
            onClick={handleDirections}
            className="btn-elegant inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300 text-sm font-medium"
          >
            <Navigation className="w-4 h-4" />
            Маршрут
          </button>
        </div>
      </div>
    </div>
  );
}

interface WeddingLocationsProps {
  showRegistration?: boolean;
}

export function WeddingLocations({ showRegistration = true }: WeddingLocationsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleLocations, setVisibleLocations] = useState<boolean[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const locationRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const locationObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = locationRefs.current.indexOf(entry.target as HTMLDivElement);
            if (index !== -1) {
              setVisibleLocations(prev => {
                const newLocations = [...prev];
                newLocations[index] = true;
                return newLocations;
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

    locationRefs.current.forEach((ref) => {
      if (ref) locationObserver.observe(ref);
    });

    return () => {
      observer.disconnect();
      locationObserver.disconnect();
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className={`py-20 px-6 bg-gradient-to-b from-background to-muted/20 transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-primary mb-6 staggered-fade">
            Где и когда
          </h2>
          <p className="text-lg text-muted-foreground font-light staggered-fade">
            Адреса наших торжественных мероприятий
          </p>
        </div>

        <div className={`grid gap-8 ${showRegistration ? 'md:grid-cols-2' : 'max-w-md mx-auto'}`}>
          {showRegistration && (
            <LocationCard
              title="Регистрация"
              address="просп. Октябрьской Революции, 1, Ставрополь"
              time="12:40"
              description="Торжественная церемония бракосочетания в ЗАГСе"
              isOptional={true}
            />
          )}
          
          <LocationCard
            title="Празднование"
            address="ул. Дзержинского, 114, Ставрополь (гостиница Континент, зал Эрмитаж)"
            time="16:30"
            description="Банкетный зал для нашего свадебного торжества"
          />
        </div>
      </div>
    </section>
  );
}