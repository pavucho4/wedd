// Сервис для отправки данных RSVP
export interface RSVPData {
  guestName: string;
  tableNumber: string;
  attending: boolean;
  timestamp: string;
  userAgent: string;
  url: string;
}

// Импортируем типы из guestService
import { Guest, updateGuest, findGuestByName, addGuest } from './guestService';

// Функция для отправки данных на внешний сервис
export async function sendRSVPData(data: RSVPData): Promise<boolean> {
  try {
    // Вариант 1: Отправка на Google Forms (если у вас есть Google Form)
    // const googleFormUrl = 'YOUR_GOOGLE_FORM_URL';
    // const formData = new FormData();
    // formData.append('entry.XXXXXXX', data.guestName); // замените XXXXXXX на ID поля
    // formData.append('entry.XXXXXXX', data.tableNumber);
    // formData.append('entry.XXXXXXX', data.attending ? 'Да' : 'Нет');
    // formData.append('entry.XXXXXXX', data.timestamp);
    // 
    // const response = await fetch(googleFormUrl, {
    //   method: 'POST',
    //   body: formData,
    //   mode: 'no-cors'
    // });

    // Вариант 2: Отправка на ваш собственный API
    const apiUrl = 'https://your-api-endpoint.com/rsvp'; // замените на ваш URL
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return response.ok;
  } catch (error) {
    console.error('Ошибка отправки RSVP:', error);
    return false;
  }
}

// Функция для сохранения данных в localStorage (как резервный вариант)
export function saveRSVPToLocal(data: RSVPData): void {
  try {
    // Проверяем, есть ли уже ответ от этого гостя
    const existingData = JSON.parse(localStorage.getItem('wedding-rsvp') || '[]');
    const existingIndex = existingData.findIndex((item: RSVPData) => 
      item.guestName.toLowerCase().trim() === data.guestName.toLowerCase().trim()
    );
    
    if (existingIndex !== -1) {
      // Обновляем существующий ответ
      existingData[existingIndex] = data;
    } else {
      // Добавляем новый ответ
      existingData.push(data);
    }
    
    localStorage.setItem('wedding-rsvp', JSON.stringify(existingData));
    
    // Синхронизируем с системой гостей
    const guest = findGuestByName(data.guestName);
    if (guest) {
      updateGuest(guest.id, {
        attending: data.attending,
        timestamp: data.timestamp
      });
    } else {
      // Если гостя нет в системе, создаем его
      addGuest({
        names: [data.guestName],
        tableNumber: data.tableNumber,
        attending: data.attending,
        timestamp: data.timestamp
      });
    }
  } catch (error) {
    console.error('Ошибка сохранения в localStorage:', error);
  }
}

// Функция для получения всех сохраненных RSVP
export function getSavedRSVPs(): RSVPData[] {
  try {
    return JSON.parse(localStorage.getItem('wedding-rsvp') || '[]');
  } catch (error) {
    console.error('Ошибка получения данных из localStorage:', error);
    return [];
  }
}

// Функция для экспорта данных в CSV
export function exportRSVPToCSV(): string {
  const data = getSavedRSVPs();
  if (data.length === 0) return '';

  const headers = ['Имя гостя', 'Номер столика', 'Придет ли', 'Дата ответа', 'URL'];
  const csvContent = [
    headers.join(','),
    ...data.map(item => [
      `"${item.guestName}"`,
      `"${item.tableNumber}"`,
      `"${item.attending ? 'Да' : 'Нет'}"`,
      `"${item.timestamp}"`,
      `"${item.url}"`
    ].join(','))
  ].join('\n');

  return csvContent;
}

// Функция для скачивания CSV файла
export function downloadRSVPCSV(): void {
  const csvContent = exportRSVPToCSV();
  if (!csvContent) {
    alert('Нет данных для экспорта');
    return;
  }

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `wedding-rsvp-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Функция для синхронизации всех RSVP ответов с системой гостей
export function syncRSVPWithGuests(): void {
  try {
    const rsvpData = getSavedRSVPs();
    const guests = JSON.parse(localStorage.getItem('wedding-guests') || '[]');
    
    rsvpData.forEach(rsvp => {
      // Ищем гостя по имени
      const guest = guests.find((g: Guest) => 
        g.names.some(name => 
          name.toLowerCase().trim() === rsvp.guestName.toLowerCase().trim()
        )
      );
      
      if (guest) {
        // Обновляем статус существующего гостя
        updateGuest(guest.id, {
          attending: rsvp.attending,
          timestamp: rsvp.timestamp
        });
      } else {
        // Создаем нового гостя из RSVP ответа
        addGuest({
          names: [rsvp.guestName],
          tableNumber: rsvp.tableNumber,
          attending: rsvp.attending,
          timestamp: rsvp.timestamp
        });
      }
    });
    
    console.log('Синхронизация RSVP с гостями завершена');
  } catch (error) {
    console.error('Ошибка синхронизации:', error);
  }
}
