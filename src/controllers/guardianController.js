import db from "../db.js";
import config from "../config.js";
import { logDataModification } from "../utils/logger.js";

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
    const { password, last_name, first_name, email, phone } = req.body;
    if (!last_name || !first_name) {
      return res.status(400).json({ success: false, message: "缺少必填字段" });
    }
    const result = await db.raw(
      `INSERT INTO guardians (password, last_name, first_name, email, phone)
       VALUES (${password ? 'AES_ENCRYPT(?, ?)' : 'NULL'}, ?, ?, ${email ? 'AES_ENCRYPT(?, ?)' : 'NULL'}, ${phone ? 'AES_ENCRYPT(?, ?)' : 'NULL'})`,
      [
        ...(password ? [password, config.AES_KEY] : []),
        last_name, first_name,
        ...(email ? [email, config.AES_KEY] : []),
        ...(phone ? [phone, config.AES_KEY] : [])
      ]
    );
    const newId = result[0].insertId;
    logDataModification("CREATE", "guardian", req, {
      id: newId,
      last_name,
      first_name,
    });
    res.status(201).json({ success: true, data: { id: newId } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const editGuardian = async (req, res) => {
  try {
    const { id } = req.params;
    const { password, last_name, first_name, email, phone } = req.body;

    const updates = [];
    const values = [];
    const changedFields = [];
    
    if (password !== undefined && password !== '') {
      updates.push("password = AES_ENCRYPT(?, ?)");
      values.push(password, config.AES_KEY);
      changedFields.push("password");
    }
    if (last_name !== undefined && last_name !== '') {
      updates.push("last_name = ?");
      values.push(last_name);
      changedFields.push("last_name");
    }
    if (first_name !== undefined && first_name !== '') {
      updates.push("first_name = ?");
      values.push(first_name);
      changedFields.push("first_name");
    }
    if (email !== undefined && email !== '') {
      updates.push("email = AES_ENCRYPT(?, ?)");
      values.push(email, config.AES_KEY);
      changedFields.push("email");
    }
    if (phone !== undefined && phone !== '') {
      updates.push("phone = AES_ENCRYPT(?, ?)");
      values.push(phone, config.AES_KEY);
      changedFields.push("phone");
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
    logDataModification("UPDATE", "guardian", req, { id, changedFields });
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
    logDataModification("DELETE", "guardian", req, { id });
    res.status(200).json({ success: true, message: "删除成功" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyChildren = async (req, res) => {
  try {
    const guardianId = req.user.id;

    const result = await db.raw(
      `SELECT id, last_name, first_name, gender,
       CAST(AES_DECRYPT(identification_number, ?) AS CHAR) as identification_number,
       CAST(AES_DECRYPT(address, ?) AS CHAR) as address,
       CAST(AES_DECRYPT(email, ?) AS CHAR) as email,
       CAST(AES_DECRYPT(phone, ?) AS CHAR) as phone,
       enrollment_year, guardian_id, guardian_relation
       FROM students
       WHERE guardian_id = ?`,
      [config.AES_KEY, config.AES_KEY, config.AES_KEY, config.AES_KEY, guardianId]
    );

    res.status(200).json({ success: true, data: result[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyChildById = async (req, res) => {
  try {
    const guardianId = req.user.id;
    const { studentId } = req.params;

    const result = await db.raw(
      `SELECT id, last_name, first_name, gender,
       CAST(AES_DECRYPT(identification_number, ?) AS CHAR) as identification_number,
       CAST(AES_DECRYPT(address, ?) AS CHAR) as address,
       CAST(AES_DECRYPT(email, ?) AS CHAR) as email,
       CAST(AES_DECRYPT(phone, ?) AS CHAR) as phone,
       enrollment_year, guardian_id, guardian_relation
       FROM students
       WHERE id = ? AND guardian_id = ?`,
      [config.AES_KEY, config.AES_KEY, config.AES_KEY, config.AES_KEY, studentId, guardianId]
    );

    const student = result[0][0];

    if (!student) {
      return res.status(404).json({ success: false, message: "学生不存在或不屬於該監護人" });
    }

    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyChildGrades = async (req, res) => {
  try {
    const guardianId = req.user.id;
    const { studentId } = req.params;

    const result = await db.raw(
      `SELECT g.id, g.student_id, g.course_id, g.term,
       CAST(AES_DECRYPT(g.grade, ?) AS CHAR) as grade,
       CAST(AES_DECRYPT(g.comments, ?) AS CHAR) as comments
       FROM grades g
       JOIN students s ON s.id = g.student_id
       WHERE g.student_id = ? AND s.guardian_id = ?`,
      [config.AES_KEY, config.AES_KEY, studentId, guardianId]
    );

    res.status(200).json({ success: true, data: result[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyChildDisciplinaryRecords = async (req, res) => {
  try {
    const guardianId = req.user.id;
    const { studentId } = req.params;

    const result = await db.raw(
      `SELECT d.id, d.student_id, d.date, d.staff_id,
       CAST(AES_DECRYPT(d.descriptions, ?) AS CHAR) as descriptions
       FROM disciplinary_records d
       JOIN students s ON s.id = d.student_id
       WHERE d.student_id = ? AND s.guardian_id = ?`,
      [config.AES_KEY, studentId, guardianId]
    );

    res.status(200).json({ success: true, data: result[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
