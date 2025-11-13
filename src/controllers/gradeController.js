import db from "../db.js";
import config from "../config.js";

export const getAllGrades = async (req, res) => {
  try {
    const result = await db.raw(
      `SELECT id, student_id, course_id, term,
       CAST(AES_DECRYPT(grade, ?) AS CHAR) as grade,
       CAST(AES_DECRYPT(comments, ?) AS CHAR) as comments
       FROM grades`,
      [config.AES_KEY, config.AES_KEY]
    );
    res.status(200).json({ success: true, data: result[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getGradeById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.raw(
      `SELECT id, student_id, course_id, term,
       CAST(AES_DECRYPT(grade, ?) AS CHAR) as grade,
       CAST(AES_DECRYPT(comments, ?) AS CHAR) as comments
       FROM grades WHERE id = ?`,
      [config.AES_KEY, config.AES_KEY, id]
    );
    const grade = result[0][0];
    if (!grade) {
      return res.status(404).json({ success: false, message: "成绩不存在" });
    }
    res.status(200).json({ success: true, data: grade });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addGrade = async (req, res) => {
  try {
    const { student_id, course_id, term, grade, comments } = req.body;
    if (!student_id || !course_id || !term || !grade) {
      return res.status(400).json({ success: false, message: "缺少必填字段" });
    }
    const result = await db.raw(
      `INSERT INTO grades (student_id, course_id, term, grade, comments)
       VALUES (?, ?, ?, AES_ENCRYPT(?, ?), ${comments ? 'AES_ENCRYPT(?, ?)' : 'NULL'})`,
      comments
        ? [student_id, course_id, term, grade, config.AES_KEY, comments, config.AES_KEY]
        : [student_id, course_id, term, grade, config.AES_KEY]
    );
    res.status(201).json({ success: true, data: { id: result[0].insertId } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const editGrade = async (req, res) => {
  try {
    const { id, student_id, course_id, term, grade, comments } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: "缺少ID字段" });
    }
    const updates = [];
    const values = [];
    
    if (student_id !== undefined) {
      updates.push("student_id = ?");
      values.push(student_id);
    }
    if (course_id !== undefined) {
      updates.push("course_id = ?");
      values.push(course_id);
    }
    if (term !== undefined) {
      updates.push("term = ?");
      values.push(term);
    }
    if (grade !== undefined) {
      updates.push("grade = AES_ENCRYPT(?, ?)");
      values.push(grade, config.AES_KEY);
    }
    if (comments !== undefined) {
      updates.push("comments = AES_ENCRYPT(?, ?)");
      values.push(comments, config.AES_KEY);
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: "没有要更新的字段" });
    }

    values.push(id);
    const result = await db.raw(
      `UPDATE grades SET ${updates.join(", ")} WHERE id = ?`,
      values
    );

    if (result[0].affectedRows === 0) {
      return res.status(404).json({ success: false, message: "成绩不存在" });
    }
    res.status(200).json({ success: true, message: "更新成功" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteGrade = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await db("grades").where({ id }).delete();
    if (!deleted) {
      return res.status(404).json({ success: false, message: "成绩不存在" });
    }
    res.status(200).json({ success: true, message: "删除成功" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
