export interface RSVPData {
    guestName: string;
    tableNumber: string;
    attending: boolean;
    timestamp: string;
    userAgent: string;
    url: string;
}

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
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
}

export async function getSavedRSVPs(): Promise<RSVPData[]> {
    try {
        const response = await fetch("/api/rsvp");
        if (response.ok) {
            const rsvps = await response.json();
            return rsvps as RSVPData[];
        } else {
            return [];
        }
    } catch (error) {
        return [];
    }
}


