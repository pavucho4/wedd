import { useState, useEffect, useRef } from 'react';
import { Heart, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { sendRSVPData } from '@/services/rsvpService';

interface WeddingRSVPProps {
  guestName: string;
  tableNumber: string;
}

export function WeddingRSVP({ guestName, tableNumber }: WeddingRSVPProps) {
  const [response, setResponse] = useState<'yes' | 'no' | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { toast } = useToast();

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

  const handleResponse = async (attending: boolean) => {
    const newResponse = attending ? 'yes' : 'no';
    setResponse(newResponse);

    const payload = {
      guestName: guestName,
      tableNumber: tableNumber,
      attending: attending,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: typeof window !== 'undefined' ? window.location.href : ''
    };

    const ok = await sendRSVPData(payload);
    setIsSubmitted(true);
    toast({
      title: attending ? "Спасибо за подтверждение!" : "Спасибо за ответ",
      description: attending 
        ? "Мы с нетерпением ждем встречи с вами на нашем празднике!"
        : (ok ? "Нам жаль, что вы не сможете присоединиться к нам." : "Произошла ошибка при отправке ответа. Попробуйте позже."),
    });
  };

  if (isSubmitted) {
    return (
      <section className="py-20 px-6 bg-gradient-to-b from-muted/20 to-background">
        <div className="max-w-2xl mx-auto text-center">
          <div className="card-elegant rounded-2xl p-8 md:p-12">
            <div className="mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                {response === 'yes' ? (
                  <Heart className="w-8 h-8 text-primary" />
                ) : (
                  <Check className="w-8 h-8 text-primary" />
                )}
              </div>
            </div>
            
            <h3 className="text-2xl font-serif text-primary mb-4">
              {response === 'yes' ? 'До встречи на свадьбе!' : 'Спасибо за ответ'}
            </h3>
            
            <p className="text-muted-foreground font-light mb-6">
              {response === 'yes' 
                ? `Ваше место за столом №${tableNumber} будет вас ждать. Мы очень рады, что вы будете с нами в этот особенный день!`
                : 'Мы понимаем, что обстоятельства бывают разные. Спасибо за то, что уведомили нас.'
              }
            </p>

            {response === 'yes' && (
              <div className="bg-accent/50 rounded-lg p-6 text-center">
                <p className="text-sm text-muted-foreground font-light mb-2">Ваш столик</p>
                <p className="text-4xl font-serif text-primary font-bold">№{tableNumber}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={sectionRef}
      className={`py-20 px-6 bg-gradient-to-b from-muted/20 to-background transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif text-primary mb-6 staggered-fade">
            Подтвердите участие
          </h2>
          <p className="text-lg text-muted-foreground font-light staggered-fade">
            Пожалуйста, дайте нам знать, сможете ли вы присутствовать на нашем празднике
          </p>
        </div>

        <div className="card-elegant rounded-2xl p-8 md:p-12 staggered-fade">
          <div className="text-center mb-8">
            <p className="text-lg text-muted-foreground font-light mb-2">
              Дорогой {guestName}
            </p>
            <div className="bg-accent/50 rounded-lg p-6 inline-block">
              <p className="text-sm text-muted-foreground font-light mb-2">Ваш столик</p>
              <p className="text-4xl font-serif text-primary font-bold">№{tableNumber}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Button
              onClick={() => handleResponse(true)}
              className="btn-elegant h-16 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-lg font-medium group"
              disabled={response !== null}
            >
              <Check className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Буду присутствовать
            </Button>
            
            <Button
              onClick={() => handleResponse(false)}
              variant="outline"
              className="btn-elegant h-16 border-2 rounded-xl text-lg font-medium hover:bg-muted/50 group"
              disabled={response !== null}
            >
              <X className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Не смогу прийти
            </Button>
          </div>

          {response && !isSubmitted && (
            <div className="mt-6 p-4 bg-muted/30 rounded-lg animate-fadeInUp">
              <p className="text-sm text-muted-foreground text-center font-light">
                Отправляем ваш ответ...
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}