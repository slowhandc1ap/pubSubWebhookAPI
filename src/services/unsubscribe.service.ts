import { pool } from "../db/mysql";

type Unsubcribe = number 

export const deleteSubscriber = async(sub_id: Unsubcribe): Promise<void> => {
   
    if (!sub_id) {
        throw new Error('Subscriber ID is required');
    }
    const [result] = await pool.query(
        'DELETE FROM subscriber WHERE sub_id = ?',
        [sub_id]
    );

    if ((result as any).affectedRows === 0) {
        throw new Error('Subscriber not found');
    }

  
}