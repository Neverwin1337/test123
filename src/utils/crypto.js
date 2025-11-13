import db from "../db.js";
import config from "../config.js";

// 用MySQL嘅AES_ENCRYPT嚟加密
export const encryptSQL = (text) => {
  if (!text) return null;
  return db.raw(`AES_ENCRYPT(?, ?)`, [text, config.AES_KEY]);
};

// 用MySQL嘅AES_DECRYPT嚟解密
export const decryptValue = async (encryptedBuffer) => {
  if (!encryptedBuffer) return null;
  const result = await db.raw(
    `SELECT CAST(AES_DECRYPT(?, ?) AS CHAR) as decrypted`,
    [encryptedBuffer, config.AES_KEY]
  );
  return result[0][0]?.decrypted || null;
};
