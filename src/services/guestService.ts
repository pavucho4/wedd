import { Guest } from "../types";

// Вспомогательные функции для преобразования данных между форматом приложения и Google Sheets
function mapGuestToSheetRow(guest: any) {
  return {
    id: guest.id,
    names: guest.names ? guest.names.join(";") : "",
    tableNumber: guest.tableNumber,
    attending: guest.attending !== undefined ? String(guest.attending) : "",
    timestamp: guest.timestamp || "",
  };
}

function mapSheetRowToGuest(row: any) {
  return {
    id: row.id,
    names: row.names ? row.names.split(";") : [],
    tableNumber: row.tableNumber,
    attending: row.attending === "true" ? true : row.attending === "false" ? false : undefined,
    timestamp: row.timestamp,
  };
}

// Функция для получения всех гостей через Vercel API
export async function getGuests(): Promise<Guest[]> {
    try {
        const response = await fetch("/api/guests");
        if (response.ok) {
            const guests = await response.json();
            return guests.map(mapSheetRowToGuest) as Guest[];
        } else {
            const errorData = await response.json();
            console.error("Ошибка получения гостей через API:", errorData);
            return [];
        }
    } catch (error) {
        console.error("Ошибка сети при получении гостей:", error);
        return [];
    }
}

// Функция для добавления нового гостя через Vercel API
export async function addGuest(guest: Omit<Guest, "id">): Promise<boolean> {
    const newGuest: Guest = {
        ...guest,
        id: Date.now().toString() + Math.random().toString(36).substring(2, 11)
    };

    try {
        const response = await fetch("/api/guests", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(mapGuestToSheetRow(newGuest)),
        });

        if (response.ok) {
            console.log("Гость успешно добавлен через API.");
            return true;
        }
        const errorData = await response.json();
        console.error("Ошибка добавления гостя через API:", errorData);
        return false;
    } catch (error) {
        console.error("Ошибка сети при добавлении гостя:", error);
        return false;
    }
}

// Функция для обновления гостя через Vercel API
export async function updateGuest(guestId: string, updates: Partial<Guest>): Promise<boolean> {
    try {
        const response = await fetch(`/api/guests?id=${guestId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updates),
        });

        if (response.ok) {
            console.log("Гость успешно обновлен через API.");
            return true;
        }
        const errorData = await response.json();
        console.error("Ошибка обновления гостя через API:", errorData);
        return false;
    } catch (error) {
        console.error("Ошибка сети при обновлении гостя:", error);
        return false;
    }
}

// Функция для поиска гостя по имени (будет использовать API)
export async function findGuestByName(name: string): Promise<Guest | null> {
    try {
        const guests = await getGuests(); // Получаем всех гостей через API
        const query = normalizeName(name);

        const foundGuest = guests.find(guest =>
            guest.names.some(guestName => isNameMatch(normalizeName(guestName), query))
        );

        return foundGuest || null;
    } catch (error) {
        console.error("Ошибка поиска гостя:", error);
        return null;
    }
}

// Функция для поиска гостей по номеру столика (будет использовать API)
export async function findGuestsByTable(tableNumber: string): Promise<Guest[]> {
    try {
        const guests = await getGuests(); // Получаем всех гостей через API
        return guests.filter(guest => guest.tableNumber === tableNumber);
    } catch (error) {
        console.error("Ошибка поиска гостей по столику:", error);
        return [];
    }
}

// Функция для получения статистики (будет использовать API)
export async function getGuestStats(): Promise<{ total: number; attending: number; notAttending: number; noResponse: number }> {
    try {
        const guests = await getGuests(); // Получаем всех гостей через API
        const total = guests.length;
        const attending = guests.filter(g => g.attending === true).length;
        const notAttending = guests.filter(g => g.attending === false).length;
        const noResponse = guests.filter(g => g.attending === undefined).length;

        return { total, attending, notAttending, noResponse };
    } catch (error) {
        console.error("Ошибка получения статистики:", error);
        return { total: 0, attending: 0, notAttending: 0, noResponse: 0 };
    }
}

// Функция для удаления гостя через Vercel API
export async function deleteGuest(guestId: string): Promise<boolean> {
    try {
        const response = await fetch(`/api/guests?id=${guestId}`, {
            method: "DELETE",
        });

        if (response.ok) {
            console.log("Гость успешно удален через API.");
            return true;
        }
        const errorData = await response.json();
        console.error("Ошибка удаления гостя через API:", errorData);
        return false;
    } catch (error) {
        console.error("Ошибка сети при удалении гостя:", error);
        return false;
    }
}

// Вспомогательные функции
function normalizeName(raw: string): string {
    return raw
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();
}

function isNameMatch(candidate: string, query: string): boolean {
    if (!candidate || !query) return false;
    if (candidate === query) return true;
    if (candidate.includes(query)) return true;

    const candidateTokens = candidate.split(" ");
    const queryTokens = query.split(" ");

    return queryTokens.every(qt => candidateTokens.some(ct => ct.startsWith(qt)));
}

// Функции экспорта остаются без изменений (будут работать с данными из Vercel API)
export async function exportGuestsToCSV(): Promise<string> {
    const guests = await getGuests();
    if (guests.length === 0) return "";

    const headers = ["ID", "Имена", "Номер столика", "Статус", "Дата ответа"];
    const csvContent = [
        headers.join(","),
        ...guests.map(guest => [
            `"${guest.id}"`,
            `"${guest.names.join("; ")}"`,
            `"${guest.tableNumber}"`,
            `"${guest.attending === undefined ? "Не ответил" : guest.attending ? "Придет" : "Не придет"}"`,
            `"${guest.timestamp || ""}"`
        ].join(","))
    ].join("\n");

    return csvContent;
}

export async function downloadGuestsCSV(): Promise<void> {
    const csvContent = await exportGuestsToCSV();
    if (!csvContent) {
        alert("Нет данных для экспорта");
        return;
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `wedding-guests-${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

