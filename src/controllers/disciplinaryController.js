import db from "../db.js";
import config from "../config.js";
import { logDataModification } from "../utils/logger.js";

export const getAllDisciplinaryRecords = async (req, res) => {
  try {
    const result = await db.raw(
      `SELECT id, student_id, date, staff_id,
       CAST(AES_DECRYPT(descriptions, ?) AS CHAR) as descriptions
       FROM disciplinary_records`,
      [config.AES_KEY]
    );
    res.status(200).json({ success: true, data: result[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDisciplinaryRecordById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.raw(
      `SELECT id, student_id, date, staff_id,
       CAST(AES_DECRYPT(descriptions, ?) AS CHAR) as descriptions
       FROM disciplinary_records WHERE id = ?`,
      [config.AES_KEY, id]
    );
    const record = result[0][0];
    if (!record) {
      return res.status(404).json({ success: false, message: "记录不存在" });
    }
    res.status(200).json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addDisciplinaryRecord = async (req, res) => {
  try {
    const { student_id, date, staff_id, descriptions } = req.body;
    if (!student_id || !date || !staff_id) {
      return res.status(400).json({ success: false, message: "缺少必填字段" });
    }
    const result = await db.raw(
      `INSERT INTO disciplinary_records (student_id, date, staff_id, descriptions)
       VALUES (?, ?, ?, ${descriptions ? 'AES_ENCRYPT(?, ?)' : 'NULL'})`,
      descriptions
        ? [student_id, date, staff_id, descriptions, config.AES_KEY]
        : [student_id, date, staff_id]
    );
    const newId = result[0].insertId;
    logDataModification("CREATE", "disciplinary_record", req, {
      id: newId,
      student_id,
      staff_id,
      date,
    });
    res.status(201).json({ success: true, data: { id: newId } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const editDisciplinaryRecord = async (req, res) => {
  try {
    const { id, student_id, date, staff_id, descriptions } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: "缺少ID字段" });
    }
    const updates = [];
    const values = [];
    const changedFields = [];
    
    if (student_id !== undefined) {
      updates.push("student_id = ?");
      values.push(student_id);
      changedFields.push("student_id");
    }
    if (date !== undefined) {
      updates.push("date = ?");
      values.push(date);
      changedFields.push("date");
    }
    if (staff_id !== undefined) {
      updates.push("staff_id = ?");
      values.push(staff_id);
      changedFields.push("staff_id");
    }
    if (descriptions !== undefined) {
      updates.push("descriptions = AES_ENCRYPT(?, ?)");
      values.push(descriptions, config.AES_KEY);
      changedFields.push("descriptions");
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: "没有要更新的字段" });
    }

    values.push(id);
    const result = await db.raw(
      `UPDATE disciplinary_records SET ${updates.join(", ")} WHERE id = ?`,
      values
    );

    if (result[0].affectedRows === 0) {
      return res.status(404).json({ success: false, message: "记录不存在" });
    }
    logDataModification("UPDATE", "disciplinary_record", req, { id, changedFields });
    res.status(200).json({ success: true, message: "更新成功" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteDisciplinaryRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await db("disciplinary_records").where({ id }).delete();
    if (!deleted) {
      return res.status(404).json({ success: false, message: "记录不存在" });
    }
    logDataModification("DELETE", "disciplinary_record", req, { id });
    res.status(200).json({ success: true, message: "删除成功" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
