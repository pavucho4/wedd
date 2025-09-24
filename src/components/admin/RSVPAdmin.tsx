import { useState, useEffect } from 'react';
import { Download, Eye, Users, CheckCircle, XCircle, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getSavedRSVPs, downloadRSVPCSV, RSVPData, syncRSVPWithGuests } from '@/services/rsvpService';
import { getGuests, addGuest, updateGuest, deleteGuest, downloadGuestsCSV, Guest, getGuestStats } from '@/services/guestService';

export function RSVPAdmin() {
  const [rsvpData, setRsvpData] = useState<RSVPData[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [showData, setShowData] = useState(false);
  const [activeTab, setActiveTab] = useState<'rsvp' | 'guests'>('rsvp');
  const [isAddingGuest, setIsAddingGuest] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [newGuest, setNewGuest] = useState({
    names: [''],
    tableNumber: ''
  });
  const [guestStatsState, setGuestStatsState] = useState<{ total: number; attending: number; notAttending: number; noResponse: number }>({ total: 0, attending: 0, notAttending: 0, noResponse: 0 });

  useEffect(() => {
    // Автоматически синхронизируем RSVP с гостями при загрузке
    const initialize = async () => {
      await syncRSVPWithGuests();
      const [rsvps, guestsList, stats] = await Promise.all([
        getSavedRSVPs(),
        getGuests(),
        getGuestStats(),
      ]);
      setRsvpData(rsvps);
      setGuests(guestsList);
      setGuestStatsState(stats);
    };
    void initialize();
  }, []);

  const attendingCount = rsvpData.filter(item => item.attending).length;
  const notAttendingCount = rsvpData.filter(item => !item.attending).length;
  const guestStats = guestStatsState;

  const handleAddGuest = async () => {
    if (newGuest.names[0].trim() && newGuest.tableNumber.trim()) {
      await addGuest({
        names: newGuest.names.filter(name => name.trim()),
        tableNumber: newGuest.tableNumber.trim()
      });
      const [updatedGuests, stats] = await Promise.all([getGuests(), getGuestStats()]);
      setGuests(updatedGuests);
      setGuestStatsState(stats);
      setNewGuest({ names: [''], tableNumber: '' });
      setIsAddingGuest(false);
    }
  };

  const handleEditGuest = (guest: Guest) => {
    setEditingGuest(guest);
    setNewGuest({
      names: [...guest.names],
      tableNumber: guest.tableNumber
    });
  };

  const handleSaveGuest = async () => {
    if (editingGuest && newGuest.names[0].trim() && newGuest.tableNumber.trim()) {
      await updateGuest(editingGuest.id, {
        names: newGuest.names.filter(name => name.trim()),
        tableNumber: newGuest.tableNumber.trim()
      });
      const [updatedGuests, stats] = await Promise.all([getGuests(), getGuestStats()]);
      setGuests(updatedGuests);
      setGuestStatsState(stats);
      setEditingGuest(null);
      setNewGuest({ names: [''], tableNumber: '' });
    }
  };

  const handleDeleteGuest = async (guestId: string) => {
    if (confirm('Вы уверены, что хотите удалить этого гостя?')) {
      await deleteGuest(guestId);
      const [updatedGuests, stats] = await Promise.all([getGuests(), getGuestStats()]);
      setGuests(updatedGuests);
      setGuestStatsState(stats);
    }
  };

  const addNameField = () => {
    setNewGuest(prev => ({ ...prev, names: [...prev.names, ''] }));
  };

  const removeNameField = (index: number) => {
    if (newGuest.names.length > 1) {
      setNewGuest(prev => ({
        ...prev,
        names: prev.names.filter((_, i) => i !== index)
      }));
    }
  };

  const updateNameField = (index: number, value: string) => {
    setNewGuest(prev => ({
      ...prev,
      names: prev.names.map((name, i) => i === index ? value : name)
    }));
  };

  const handleSyncRSVP = async () => {
    await syncRSVPWithGuests();
    const [rsvps, guestsList, stats] = await Promise.all([
      getSavedRSVPs(),
      getGuests(),
      getGuestStats(),
    ]);
    setRsvpData(rsvps);
    setGuests(guestsList);
    setGuestStatsState(stats);
    alert('Синхронизация завершена!');
  };

  if (!showData) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setShowData(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-3 shadow-lg"
          title="Просмотр RSVP данных"
        >
          <Users className="w-5 h-5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-xl p-6 max-w-6xl w-full max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif text-primary">Админ-панель</h2>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowData(false)}
              variant="outline"
            >
              Закрыть
            </Button>
          </div>
        </div>

        {/* Вкладки */}
        <div className="flex gap-2 mb-6">
          <Button
            onClick={() => setActiveTab('rsvp')}
            variant={activeTab === 'rsvp' ? 'default' : 'outline'}
          >
            RSVP Ответы
          </Button>
          <Button
            onClick={() => setActiveTab('guests')}
            variant={activeTab === 'guests' ? 'default' : 'outline'}
          >
            Управление гостями
          </Button>
        </div>

        {activeTab === 'rsvp' && (
          <>
            {/* Статистика RSVP */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-accent/50 rounded-lg p-4 text-center">
                <Users className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-primary">{rsvpData.length}</p>
                <p className="text-sm text-muted-foreground">Всего ответов</p>
              </div>
              <div className="bg-green-100 rounded-lg p-4 text-center">
                <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">{attendingCount}</p>
                <p className="text-sm text-muted-foreground">Придут</p>
              </div>
              <div className="bg-red-100 rounded-lg p-4 text-center">
                <XCircle className="w-6 h-6 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-red-600">{notAttendingCount}</p>
                <p className="text-sm text-muted-foreground">Не придут</p>
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              <Button
                onClick={handleSyncRSVP}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Users className="w-4 h-4 mr-2" />
                Синхронизировать с гостями
              </Button>
              <Button
                onClick={downloadRSVPCSV}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Экспорт RSVP CSV
              </Button>
            </div>

            {/* Таблица RSVP данных */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Имя</th>
                    <th className="text-left p-2">Столик</th>
                    <th className="text-left p-2">Придет</th>
                    <th className="text-left p-2">Дата ответа</th>
                    <th className="text-left p-2">URL</th>
                  </tr>
                </thead>
                <tbody>
                  {rsvpData.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      <td className="p-2 font-medium">{item.guestName}</td>
                      <td className="p-2">№{item.tableNumber}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          item.attending 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.attending ? 'Да' : 'Нет'}
                        </span>
                      </td>
                      <td className="p-2 text-sm text-muted-foreground">{item.timestamp}</td>
                      <td className="p-2 text-sm text-muted-foreground max-w-xs truncate">
                        {item.url}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {rsvpData.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Пока нет данных RSVP</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'guests' && (
          <>
            {/* Статистика гостей */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-accent/50 rounded-lg p-4 text-center">
                <Users className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-primary">{guestStats.total}</p>
                <p className="text-sm text-muted-foreground">Всего гостей</p>
              </div>
              <div className="bg-green-100 rounded-lg p-4 text-center">
                <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">{guestStats.attending}</p>
                <p className="text-sm text-muted-foreground">Придут</p>
              </div>
              <div className="bg-red-100 rounded-lg p-4 text-center">
                <XCircle className="w-6 h-6 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-red-600">{guestStats.notAttending}</p>
                <p className="text-sm text-muted-foreground">Не придут</p>
              </div>
              <div className="bg-yellow-100 rounded-lg p-4 text-center">
                <Eye className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-yellow-600">{guestStats.noResponse}</p>
                <p className="text-sm text-muted-foreground">Не ответили</p>
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              <Button
                onClick={() => setIsAddingGuest(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Добавить гостя
              </Button>
              <Button
                onClick={downloadGuestsCSV}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Экспорт гостей CSV
              </Button>
            </div>

            {/* Форма добавления/редактирования гостя */}
            {(isAddingGuest || editingGuest) && (
              <div className="bg-muted/30 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-medium mb-4">
                  {editingGuest ? 'Редактировать гостя' : 'Добавить нового гостя'}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Варианты имени:</label>
                    {newGuest.names.map((name, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <Input
                          value={name}
                          onChange={(e) => updateNameField(index, e.target.value)}
                          placeholder="Полное имя"
                          className="flex-1"
                        />
                        {newGuest.names.length > 1 && (
                          <Button
                            onClick={() => removeNameField(index)}
                            variant="outline"
                            size="sm"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      onClick={addNameField}
                      variant="outline"
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Добавить вариант имени
                    </Button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Номер столика:</label>
                    <Input
                      value={newGuest.tableNumber}
                      onChange={(e) => setNewGuest(prev => ({ ...prev, tableNumber: e.target.value }))}
                      placeholder="Например: 5"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={editingGuest ? handleSaveGuest : handleAddGuest}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {editingGuest ? 'Сохранить' : 'Добавить'}
                    </Button>
                    <Button
                      onClick={() => {
                        setIsAddingGuest(false);
                        setEditingGuest(null);
                        setNewGuest({ names: [''], tableNumber: '' });
                      }}
                      variant="outline"
                    >
                      Отмена
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Таблица гостей */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Имена</th>
                    <th className="text-left p-2">Столик</th>
                    <th className="text-left p-2">Статус</th>
                    <th className="text-left p-2">Дата ответа</th>
                    <th className="text-left p-2">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {guests.map((guest) => (
                    <tr key={guest.id} className="border-b hover:bg-muted/50">
                      <td className="p-2">
                        <div className="space-y-1">
                          {guest.names.map((name, index) => (
                            <div key={index} className="font-medium">{name}</div>
                          ))}
                        </div>
                      </td>
                      <td className="p-2">№{guest.tableNumber}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          guest.attending === undefined 
                            ? 'bg-yellow-100 text-yellow-800'
                            : guest.attending 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {guest.attending === undefined ? 'Не ответил' : guest.attending ? 'Придет' : 'Не придет'}
                        </span>
                      </td>
                      <td className="p-2 text-sm text-muted-foreground">{guest.timestamp || '-'}</td>
                      <td className="p-2">
                        <div className="flex gap-1">
                          <Button
                            onClick={() => handleEditGuest(guest)}
                            variant="outline"
                            size="sm"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteGuest(guest.id)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {guests.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Пока нет добавленных гостей</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
