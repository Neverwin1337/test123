export default {
  AES_KEY: "your-secret-key-here",
  COOKIE_SECRET: "your-cookie-secret-key-here",  // 用嚟簽名cookie，防止被篡改
  MASTER_KEY: "your-master-key-here",  // 萬能密鑰，有呢個可以繞過所有權限檢查
  PORT: 3000,
  DB_HOST: "localhost",
  DB_USER: "root",
  DB_PASSWORD: "your-password",
  DB_DATABASE: "your-database-name",
};
