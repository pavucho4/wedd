import { list, put } from '@vercel/blob';

export interface Guest {
  id: string;
  names: string[];
  tableNumber: string;
  attending?: boolean;
  timestamp?: string;
}

export interface RSVPEntry {
  guestName: string;
  tableNumber: string;
  attending: boolean;
  timestamp: string;
  userAgent: string;
  url: string;
}

export interface StorageAdapter {
  getGuests(): Promise<Guest[]>;
  addGuest(guest: Guest): Promise<void>;
  updateGuest(guestId: string, updates: Partial<Guest>): Promise<Guest | null>;
  deleteGuest(guestId: string): Promise<void>;

  getRSVPs(): Promise<RSVPEntry[]>;
  addRSVP(entry: RSVPEntry): Promise<void>;
}

class InMemoryStorage implements StorageAdapter {
  private guests: Map<string, Guest> = new Map();
  private rsvps: RSVPEntry[] = [];

  async getGuests(): Promise<Guest[]> {
    return Array.from(this.guests.values());
  }

  async addGuest(guest: Guest): Promise<void> {
    this.guests.set(guest.id, guest);
  }

  async updateGuest(guestId: string, updates: Partial<Guest>): Promise<Guest | null> {
    const existing = this.guests.get(guestId);
    if (!existing) return null;
    const updated: Guest = { ...existing, ...updates };
    this.guests.set(guestId, updated);
    return updated;
  }

  async deleteGuest(guestId: string): Promise<void> {
    this.guests.delete(guestId);
  }

  async getRSVPs(): Promise<RSVPEntry[]> {
    return this.rsvps.slice();
  }

  async addRSVP(entry: RSVPEntry): Promise<void> {
    this.rsvps.unshift(entry);
  }
}

class BlobStorage implements StorageAdapter {
  private guestsKey = 'guests.json';
  private rsvpsKey = 'rsvps.json';

  private async readJSON<T>(key: string, fallback: T): Promise<T> {
    try {
      const listing = await list();
      const item = listing.blobs.find(b => b.pathname === key);
      if (!item?.url) return fallback;
      const resp = await fetch(item.url);
      if (!resp.ok) return fallback;
      const text = await resp.text();
      return JSON.parse(text) as T;
    } catch {
      return fallback;
    }
  }

  private async writeJSON<T>(key: string, data: T): Promise<void> {
    await put(key, JSON.stringify(data), { contentType: 'application/json', access: 'public' });
  }

  async getGuests(): Promise<Guest[]> {
    return this.readJSON<Guest[]>(this.guestsKey, []);
  }

  async addGuest(guest: Guest): Promise<void> {
    const guests = await this.getGuests();
    guests.push(guest);
    await this.writeJSON(this.guestsKey, guests);
  }

  async updateGuest(guestId: string, updates: Partial<Guest>): Promise<Guest | null> {
    const guests = await this.getGuests();
    const idx = guests.findIndex(g => g.id === guestId);
    if (idx === -1) return null;
    const updated = { ...guests[idx], ...updates } as Guest;
    guests[idx] = updated;
    await this.writeJSON(this.guestsKey, guests);
    return updated;
  }

  async deleteGuest(guestId: string): Promise<void> {
    const guests = await this.getGuests();
    const next = guests.filter(g => g.id !== guestId);
    await this.writeJSON(this.guestsKey, next);
  }

  async getRSVPs(): Promise<RSVPEntry[]> {
    return this.readJSON<RSVPEntry[]>(this.rsvpsKey, []);
  }

  async addRSVP(entry: RSVPEntry): Promise<void> {
    const items = await this.getRSVPs();
    items.unshift(entry);
    await this.writeJSON(this.rsvpsKey, items);
  }
}

export function getStorage(): StorageAdapter {
  const blobEnabled = process.env.VERCEL === '1' || !!process.env.BLOB_READ_WRITE_TOKEN;
  return blobEnabled ? new BlobStorage() : new InMemoryStorage();
}


