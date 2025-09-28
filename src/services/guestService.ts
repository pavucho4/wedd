import { getSupabase } from '@/lib/supabaseClient';
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
        const supabase = getSupabase();
        const { data, error } = await supabase!.from('guests').select('*').order('timestamp', { ascending: false });
        if (error) return [];
        return (data ?? []) as Guest[];
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
        const supabase = getSupabase();
        const { error } = await supabase!.from('guests').insert(newGuest);
        return !error;
    } catch {
        return false;
    }
}

export async function updateGuest(guestId: string, updates: Partial<Guest>): Promise<boolean> {
    try {
        const supabase = getSupabase();
        const { error } = await supabase!.from('guests').update(updates).eq('id', guestId);
        return !error;
    } catch {
        return false;
    }
}

export async function deleteGuest(guestId: string): Promise<boolean> {
    try {
        const supabase = getSupabase();
        const { error } = await supabase!.from('guests').delete().eq('id', guestId);
        return !error;
    } catch {
        return false;
    }
}


