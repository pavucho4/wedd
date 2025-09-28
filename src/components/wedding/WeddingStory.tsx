import { useState, useEffect, useRef } from 'react';

export function WeddingStory() {
  const [visibleBlocks, setVisibleBlocks] = useState<boolean[]>([false, false, false]);
  const [visibleElements, setVisibleElements] = useState<{[key: string]: boolean}>({});
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const elementRefs = useRef<{[key: string]: HTMLDivElement | null}>({});

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

    const elementObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elementId = entry.target.getAttribute('data-element-id');
            if (elementId) {
              setVisibleElements(prev => ({
                ...prev,
                [elementId]: true
              }));
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    blockRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    Object.values(elementRefs.current).forEach((ref) => {
      if (ref) elementObserver.observe(ref);
    });

    return () => {
      observer.disconnect();
      elementObserver.disconnect();
    };
  }, []);

  const storyBlocks = [
    {
      id: 0,
      image: '/images/story-1.png',
      text: 'История нашей пары началась 18 июля 2021. Мы влюбились друг в друга с первого взгляда',
      imagePosition: 'right' as const
    },
    {
      id: 1,
      image: '/images/story-2.png',
      text: '8 июля 2025 мы решили пожениться',
      imagePosition: 'left' as const
    },
    {
      id: 2,
      image: '/images/story-3.png',
      text: '15 ноября 2025 состоится церемония бракосочетания. И мы будем рады, если вы разделите с нами радость этого дня!',
      imagePosition: 'right' as const
    }
  ];

  return (
    <section className="py-8 md:py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        {storyBlocks.map((block, index) => (
          <div
            key={block.id}
            ref={(el) => (blockRefs.current[index] = el)}
            className={`mb-8 md:mb-16 lg:mb-24 transition-all duration-700 ease-out ${
              visibleBlocks[index] 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-12'
            }`}
          >
            <div className={`flex flex-col ${block.imagePosition === 'right' ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-16 min-h-[300px] md:min-h-[400px]`}>
              {/* Text content */}
              <div 
                ref={(el) => (elementRefs.current[`text-${block.id}`] = el)}
                data-element-id={`text-${block.id}`}
                className={`flex-1 text-center transition-all duration-700 ease-out delay-100 px-4 md:px-0 ${
                  visibleElements[`text-${block.id}`] 
                    ? 'opacity-100 translate-x-0' 
                    : 'opacity-0 translate-x-8'
                }`}
              >
                <p className="story-text text-xl md:text-2xl">
                  {block.text}
                </p>
              </div>
              
              {/* Image - hidden on mobile for last block, smaller for others */}
              <div 
                ref={(el) => (elementRefs.current[`image-${block.id}`] = el)}
                data-element-id={`image-${block.id}`}
                className={`flex-1 max-w-lg transition-all duration-700 ease-out delay-200 ${
                  index === 2 ? 'hidden md:block' : 'block'
                } ${
                  visibleElements[`image-${block.id}`] 
                    ? 'opacity-100 translate-x-0' 
                    : 'opacity-0 translate-x-8'
                }`}
              >
                <div className="story-image-container">
                  <img
                    src={block.image}
                    alt={`История ${index + 1}`}
                    className="story-image w-full h-auto max-h-20 md:max-h-96 object-contain transition-transform duration-500 hover:scale-105 rounded-xl"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
