import { useState, useEffect } from 'react';
import { Users, Check, X, Download, Plus, RefreshCw, Trash2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { getGuests, addGuest, deleteGuest, updateGuest } from '@/services/guestService';
import { getSavedRSVPs, deleteRSVP } from '@/services/rsvpService';
import { useToast } from '@/hooks/use-toast';

interface GuestResponse {
  id: string;
  name: string;
  tableNumber: string;
  response: 'yes' | 'no' | null;
  timestamp?: string;
  source: 'guest' | 'rsvp'; // Откуда пришли данные
  rsvpId?: string; // ID RSVP ответа для удаления
}

export function WeddingAdmin() {
  const [guests, setGuests] = useState<GuestResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newGuest, setNewGuest] = useState({ names: '', tableNumber: '' });
  const { toast } = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      // Загружаем гостей из таблицы guests
      const loadedGuests = await getGuests();
      const guestMapped: GuestResponse[] = loadedGuests.map(g => ({
        id: g.id,
        name: g.names.join('; '),
        tableNumber: g.tableNumber,
        response: g.attending === undefined ? null : (g.attending ? 'yes' : 'no'),
        timestamp: g.timestamp,
        source: 'guest' as const
      }));

        // Загружаем RSVP ответы
        const rsvps = await getSavedRSVPs();
        const rsvpMapped: GuestResponse[] = rsvps.map(r => ({
          id: `rsvp-${r.timestamp}-${r.guestName}`,
          name: r.guestName,
          tableNumber: r.tableNumber,
          response: r.attending ? 'yes' : 'no',
          timestamp: r.timestamp,
          source: 'rsvp' as const,
          rsvpId: r.id // Сохраняем оригинальный ID для удаления
        }));

      // Объединяем и убираем дубликаты (приоритет RSVP ответам)
      const combined = [...guestMapped];
      rsvpMapped.forEach(rsvp => {
        const existingIndex = combined.findIndex(g => 
          g.name.toLowerCase() === rsvp.name.toLowerCase() && 
          g.tableNumber === rsvp.tableNumber
        );
        if (existingIndex >= 0) {
          // Обновляем существующего гостя с RSVP ответом
          combined[existingIndex] = rsvp;
        } else {
          // Добавляем новый RSVP ответ
          combined.push(rsvp);
        }
      });

      setGuests(combined);
    } catch (error) {
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить данные гостей",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddGuest = async () => {
    if (!newGuest.names.trim() || !newGuest.tableNumber.trim()) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля",
        variant: "destructive"
      });
      return;
    }

    try {
      const success = await addGuest({
        names: newGuest.names.split(',').map(n => n.trim()).filter(Boolean),
        tableNumber: newGuest.tableNumber.trim(),
        attending: undefined,
        timestamp: new Date().toISOString()
      });

      if (success) {
        toast({
          title: "Успех",
          description: "Гость добавлен успешно"
        });
        setNewGuest({ names: '', tableNumber: '' });
        setIsAddDialogOpen(false);
        loadData(); // Перезагружаем данные
      } else {
        throw new Error('Failed to add guest');
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось добавить гостя",
        variant: "destructive"
      });
    }
  };

  const handleDeleteGuest = async (guestId: string, guestName: string) => {
    try {
      const success = await deleteGuest(guestId);
      if (success) {
        toast({
          title: "Успех",
          description: `Гость "${guestName}" удален`
        });
        loadData(); // Перезагружаем данные
      } else {
        throw new Error('Failed to delete guest');
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить гостя",
        variant: "destructive"
      });
    }
  };

  const handleDeleteRSVP = async (rsvpId: string, guestName: string) => {
    try {
      const success = await deleteRSVP(rsvpId);
      if (success) {
        toast({
          title: "Успех",
          description: `RSVP ответ "${guestName}" удален`
        });
        loadData(); // Перезагружаем данные
      } else {
        throw new Error('Failed to delete RSVP');
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить RSVP ответ",
        variant: "destructive"
      });
    }
  };

  const handleSync = async () => {
    setLoading(true);
    try {
      // Загружаем все RSVP ответы
      const rsvps = await getSavedRSVPs();
      const guests = await getGuests();
      
      let syncedCount = 0;
      
      // Синхронизируем RSVP ответы с гостями
      for (const rsvp of rsvps) {
        const existingGuest = guests.find(g => 
          g.names.some(name => 
            name.toLowerCase() === rsvp.guestName.toLowerCase()
          )
        );
        
        if (existingGuest) {
          // Обновляем статус гостя на основе RSVP ответа
          await updateGuest(existingGuest.id, {
            attending: rsvp.attending,
            timestamp: rsvp.timestamp
          });
          syncedCount++;
        }
      }
      
      toast({
        title: "Синхронизация завершена",
        description: `Синхронизировано ${syncedCount} записей`
      });
      
      loadData(); // Перезагружаем данные
    } catch (error) {
      toast({
        title: "Ошибка синхронизации",
        description: "Не удалось выполнить синхронизацию",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

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

        {/* Action Buttons */}
        <div className="flex justify-between mb-6">
          <div className="flex gap-2">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Добавить гостя
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Добавить нового гостя</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="names">Имена гостей</Label>
                    <Input
                      id="names"
                      placeholder="Иван Петров, Мария Иванова"
                      value={newGuest.names}
                      onChange={(e) => setNewGuest(prev => ({ ...prev, names: e.target.value }))}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Разделите имена запятыми
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="tableNumber">Номер столика</Label>
                    <Input
                      id="tableNumber"
                      placeholder="1"
                      value={newGuest.tableNumber}
                      onChange={(e) => setNewGuest(prev => ({ ...prev, tableNumber: e.target.value }))}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Отмена
                    </Button>
                    <Button onClick={handleAddGuest}>
                      Добавить
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={loadData} disabled={loading} className="flex items-center gap-2">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Обновить
            </Button>
            <Button variant="outline" onClick={handleSync} disabled={loading} className="flex items-center gap-2">
              <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Синхронизировать
            </Button>
          </div>
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
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Источник</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Действия</th>
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
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                        guest.source === 'rsvp' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {guest.source === 'rsvp' ? 'RSVP' : 'Гость'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              {guest.source === 'rsvp' ? 'Удалить RSVP ответ?' : 'Удалить гостя?'}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              {guest.source === 'rsvp' 
                                ? `Вы уверены, что хотите удалить RSVP ответ "${guest.name}"? Это действие нельзя отменить.`
                                : `Вы уверены, что хотите удалить гостя "${guest.name}"? Это действие нельзя отменить.`
                              }
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Отмена</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {
                                if (guest.source === 'rsvp' && guest.rsvpId) {
                                  handleDeleteRSVP(guest.rsvpId, guest.name);
                                } else {
                                  handleDeleteGuest(guest.id, guest.name);
                                }
                              }}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Удалить
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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