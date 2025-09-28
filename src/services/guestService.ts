export interface Guest {
    id: string;
    names: string[];
    tableNumber: string;
    attending?: boolean;
    timestamp?: string;
}

function mapSheetRowToGuest(row: any): Guest {
  return {
    id: row.id,
    names: row.names ? String(row.names).split(";") : [],
    tableNumber: String(row.tableNumber ?? ""),
    attending: row.attending === "true" ? true : row.attending === "false" ? false : undefined,
    timestamp: row.timestamp,
  };
}

export async function getGuests(): Promise<Guest[]> {
    try {
        const response = await fetch("/api/guests");
        if (response.ok) {
            const guests = await response.json();
            return guests.map(mapSheetRowToGuest) as Guest[];
        }
        return [];
    } catch {
        return [];
    }
}

export async function addGuest(guest: Omit<Guest, "id">): Promise<boolean> {
    const newGuest: Guest = {
        ...guest,
        id: Date.now().toString() + Math.random().toString(36).substring(2, 11)
    };
    try {
        const response = await fetch("/api/guests", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newGuest),
        });
        return response.ok;
    } catch {
        return false;
    }
}

export async function updateGuest(guestId: string, updates: Partial<Guest>): Promise<boolean> {
    try {
        const response = await fetch(`/api/guests?id=${guestId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates),
        });
        return response.ok;
    } catch {
        return false;
    }
}

export async function deleteGuest(guestId: string): Promise<boolean> {
    try {
        const response = await fetch(`/api/guests?id=${guestId}`, { method: "DELETE" });
        return response.ok;
    } catch {
        return false;
    }
}


