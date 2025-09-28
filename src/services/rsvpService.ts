export interface RSVPData {
    guestName: string;
    tableNumber: string;
    attending: boolean;
    timestamp: string;
    userAgent: string;
    url: string;
}

// Функция для отправки данных RSVP через Vercel API
export async function sendRSVPData(data: RSVPData): Promise<boolean> {
    try {
        const response = await fetch("/api/rsvp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            console.log("RSVP данные успешно отправлены через API.");
            return true;
        } else {
            const errorData = await response.json();
            console.error("Ошибка отправки RSVP через API:", errorData);
            return false;
        }
    } catch (error) {
        console.error("Ошибка сети при отправке RSVP:", error);
        return false;
    }
}

// Функция для получения всех сохраненных RSVP через Vercel API
export async function getSavedRSVPs(): Promise<RSVPData[]> {
    try {
        const response = await fetch("/api/rsvp");
        if (response.ok) {
            const rsvps = await response.json();
            return rsvps as RSVPData[];
        } else {
            const errorData = await response.json();
            console.error("Ошибка получения RSVP данных через API:", errorData);
            return [];
        }
    } catch (error) {
        console.error("Ошибка сети при получении RSVP данных:", error);
        return [];
    }
}

// Функции экспорта остаются без изменений (будут работать с данными из Vercel API)
export async function exportRSVPToCSV(): Promise<string> {
    const data = await getSavedRSVPs();
    if (data.length === 0) return "";

    const headers = ["Имя гостя", "Номер столика", "Придет ли", "Дата ответа", "User Agent", "URL"];
    const csvContent = [
        headers.join(","),
        ...data.map(item => [
            `"${item.guestName}"`,
            `"${item.tableNumber}"`,
            `"${item.attending ? "Да" : "Нет"}"`,
            `"${item.timestamp}"`,
            `"${item.userAgent}"`,
            `"${item.url}"`
        ].join(","))
    ].join("\n");

    return csvContent;
}

export async function downloadRSVPCSV(): Promise<void> {
    const csvContent = await exportRSVPToCSV();
    if (!csvContent) {
        alert("Нет данных для экспорта");
        return;
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `wedding-rsvp-${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

