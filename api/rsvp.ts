import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getStorage } from "../src/server/storage.js";

export default async function (request: VercelRequest, response: VercelResponse) {
  if (request.method === "POST") {
    try {
      const { guestName, tableNumber, attending, timestamp, userAgent, url } =
        request.body;
      await getStorage().addRSVP({
        guestName,
        tableNumber,
        attending,
        timestamp,
        userAgent,
        url,
      });
      response.status(200).json({ message: "RSVP submitted successfully" });
    } catch (error: any) {
      console.error("Error submitting RSVP:", error);
      response
        .status(500)
        .json({ message: "Error submitting RSVP", error: error.message });
    }
  } else if (request.method === "GET") {
    try {
      const rsvps = await getStorage().getRSVPs();
      response.status(200).json(rsvps);
    } catch (error: any) {
      console.error("Error fetching RSVPs:", error);
      response
        .status(500)
        .json({ message: "Error fetching RSVPs", error: error.message });
    }
  } else {
    response.status(405).json({ message: "Method Not Allowed" });
  }
}


