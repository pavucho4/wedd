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

// Базовый URL для API
const API_BASE = process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/api'
    : '/api';

// Функция для отправки данных RSVP на сервер
export async function sendRSVPData(data: RSVPData): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE}/rsvp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            return true;
        }
        throw new Error('Server error');
    } catch (error) {
        console.error('Ошибка отправки RSVP на сервер:', error);
        // Резервное сохранение в localStorage
        saveRSVPToLocal(data);
        return false;
    }
}

// Функция для получения всех сохраненных RSVP
export async function getSavedRSVPs(): Promise<RSVPData[]> {
    try {
        const response = await fetch(`${API_BASE}/rsvp`);
        if (response.ok) {
            return await response.json();
        }
        throw new Error('Server error');
    } catch (error) {
        console.error('Ошибка получения RSVP данных с сервера:', error);
        return getRSVPsFromLocal();
    }
}

// Функция для сохранения данных в localStorage (как резервный вариант)
export function saveRSVPToLocal(data: RSVPData): void {
    try {
        // Проверяем, есть ли уже ответ от этого гостя
        const existingData = getRSVPsFromLocal();
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
        syncRSVPWithGuests();
    } catch (error) {
        console.error('Ошибка сохранения в localStorage:', error);
    }
}

// Локальная функция получения RSVP
function getRSVPsFromLocal(): RSVPData[] {
    try {
        return JSON.parse(localStorage.getItem('wedding-rsvp') || '[]');
    } catch (error) {
        return [];
    }
}

// Функция для синхронизации всех RSVP ответов с системой гостей
export async function syncRSVPWithGuests(): Promise<void> {
    try {
        const rsvpData = getRSVPsFromLocal();

        for (const rsvp of rsvpData) {
            const guest = await findGuestByName(rsvp.guestName);

            if (guest) {
                // Обновляем статус существующего гостя
                await updateGuest(guest.id, {
                    attending: rsvp.attending,
                    timestamp: rsvp.timestamp
                });
            } else {
                // Создаем нового гостя из RSVP ответа
                await addGuest({
                    names: [rsvp.guestName],
                    tableNumber: rsvp.tableNumber,
                    attending: rsvp.attending,
                    timestamp: rsvp.timestamp
                });
            }
        }

        console.log('Синхронизация RSVP с гостями завершена');
    } catch (error) {
        console.error('Ошибка синхронизации:', error);
    }
}

// Функции экспорта остаются без изменений (работают с локальными данными)
export function exportRSVPToCSV(): string {
    const data = getRSVPsFromLocal();
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