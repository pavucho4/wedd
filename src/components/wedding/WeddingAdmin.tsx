import { useState, useEffect } from 'react';
import { Users, Check, X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getGuests } from '@/services/guestService';

interface GuestResponse {
  id: string;
  name: string;
  tableNumber: string;
  response: 'yes' | 'no' | null;
  timestamp?: string;
}

export function WeddingAdmin() {
  const [guests, setGuests] = useState<GuestResponse[]>([]);

  useEffect(() => {
    (async () => {
      const loaded = await getGuests();
      const mapped: GuestResponse[] = loaded.map(g => ({
        id: g.id,
        name: g.names.join('; '),
        tableNumber: g.tableNumber,
        response: g.attending === undefined ? null : (g.attending ? 'yes' : 'no'),
        timestamp: g.timestamp
      }));
      setGuests(mapped);
    })();
  }, []);

  const handleExport = () => {
    const csvContent = [
      ['Имя', 'Столик', 'Ответ', 'Время ответа'].join(','),
      ...guests.map(guest => [
        guest.name,
        guest.tableNumber,
        guest.response === 'yes' ? 'Придет' : guest.response === 'no' ? 'Не придет' : 'Не ответил',
        guest.timestamp || '-'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'wedding_guests.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStats = () => {
    const confirmed = guests.filter(g => g.response === 'yes').length;
    const declined = guests.filter(g => g.response === 'no').length;
    const pending = guests.filter(g => g.response === null).length;
    return { confirmed, declined, pending, total: guests.length };
  };

  const stats = getStats();

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif text-primary mb-4">Панель администратора</h1>
          <p className="text-muted-foreground">Управление гостями и ответами</p>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="card-elegant rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-primary">{stats.total}</h3>
            <p className="text-sm text-muted-foreground">Всего гостей</p>
          </div>
          
          <div className="card-elegant rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-green-600">{stats.confirmed}</h3>
            <p className="text-sm text-muted-foreground">Придут</p>
          </div>
          
          <div className="card-elegant rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <X className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-red-600">{stats.declined}</h3>
            <p className="text-sm text-muted-foreground">Не придут</p>
          </div>
          
          <div className="card-elegant rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="w-6 h-6 bg-yellow-600 rounded-full" />
            </div>
            <h3 className="text-2xl font-bold text-yellow-600">{stats.pending}</h3>
            <p className="text-sm text-muted-foreground">Ждем ответа</p>
          </div>
        </div>

        {/* Export Button */}
        <div className="flex justify-end mb-6">
          <Button onClick={handleExport} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Экспорт в CSV
          </Button>
        </div>

        {/* Guests List */}
        <div className="card-elegant rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Имя гостя</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Столик</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Статус</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Время ответа</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {guests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-muted/20">
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{guest.name}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">#{guest.tableNumber}</td>
                    <td className="px-6 py-4">
                      {guest.response === 'yes' && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/10 text-green-600 rounded-full text-sm">
                          <Check className="w-3 h-3" />
                          Придет
                        </span>
                      )}
                      {guest.response === 'no' && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/10 text-red-600 rounded-full text-sm">
                          <X className="w-3 h-3" />
                          Не придет
                        </span>
                      )}
                      {guest.response === null && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/10 text-yellow-600 rounded-full text-sm">
                          Ждем ответа
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {guest.timestamp || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}