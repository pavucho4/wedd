// Сервис для управления гостями и столиками
export interface Guest {
  id: string;
  names: string[]; // Массив возможных вариантов имени
  tableNumber: string;
  attending?: boolean; // undefined = не ответил, true = придет, false = не придет
  timestamp?: string;
}

// Функция для получения всех гостей из localStorage
export function getGuests(): Guest[] {
  try {
    return JSON.parse(localStorage.getItem('wedding-guests') || '[]');
  } catch (error) {
    console.error('Ошибка получения гостей:', error);
    return [];
  }
}

// Функция для сохранения гостей в localStorage
export function saveGuests(guests: Guest[]): void {
  try {
    localStorage.setItem('wedding-guests', JSON.stringify(guests));
  } catch (error) {
    console.error('Ошибка сохранения гостей:', error);
  }
}

// Функция для добавления нового гостя
export function addGuest(guest: Omit<Guest, 'id'>): void {
  const guests = getGuests();
  const newGuest: Guest = {
    ...guest,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
  };
  guests.push(newGuest);
  saveGuests(guests);
}

// Функция для обновления гостя
export function updateGuest(guestId: string, updates: Partial<Guest>): void {
  const guests = getGuests();
  const index = guests.findIndex(g => g.id === guestId);
  if (index !== -1) {
    guests[index] = { ...guests[index], ...updates };
    saveGuests(guests);
  }
}

// Функция для удаления гостя
export function deleteGuest(guestId: string): void {
  const guests = getGuests();
  const filteredGuests = guests.filter(g => g.id !== guestId);
  saveGuests(filteredGuests);
}

// Функция для поиска гостя по имени
export function findGuestByName(name: string): Guest | null {
  const guests = getGuests();
  const normalizedName = name.toLowerCase().trim();
  
  return guests.find(guest => 
    guest.names.some(guestName => 
      guestName.toLowerCase().trim() === normalizedName
    )
  ) || null;
}

// Функция для поиска гостей по номеру столика
export function findGuestsByTable(tableNumber: string): Guest[] {
  const guests = getGuests();
  return guests.filter(guest => guest.tableNumber === tableNumber);
}

// Функция для получения статистики
export function getGuestStats() {
  const guests = getGuests();
  const total = guests.length;
  const attending = guests.filter(g => g.attending === true).length;
  const notAttending = guests.filter(g => g.attending === false).length;
  const noResponse = guests.filter(g => g.attending === undefined).length;
  
  return { total, attending, notAttending, noResponse };
}

// Функция для экспорта гостей в CSV
export function exportGuestsToCSV(): string {
  const guests = getGuests();
  if (guests.length === 0) return '';

  const headers = ['ID', 'Имена', 'Номер столика', 'Статус', 'Дата ответа'];
  const csvContent = [
    headers.join(','),
    ...guests.map(guest => [
      `"${guest.id}"`,
      `"${guest.names.join('; ')}"`,
      `"${guest.tableNumber}"`,
      `"${guest.attending === undefined ? 'Не ответил' : guest.attending ? 'Придет' : 'Не придет'}"`,
      `"${guest.timestamp || ''}"`
    ].join(','))
  ].join('\n');

  return csvContent;
}

// Функция для скачивания CSV файла с гостями
export function downloadGuestsCSV(): void {
  const csvContent = exportGuestsToCSV();
  if (!csvContent) {
    alert('Нет данных для экспорта');
    return;
  }

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `wedding-guests-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}