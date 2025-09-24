import { WeddingHero } from '@/components/wedding/WeddingHero';
import { WeddingTimeline } from '@/components/wedding/WeddingTimeline';
import { WeddingDressCode } from '@/components/wedding/WeddingDressCode';
import { WeddingLocations } from '@/components/wedding/WeddingLocations';
import { WeddingRSVP } from '@/components/wedding/WeddingRSVP';
import { WeddingCountdown } from '@/components/wedding/WeddingCountdown';
import { WeddingFooter } from '@/components/wedding/WeddingFooter';
import { RSVPAdmin } from '@/components/admin/RSVPAdmin';
import { usePersonalization } from '@/hooks/usePersonalization';

const Index = () => {
  const { name, tableNumber, showRegistry, isAdmin } = usePersonalization();

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <WeddingHero guestName={name} />
      <WeddingTimeline showRegistry={showRegistry} />
      <WeddingDressCode />
      <WeddingLocations showRegistry={showRegistry} />
      <WeddingRSVP guestName={name} tableNumber={tableNumber} />
      <WeddingCountdown />
      <WeddingFooter />
      {isAdmin && <RSVPAdmin />}
    </main>
  );
};

export default Index;
