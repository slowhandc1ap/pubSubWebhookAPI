import { pool } from './mysql'; // ← หรือใส่ path ที่กรเก็บ connection pool

async function initDB() {
  const conn = await pool.getConnection();
  try {
    // เริ่ม transaction กันพลาด
    await conn.beginTransaction();

    // ตาราง subscriber
    await conn.query(`
      CREATE TABLE IF NOT EXISTS subscriber (
        sub_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        url VARCHAR(2048) NOT NULL,
        secret VARCHAR(255) NOT NULL,
        PRIMARY KEY (sub_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // ตาราง subscribe_data
    await conn.query(`
      CREATE TABLE IF NOT EXISTS subscribe_data (
        tx_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        message TEXT NOT NULL,
        PRIMARY KEY (tx_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await conn.commit();
    console.log('✅ Database initialized successfully!');
  } catch (err) {
    await conn.rollback();
    console.error('❌ Failed to initialize database:', err);
  } finally {
    conn.release();
    await pool.end(); // ปิด pool ถ้า init ครั้งเดียว
  }
}

initDB();
