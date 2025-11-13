import db from "../db.js";
import config from "../config.js";

export const getAllGuardians = async (req, res) => {
  try {
    const result = await db.raw(
      `SELECT id, last_name, first_name,
       CAST(AES_DECRYPT(email, ?) AS CHAR) as email,
       CAST(AES_DECRYPT(phone, ?) AS CHAR) as phone
       FROM guardians`,
      [config.AES_KEY, config.AES_KEY]
    );
    res.status(200).json({ success: true, data: result[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getGuardianById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.raw(
      `SELECT id, last_name, first_name,
       CAST(AES_DECRYPT(email, ?) AS CHAR) as email,
       CAST(AES_DECRYPT(phone, ?) AS CHAR) as phone
       FROM guardians WHERE id = ?`,
      [config.AES_KEY, config.AES_KEY, id]
    );
    const guardian = result[0][0];
    if (!guardian) {
      return res.status(404).json({ success: false, message: "监护人不存在" });
    }
    res.status(200).json({ success: true, data: guardian });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addGuardian = async (req, res) => {
  try {
    const { last_name, first_name, email, phone } = req.body;
    if (!last_name || !first_name) {
      return res.status(400).json({ success: false, message: "缺少必填字段" });
    }
    const result = await db.raw(
      `INSERT INTO guardians (last_name, first_name, email, phone)
       VALUES (?, ?, ${email ? 'AES_ENCRYPT(?, ?)' : 'NULL'}, ${phone ? 'AES_ENCRYPT(?, ?)' : 'NULL'})`,
      [
        last_name, first_name,
        ...(email ? [email, config.AES_KEY] : []),
        ...(phone ? [phone, config.AES_KEY] : [])
      ]
    );
    res.status(201).json({ success: true, data: { id: result[0].insertId } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const editGuardian = async (req, res) => {
  try {
    const { id } = req.params;
    const { last_name, first_name, email, phone } = req.body;

    const updates = [];
    const values = [];
    
    if (last_name !== undefined) {
      updates.push("last_name = ?");
      values.push(last_name);
    }
    if (first_name !== undefined) {
      updates.push("first_name = ?");
      values.push(first_name);
    }
    if (email !== undefined) {
      updates.push("email = AES_ENCRYPT(?, ?)");
      values.push(email, config.AES_KEY);
    }
    if (phone !== undefined) {
      updates.push("phone = AES_ENCRYPT(?, ?)");
      values.push(phone, config.AES_KEY);
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: "没有要更新的字段" });
    }

    values.push(id);
    const result = await db.raw(
      `UPDATE guardians SET ${updates.join(", ")} WHERE id = ?`,
      values
    );

    if (result[0].affectedRows === 0) {
      return res.status(404).json({ success: false, message: "监护人不存在" });
    }
    res.status(200).json({ success: true, message: "更新成功" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteGuardian = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await db("guardians").where({ id }).delete();
    if (!deleted) {
      return res.status(404).json({ success: false, message: "监护人不存在" });
    }
    res.status(200).json({ success: true, message: "删除成功" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
