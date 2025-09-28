export interface Guest {
    id: string;
    names: string[];
    tableNumber: string;
    attending?: boolean;
    timestamp?: string;
}

export interface RSVPData {
    guestName: string;
    tableNumber: string;
    attending: boolean;
    timestamp: string;
    userAgent: string;
    url: string;
}

