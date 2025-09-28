import { useState, useEffect, useRef } from 'react';

export function WeddingStory() {
  const [visibleBlocks, setVisibleBlocks] = useState<boolean[]>([false, false, false]);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = blockRefs.current.indexOf(entry.target as HTMLDivElement);
            if (index !== -1) {
              setVisibleBlocks(prev => {
                const newBlocks = [...prev];
                newBlocks[index] = true;
                return newBlocks;
              });
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    blockRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const storyBlocks = [
    {
      id: 0,
      image: '/images/story-1.jpg',
      text: 'История нашей пары началась 18 июля 2021. Мы влюбились друг в друга с первого взгляда',
      imagePosition: 'right' as const
    },
    {
      id: 1,
      image: '/images/story-2.jpg',
      text: '8 июля 2025 мы решили пожениться',
      imagePosition: 'left' as const
    },
    {
      id: 2,
      image: '/images/story-3.jpg',
      text: '15 ноября 2025 состоится церемония бракосочетания. И мы будем рады, если вы разделите с нами радость этого дня!',
      imagePosition: 'right' as const
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {storyBlocks.map((block, index) => (
          <div
            key={block.id}
            ref={(el) => (blockRefs.current[index] = el)}
            className={`mb-16 md:mb-24 transition-all duration-1000 ease-out ${
              visibleBlocks[index] 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-12'
            }`}
          >
            <div className={`flex flex-col ${block.imagePosition === 'right' ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-16`}>
              {/* Text content */}
              <div className="flex-1 text-center md:text-left">
                <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
                  {block.text}
                </p>
              </div>
              
              {/* Image */}
              <div className="flex-1 max-w-md">
                <div className="relative overflow-hidden rounded-2xl shadow-lg">
                  <img
                    src={block.image}
                    alt={`История ${index + 1}`}
                    className="w-full h-64 md:h-80 object-cover transition-transform duration-500 hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
