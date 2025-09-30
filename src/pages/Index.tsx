import { WeddingHero } from '@/components/wedding/WeddingHero';
import { WeddingStory } from '@/components/wedding/WeddingStory';
import { WeddingTimeline } from '@/components/wedding/WeddingTimeline';
import { WeddingDressCode } from '@/components/wedding/WeddingDressCode';
import { WeddingLocations } from '@/components/wedding/WeddingLocations';
import { WeddingRSVP } from '@/components/wedding/WeddingRSVP';
import { WeddingFooter } from '@/components/wedding/WeddingFooter';
import { WeddingCountdown } from '@/components/wedding/WeddingCountdown';
import { WeddingAdmin } from '@/components/wedding/WeddingAdmin';
import { usePersonalization } from '@/hooks/usePersonalization';

const Index = () => {
  const { name, tableNumber, gender, showRegistration, isAdmin } = usePersonalization();

  if (isAdmin) {
    return <WeddingAdmin />;
  }

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <WeddingHero guestName={name} gender={gender} />
      <WeddingStory />
      <WeddingTimeline showRegistration={showRegistration} />
      <WeddingDressCode />
      <WeddingLocations showRegistration={showRegistration} />
      <WeddingRSVP guestName={name} tableNumber={tableNumber} gender={gender} />
      <WeddingCountdown />
      <WeddingFooter />
    </main>
  );
};

export default Index;
