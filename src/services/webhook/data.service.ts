import { pool } from "../../db/mysql";

export const getMessageByTxId = async (tx_id: number): Promise<string | null> => {
    console.log("Fetching message from SQL for tx_id:", tx_id);

    const [rows] = await pool.query('SELECT message FROM subscribe_data WHERE tx_id = ?', [tx_id]);
    const result = (rows as any[])[0];
    return result ? result.message : null;
};