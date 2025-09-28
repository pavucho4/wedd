import type { VercelRequest, VercelResponse } from '@vercel/node';
import { addRowToSheet, getRowsFromSheet, updateRowInSheet, deleteRowFromSheet } from '../src/services/googleSheetService';

// Вспомогательные функции для преобразования данных между форматом приложения и Google Sheets
function mapGuestToSheetRow(guest: any) {
  return {
    id: guest.id,
    names: guest.names ? guest.names.join(';') : '',
    tableNumber: guest.tableNumber,
    attending: guest.attending !== undefined ? String(guest.attending) : '',
    timestamp: guest.timestamp || '',
  };
}

function mapSheetRowToGuest(row: any) {
  return {
    id: row.id,
    names: row.names ? row.names.split(';') : [],
    tableNumber: row.tableNumber,
    attending: row.attending === 'true' ? true : row.attending === 'false' ? false : undefined,
    timestamp: row.timestamp,
  };
}

export default async function (request: VercelRequest, response: VercelResponse) {
  if (request.method === 'POST') {
    // Добавление нового гостя
    try {
      const guestData = request.body;
      const newGuest = { ...guestData, id: Date.now().toString() + Math.random().toString(36).substring(2, 11) };
      await addRowToSheet('Guests', mapGuestToSheetRow(newGuest));
      response.status(200).json({ message: 'Guest added successfully', guest: newGuest });
    } catch (error) {
      console.error('Error adding guest:', error);
      response.status(500).json({ message: 'Error adding guest', error: error.message });
    }
  } else if (request.method === 'GET') {
    // Получение всех гостей или конкретного гостя по ID
    try {
      const guests = await getRowsFromSheet('Guests');
      response.status(200).json(guests.map(mapSheetRowToGuest));
    } catch (error) {
      console.error('Error fetching guests:', error);
      response.status(500).json({ message: 'Error fetching guests', error: error.message });
    }
  } else if (request.method === 'PATCH') {
    // Обновление гостя
    try {
      const { id } = request.query;
      const updates = request.body;

      const guests = await getRowsFromSheet('Guests');
      const guestIndex = guests.findIndex((g: any) => g.id === id);

      if (guestIndex === -1) {
        return response.status(404).json({ message: `Guest with ID ${id} not found.` });
      }

      const existingGuest = mapSheetRowToGuest(guests[guestIndex]);
      const updatedGuest = { ...existingGuest, ...updates };

      await updateRowInSheet('Guests', guestIndex, mapGuestToSheetRow(updatedGuest));
      response.status(200).json({ message: 'Guest updated successfully', guest: updatedGuest });
    } catch (error) {
      console.error('Error updating guest:', error);
      response.status(500).json({ message: 'Error updating guest', error: error.message });
    }
  } else if (request.method === 'DELETE') {
    // Удаление гостя
    try {
      const { id } = request.query;

      const guests = await getRowsFromSheet('Guests');
      const guestIndex = guests.findIndex((g: any) => g.id === id);

      if (guestIndex === -1) {
        return response.status(404).json({ message: `Guest with ID ${id} not found.` });
      }

      await deleteRowFromSheet('Guests', guestIndex);
      response.status(200).json({ message: 'Guest deleted successfully' });
    } catch (error) {
      console.error('Error deleting guest:', error);
      response.status(500).json({ message: 'Error deleting guest', error: error.message });
    }
  } else {
    response.status(405).json({ message: 'Method Not Allowed' });
  }
}

