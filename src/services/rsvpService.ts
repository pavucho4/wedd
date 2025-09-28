export interface RSVPData {
    id?: string;
    guestName: string;
    tableNumber: string;
    attending: boolean;
    timestamp: string;
    userAgent: string;
    url: string;
}

import { getSupabase } from '@/lib/supabaseClient';

export async function sendRSVPData(data: RSVPData): Promise<boolean> {
    try {
        const supabase = getSupabase();
        const { error } = await supabase!.from('rsvps').insert(data);
        return !error;
    } catch (error) {
        return false;
    }
}

export async function deleteRSVP(rsvpId: string): Promise<boolean> {
    try {
        const supabase = getSupabase();
        const { error } = await supabase!.from('rsvps').delete().eq('id', rsvpId);
        return !error;
    } catch (error) {
        return false;
    }
}

export async function getSavedRSVPs(): Promise<RSVPData[]> {
    try {
        const supabase = getSupabase();
        const { data, error } = await supabase!.from('rsvps').select('*').order('timestamp', { ascending: false });
        if (error) return [];
        return (data ?? []) as RSVPData[];
    } catch (error) {
        return [];
    }
}


