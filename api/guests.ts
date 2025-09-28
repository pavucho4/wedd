import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getStorage, type Guest } from "../src/server/storage.js";

export default async function (request: VercelRequest, response: VercelResponse) {
  if (request.method === "POST") {
    try {
      const guestData = request.body;
      const newGuest: Guest = {
        ...guestData,
        id:
          Date.now().toString() +
          Math.random().toString(36).substring(2, 11),
      };
      await getStorage().addGuest(newGuest);
      response
        .status(200)
        .json({ message: "Guest added successfully", guest: newGuest });
    } catch (error: any) {
      console.error("Error adding guest:", error);
      response
        .status(500)
        .json({ message: "Error adding guest", error: error.message });
    }
  } else if (request.method === "GET") {
    try {
      const guests = await getStorage().getGuests();
      response.status(200).json(guests);
    } catch (error: any) {
      console.error("Error fetching guests:", error);
      response
        .status(500)
        .json({ message: "Error fetching guests", error: error.message });
    }
  } else if (request.method === "PATCH") {
    try {
      const { id } = request.query;
      const updates = request.body;
      const updatedGuest = await getStorage().updateGuest(String(id), updates);
      if (!updatedGuest) {
        return response.status(404).json({ message: `Guest with ID ${id} not found.` });
      }
      response
        .status(200)
        .json({ message: "Guest updated successfully", guest: updatedGuest });
    } catch (error: any) {
      console.error("Error updating guest:", error);
      response
        .status(500)
        .json({ message: "Error updating guest", error: error.message });
    }
  } else if (request.method === "DELETE") {
    try {
      const { id } = request.query;
      await getStorage().deleteGuest(String(id));
      response.status(200).json({ message: "Guest deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting guest:", error);
      response
        .status(500)
        .json({ message: "Error deleting guest", error: error.message });
    }
  } else {
    response.status(405).json({ message: "Method Not Allowed" });
  }
}


