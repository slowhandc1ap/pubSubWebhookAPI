import { pool } from '../db/mysql';

interface Subscriber {
  sub_id: number;
  secret: string;
}

export const createSubscriber = async (url: string): Promise<Subscriber> => {
  const secret = generateSecret();
  const [result] = await pool.query(
    'INSERT INTO subscriber (url, secret) VALUES (?, ?)',
    [url, secret]
  );

  const insertId = (result as any).insertId;

  return {
    sub_id: insertId,
    secret,
  };
};

function generateSecret(): string {
  return Math.random().toString(36).substring(2, 15);
}