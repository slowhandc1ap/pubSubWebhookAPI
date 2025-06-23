import { pool } from "../../db/mysql";
import jwt from 'jsonwebtoken'

export const notifySubscribers = async (message: string): Promise<void> => {
  const [subscribers] = await pool.query('SELECT * FROM subscriber');

  (subscribers as any[]).forEach(async (subscriber) => {
    const token = jwt.sign({ message, sub_id: subscriber.sub_id }, subscriber.secret);

    // ตรวจสอบ URL
    let url = subscriber.url;
    if (!url.startsWith('http://') && !url.startsWith('https://'))  {
      url = `http://${url}`;
    }

    try {
      const result = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      console.log(`Webhook sent to ${url} - Status:`, result.status);
    } catch (error) {
      console.error("Error notifying subscriber:", error);
    }
  });
};