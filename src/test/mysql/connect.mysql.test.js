const { randomInt } = require("crypto");
const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "127.0.0.1",
  port: 8811,
  user: "root",
  password: "root",
  database: "shop",
});

const batchSize = 1000;
const total = 1000000;
let current = 0;
let batch = 0;

const insertBatch = () => {
  if (current >= total) {
    pool.end((err) => {
      if (err) {
        console.error("Error closing connection:", err);
      } else {
        console.log("Insert success and pool closed");
      }
    });
    return;
  }

  let values = [];
  for (let i = 0; i < batchSize && current < total; i++) {
    values.push([`name${current}`, randomInt(18, 80), `address${current}`]);
    current++;
  }

  const sql = `INSERT INTO user (name, age, address) VALUES ?`;
  pool.query(sql, [values], (err, result) => {
    if (err) {
      console.error("Insert error:", err);
    } else {
      batch++;
      insertBatch(); // Continue with the next batch
    }
  });
};

insertBatch();
