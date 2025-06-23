import { pool } from "../db/mysql";

type ProvideData = string;

export const provideData = async (data: ProvideData): Promise<void> => {
    if (!data) {
        throw new Error('Data is required');
    }

    console.log('Inserting data into subscribe_data table:', data);
    const [result] = await pool.query(
        'INSERT INTO subscribe_data (message) VALUES (?)',
        data
    );

    const insertId = (result as any).insertId;
    if(!insertId) {
        throw new Error('Failed to insert data');
    }

    return;
}