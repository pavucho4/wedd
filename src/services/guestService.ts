// Сервис для управления гостями и столиками
export interface Guest {
    id: string;
    names: string[]; // Массив возможных вариантов имени
    tableNumber: string;
    attending?: boolean; // undefined = не ответил, true = придет, false = не придет
    timestamp?: string;
}

// Базовый URL для API
const API_BASE = '/api';

// Функция для получения всех гостей с сервера
export async function getGuests(): Promise<Guest[]> {
    try {
        // Временно отключаем API вызов
        // const response = await fetch(`${API_BASE}/guests`);
        // if (response.ok) {
        //     return await response.json();
        // }
        // throw new Error(`Server responded with status: ${response.status}`);
        
        // Используем только локальное хранилище
        return getGuestsFromLocal();
    } catch (error) {
        console.error('Ошибка получения гостей с сервера:', error);
        // Резервный вариант из localStorage
        return getGuestsFromLocal();
    }
}

// Функция для сохранения гостей на сервер
export async function saveGuests(guests: Guest[]): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE}/guests`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(guests),
        });
        return response.ok;
    } catch (error) {
        console.error('Ошибка сохранения гостей на сервер:', error);
        // Резервное сохранение в localStorage
        saveGuestsToLocal(guests);
        return false;
    }
}

// Функция для добавления нового гостя
export async function addGuest(guest: Omit<Guest, 'id'>): Promise<boolean> {
    const newGuest: Guest = {
        ...guest,
        id: generateGuestId()
    };

    try {
        const response = await fetch(`${API_BASE}/guests`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newGuest),
        });

        if (response.ok) {
            return true;
        }
        throw new Error(`Server responded with status: ${response.status}`);
    } catch (error) {
        console.error('Ошибка добавления гостя на сервер:', error);
        // Резервное сохранение в localStorage
        addGuestToLocal(newGuest);
        return false;
    }
}

// Функция для обновления гостя
export async function updateGuest(guestId: string, updates: Partial<Guest>): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE}/guests/${guestId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updates),
        });

        if (response.ok) {
            return true;
        }
        throw new Error(`Server responded with status: ${response.status}`);
    } catch (error) {
        console.error('Ошибка обновления гостя на сервер:', error);
        // Резервное обновление в localStorage
        updateGuestInLocal(guestId, updates);
        return false;
    }
}

// Функция для поиска гостя по имени
export async function findGuestByName(name: string): Promise<Guest | null> {
    try {
        const guests = await getGuests();
        const query = normalizeName(name);

        const foundGuest = guests.find(guest =>
            guest.names.some(guestName => isNameMatch(normalizeName(guestName), query))
        );

        return foundGuest || null;
    } catch (error) {
        console.error('Ошибка поиска гостя:', error);
        // Резервный поиск в localStorage
        return findGuestByNameInLocal(name);
    }
}

// Функция для поиска гостей по номеру столика
export async function findGuestsByTable(tableNumber: string): Promise<Guest[]> {
    try {
        const guests = await getGuests();
        return guests.filter(guest => guest.tableNumber === tableNumber);
    } catch (error) {
        console.error('Ошибка поиска гостей по столику:', error);
        return findGuestsByTableInLocal(tableNumber);
    }
}

// Функция для получения статистики
export async function getGuestStats(): Promise<{ total: number; attending: number; notAttending: number; noResponse: number }> {
    try {
        const guests = await getGuests();
        const total = guests.length;
        const attending = guests.filter(g => g.attending === true).length;
        const notAttending = guests.filter(g => g.attending === false).length;
        const noResponse = guests.filter(g => g.attending === undefined).length;

        return { total, attending, notAttending, noResponse };
    } catch (error) {
        console.error('Ошибка получения статистики:', error);
        return { total: 0, attending: 0, notAttending: 0, noResponse: 0 };
    }
}

// Функция для удаления гостя
export async function deleteGuest(guestId: string): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE}/guests/${guestId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            return true;
        }
        throw new Error(`Server responded with status: ${response.status}`);
    } catch (error) {
        console.error('Ошибка удаления гостя на сервер:', error);
        // Резервное удаление в localStorage
        deleteGuestFromLocal(guestId);
        return false;
    }
}

// Вспомогательные функции
function generateGuestId(): string {
    return Date.now().toString() + Math.random().toString(36).substring(2, 11);
}

// Локальные функции как резервный вариант
function getGuestsFromLocal(): Guest[] {
    try {
        return JSON.parse(localStorage.getItem('wedding-guests') || '[]');
    } catch (error) {
        console.error('Ошибка чтения гостей из localStorage:', error);
        return [];
    }
}

function saveGuestsToLocal(guests: Guest[]): void {
    try {
        localStorage.setItem('wedding-guests', JSON.stringify(guests));
    } catch (error) {
        console.error('Ошибка сохранения гостей в localStorage:', error);
    }
}

function addGuestToLocal(guest: Guest): void {
    const guests = getGuestsFromLocal();
    guests.push(guest);
    saveGuestsToLocal(guests);
}

function updateGuestInLocal(guestId: string, updates: Partial<Guest>): void {
    const guests = getGuestsFromLocal();
    const index = guests.findIndex(g => g.id === guestId);
    if (index !== -1) {
        guests[index] = { ...guests[index], ...updates };
        saveGuestsToLocal(guests);
    }
}

function deleteGuestFromLocal(guestId: string): void {
    const guests = getGuestsFromLocal();
    const filteredGuests = guests.filter(g => g.id !== guestId);
    saveGuestsToLocal(filteredGuests);
}

function findGuestByNameInLocal(name: string): Guest | null {
    const guests = getGuestsFromLocal();
    const query = normalizeName(name);

    const foundGuest = guests.find(guest =>
        guest.names.some(guestName => isNameMatch(normalizeName(guestName), query))
    );

    return foundGuest || null;
}

// Нормализация: приводим к нижнему регистру, убираем лишние пробелы
function normalizeName(raw: string): string {
    return raw
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .trim();
}

// Гибкое сравнение имён: точное совпадение, вхождение и совпадение по токенам
function isNameMatch(candidate: string, query: string): boolean {
    if (!candidate || !query) return false;
    if (candidate === query) return true;
    if (candidate.includes(query)) return true;

    const candidateTokens = candidate.split(' ');
    const queryTokens = query.split(' ');

    // Все токены запроса должны встречаться в кандидате (в любом порядке)
    return queryTokens.every(qt => candidateTokens.some(ct => ct.startsWith(qt)));
}

function findGuestsByTableInLocal(tableNumber: string): Guest[] {
    const guests = getGuestsFromLocal();
    return guests.filter(guest => guest.tableNumber === tableNumber);
}

// Функции экспорта остаются без изменений (работают с локальными данными)
export function exportGuestsToCSV(): string {
    const guests = getGuestsFromLocal();
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