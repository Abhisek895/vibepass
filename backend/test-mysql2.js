const mysql = require('mysql2/promise');

async function test() {
  try {
    const conn = await mysql.createConnection("mysql://sql12825010:IA41Vd3p8j@sql12.freesqldatabase.com:3306/sql12825010");
    const [rows] = await conn.execute("SELECT 1 as result");
    console.log('SUCCESS:', rows);
    await conn.end();
  } catch (e) {
    console.error('FAILURE:', e.message);
  }
}

test();
