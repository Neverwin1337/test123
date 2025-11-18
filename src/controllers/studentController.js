import db from "../db.js";
import config from "../config.js";
import { encryptSQL } from "../utils/crypto.js";
import { logDataModification } from "../utils/logger.js";

export const getAllStudents = async (req, res) => {
  try {
    const students = await db.raw(
      `SELECT id, last_name, first_name, gender,
       CAST(AES_DECRYPT(identification_number, ?) AS CHAR) as identification_number,
       CAST(AES_DECRYPT(address, ?) AS CHAR) as address,
       CAST(AES_DECRYPT(email, ?) AS CHAR) as email,
       CAST(AES_DECRYPT(phone, ?) AS CHAR) as phone,
       enrollment_year, guardian_id, guardian_relation
       FROM students`,
      [config.AES_KEY, config.AES_KEY, config.AES_KEY, config.AES_KEY]
    );
    res.status(200).json({ success: true, data: students[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.raw(
      `SELECT id, last_name, first_name, gender,
       CAST(AES_DECRYPT(identification_number, ?) AS CHAR) as identification_number,
       CAST(AES_DECRYPT(address, ?) AS CHAR) as address,
       CAST(AES_DECRYPT(email, ?) AS CHAR) as email,
       CAST(AES_DECRYPT(phone, ?) AS CHAR) as phone,
       enrollment_year, guardian_id, guardian_relation
       FROM students WHERE id = ?`,
      [config.AES_KEY, config.AES_KEY, config.AES_KEY, config.AES_KEY, id]
    );
    const student = result[0][0];
    if (!student) {
      return res.status(404).json({ success: false, message: "学生不存在" });
    }
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addStudent = async (req, res) => {
  try {
    const {
      password,
      last_name,
      first_name,
      gender,
      identification_number,
      address,
      email,
      phone,
      enrollment_year,
      guardian_id,
      guardian_relation,
    } = req.body;
    if (!last_name || !first_name || !password || !email) {
      return res.status(400).json({ success: false, message: "缺少必填字段（姓名、密碼、郵箱）" });
    }
    
    const result = await db.raw(
      `INSERT INTO students 
       (password, last_name, first_name, gender, identification_number, address, email, phone, enrollment_year, guardian_id, guardian_relation)
       VALUES (AES_ENCRYPT(?, ?), ?, ?, ?, ${identification_number ? 'AES_ENCRYPT(?, ?)' : 'NULL'}, 
               ${address ? 'AES_ENCRYPT(?, ?)' : 'NULL'}, 
               AES_ENCRYPT(?, ?), 
               ${phone ? 'AES_ENCRYPT(?, ?)' : 'NULL'}, ?, ?, ?)`,
      [
        password, config.AES_KEY, last_name, first_name, gender,
        ...(identification_number ? [identification_number, config.AES_KEY] : []),
        ...(address ? [address, config.AES_KEY] : []),
        email, config.AES_KEY,
        ...(phone ? [phone, config.AES_KEY] : []),
        enrollment_year, guardian_id, guardian_relation
      ]
    );
    
    const newId = result[0].insertId;
    logDataModification("CREATE", "student", req, {
      id: newId,
      last_name,
      first_name,
      guardian_id,
      enrollment_year,
    });
    res.status(201).json({ success: true, data: { id: newId } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const editStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      password,
      last_name,
      first_name,
      gender,
      identification_number,
      address,
      email,
      phone,
      enrollment_year,
      guardian_id,
      guardian_relation,
    } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: "缺少ID字段" });
    }

    const updates = [];
    const values = [];
    const changedFields = [];

    if (password !== undefined) {
      updates.push("password = AES_ENCRYPT(?, ?)");
      values.push(password, config.AES_KEY);
      changedFields.push("password");
    }
    if (last_name !== undefined) {
      updates.push("last_name = ?");
      values.push(last_name);
      changedFields.push("last_name");
    }
    if (first_name !== undefined) {
      updates.push("first_name = ?");
      values.push(first_name);
      changedFields.push("first_name");
    }
    if (gender !== undefined) {
      updates.push("gender = ?");
      values.push(gender);
      changedFields.push("gender");
    }
    if (identification_number !== undefined) {
      updates.push("identification_number = AES_ENCRYPT(?, ?)");
      values.push(identification_number, config.AES_KEY);
      changedFields.push("identification_number");
    }
    if (address !== undefined) {
      updates.push("address = AES_ENCRYPT(?, ?)");
      values.push(address, config.AES_KEY);
      changedFields.push("address");
    }
    if (email !== undefined) {
      updates.push("email = AES_ENCRYPT(?, ?)");
      values.push(email, config.AES_KEY);
      changedFields.push("email");
    }
    if (phone !== undefined) {
      updates.push("phone = AES_ENCRYPT(?, ?)");
      values.push(phone, config.AES_KEY);
      changedFields.push("phone");
    }
    if (enrollment_year !== undefined) {
      updates.push("enrollment_year = ?");
      values.push(enrollment_year);
      changedFields.push("enrollment_year");
    }
    if (guardian_id !== undefined) {
      updates.push("guardian_id = ?");
      values.push(guardian_id);
      changedFields.push("guardian_id");
    }
    if (guardian_relation !== undefined) {
      updates.push("guardian_relation = ?");
      values.push(guardian_relation);
      changedFields.push("guardian_relation");
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: "没有要更新的字段" });
    }

    values.push(id);
    const result = await db.raw(
      `UPDATE students SET ${updates.join(", ")} WHERE id = ?`,
      values
    );

    if (result[0].affectedRows === 0) {
      return res.status(404).json({ success: false, message: "学生不存在" });
    }
    logDataModification("UPDATE", "student", req, { id, changedFields });
    res.status(200).json({ success: true, message: "更新成功" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStudentGrades = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.raw(
      `SELECT id, student_id, course_id, term,
       CAST(AES_DECRYPT(grade, ?) AS CHAR) as grade,
       CAST(AES_DECRYPT(comments, ?) AS CHAR) as comments
       FROM grades WHERE student_id = ?`,
      [config.AES_KEY, config.AES_KEY, id]
    );
    res.status(200).json({ success: true, data: result[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStudentDisciplinaryRecords = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.raw(
      `SELECT id, student_id, date, staff_id,
       CAST(AES_DECRYPT(descriptions, ?) AS CHAR) as descriptions
       FROM disciplinary_records WHERE student_id = ?`,
      [config.AES_KEY, id]
    );
    res.status(200).json({ success: true, data: result[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
