import { useState, useEffect, useRef } from 'react';

export function WeddingDressCode() {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleColors, setVisibleColors] = useState<boolean[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const colorRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const colorObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = colorRefs.current.indexOf(entry.target as HTMLDivElement);
            if (index !== -1) {
              setVisibleColors(prev => {
                const newColors = [...prev];
                newColors[index] = true;
                return newColors;
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

    colorRefs.current.forEach((ref) => {
      if (ref) colorObserver.observe(ref);
    });

    return () => {
      observer.disconnect();
      colorObserver.disconnect();
    };
  }, []);

  const femaleColors = [
    { name: 'Шоколад', color: 'hsl(25, 30%, 35%)' },
    { name: 'Мокко', color: 'hsl(30, 25%, 45%)' },
    { name: 'Бежевый', color: 'hsl(35, 35%, 65%)' },
    { name: 'Кремовый', color: 'hsl(40, 40%, 80%)' },
    { name: 'Пудра', color: 'hsl(20, 20%, 85%)' },
    { name: 'Шампань', color: 'hsl(50, 40%, 92%)' }
  ];

  const maleColors = [
    { name: 'Черный', color: 'hsl(0, 0%, 10%)' },
    { name: 'Темно-серый', color: 'hsl(0, 0%, 30%)' },
    { name: 'Светло-серый', color: 'hsl(0, 0%, 65%)' },
    { name: 'Бежевый', color: 'hsl(35, 35%, 65%)' }
  ];

  return (
    <section 
      ref={sectionRef}
      className={`py-20 px-6 bg-gradient-to-b from-secondary/20 to-background transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      <div className="max-w-4xl mx-auto">
        <div className="staggered-fade text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-primary mb-4">
            Дресс-код
          </h2>
          <p className="text-muted-foreground font-light max-w-md mx-auto">
            Элегантные оттенки для нашего особенного дня
          </p>
        </div>

        <div className="staggered-fade mb-16">
          {/* Female Colors */}
          <div className="mb-12">
            <h3 className="text-2xl font-serif text-primary mb-8 text-center">Для неё</h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6 max-w-2xl mx-auto">
              {femaleColors.map((colorItem, index) => (
                <div
                  key={index}
                  ref={(el) => (colorRefs.current[index] = el)}
                  className={`relative group cursor-pointer transition-all duration-1000 ease-out ${
                    visibleColors[index] 
                      ? 'opacity-100 translate-y-0 scale-100' 
                      : 'opacity-0 translate-y-8 scale-95'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="brush-stroke relative overflow-hidden rounded-xl aspect-square">
                    <div
                      className="absolute inset-0 brush-effect"
                      style={{ backgroundColor: colorItem.color }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-white font-medium text-xs bg-black/60 px-2 py-1 rounded-full backdrop-blur-sm">
                        {colorItem.name}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Male Colors */}
          <div>
            <h3 className="text-2xl font-serif text-primary mb-8 text-center">Для него</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-xl mx-auto">
              {maleColors.map((colorItem, index) => (
                <div
                  key={index}
                  ref={(el) => (colorRefs.current[femaleColors.length + index] = el)}
                  className={`relative group cursor-pointer transition-all duration-1000 ease-out ${
                    visibleColors[femaleColors.length + index] 
                      ? 'opacity-100 translate-y-0 scale-100' 
                      : 'opacity-0 translate-y-8 scale-95'
                  }`}
                  style={{ transitionDelay: `${(femaleColors.length + index) * 100}ms` }}
                >
                  <div className="brush-stroke relative overflow-hidden rounded-xl aspect-square">
                    <div
                      className="absolute inset-0 brush-effect"
                      style={{ backgroundColor: colorItem.color }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-white font-medium text-xs bg-black/60 px-2 py-1 rounded-full backdrop-blur-sm">
                        {colorItem.name}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="staggered-fade text-center">
          <div className="card-elegant rounded-2xl p-8 max-w-2xl mx-auto">
            <p className="text-muted-foreground font-light leading-relaxed">
              Мы будем рады видеть вас в нарядах теплых оттенков нашей палитры. 
              Элегантность и стиль в благородных тонах подчеркнут торжественность момента
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}