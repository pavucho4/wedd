import { Heart, Instagram, Phone } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export function WeddingFooter() {
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

  return (
    <footer 
      ref={sectionRef}
      className={`py-16 px-6 bg-gradient-to-t from-secondary/30 to-background transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      <div className="max-w-4xl mx-auto text-center">
        <div className="staggered-fade mb-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/50" />
            <Heart className="w-6 h-6 text-primary" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/50" />
          </div>
          
          <h3 className="text-2xl md:text-3xl font-serif text-primary mb-4">
            Даниил & Алина
          </h3>
          
          <p className="text-muted-foreground font-light max-w-md mx-auto mb-6">
            Мы с нетерпением ждем этого особенного дня, когда сможем разделить нашу радость с самыми дорогими людьми
          </p>
        </div>

        <div className="staggered-fade mb-8">
          <div className="card-elegant rounded-xl p-6 max-w-sm mx-auto">
            <p className="text-sm text-muted-foreground font-light mb-2">
              По всем вопросам обращайтесь:
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

        <div className="staggered-fade">
          <p className="text-xs text-muted-foreground font-light">
            15 ноября 2025 • Ставрополь
          </p>
        </div>
      </div>
    </footer>
  );
}