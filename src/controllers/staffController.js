import db from "../db.js";
import config from "../config.js";

export const getAllStaffs = async (req, res) => {
  try {
    const result = await db.raw(
      `SELECT id, password, last_name, first_name, gender,
       CAST(AES_DECRYPT(identification_number, ?) AS CHAR) as identification_number,
       CAST(AES_DECRYPT(address, ?) AS CHAR) as address,
       CAST(AES_DECRYPT(email, ?) AS CHAR) as email,
       CAST(AES_DECRYPT(phone, ?) AS CHAR) as phone,
       department, role
       FROM staffs`,
      [config.AES_KEY, config.AES_KEY, config.AES_KEY, config.AES_KEY]
    );
    res.status(200).json({ success: true, data: result[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStaffById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.raw(
      `SELECT id, password, last_name, first_name, gender,
       CAST(AES_DECRYPT(identification_number, ?) AS CHAR) as identification_number,
       CAST(AES_DECRYPT(address, ?) AS CHAR) as address,
       CAST(AES_DECRYPT(email, ?) AS CHAR) as email,
       CAST(AES_DECRYPT(phone, ?) AS CHAR) as phone,
       department, role
       FROM staffs WHERE id = ?`,
      [config.AES_KEY, config.AES_KEY, config.AES_KEY, config.AES_KEY, id]
    );
    const staff = result[0][0];
    if (!staff) {
      return res.status(404).json({ success: false, message: "员工不存在" });
    }
    res.status(200).json({ success: true, data: staff });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addStaff = async (req, res) => {
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
      department,
      role,
    } = req.body;
    if (!last_name || !first_name || !password) {
      return res.status(400).json({ success: false, message: "缺少必填字段" });
    }
    const result = await db.raw(
      `INSERT INTO staffs 
       (password, last_name, first_name, gender, identification_number, address, email, phone, department, role)
       VALUES (?, ?, ?, ?, ${identification_number ? 'AES_ENCRYPT(?, ?)' : 'NULL'}, 
               ${address ? 'AES_ENCRYPT(?, ?)' : 'NULL'}, 
               ${email ? 'AES_ENCRYPT(?, ?)' : 'NULL'}, 
               ${phone ? 'AES_ENCRYPT(?, ?)' : 'NULL'}, ?, ?)`,
      [
        password, last_name, first_name, gender,
        ...(identification_number ? [identification_number, config.AES_KEY] : []),
        ...(address ? [address, config.AES_KEY] : []),
        ...(email ? [email, config.AES_KEY] : []),
        ...(phone ? [phone, config.AES_KEY] : []),
        department, role
      ]
    );
    res.status(201).json({ success: true, data: { id: result[0].insertId } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const editStaff = async (req, res) => {
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
      department,
      role,
    } = req.body;

    const updates = [];
    const values = [];
    
    if (password !== undefined) {
      updates.push("password = ?");
      values.push(password);
    }
    if (last_name !== undefined) {
      updates.push("last_name = ?");
      values.push(last_name);
    }
    if (first_name !== undefined) {
      updates.push("first_name = ?");
      values.push(first_name);
    }
    if (gender !== undefined) {
      updates.push("gender = ?");
      values.push(gender);
    }
    if (identification_number !== undefined) {
      updates.push("identification_number = AES_ENCRYPT(?, ?)");
      values.push(identification_number, config.AES_KEY);
    }
    if (address !== undefined) {
      updates.push("address = AES_ENCRYPT(?, ?)");
      values.push(address, config.AES_KEY);
    }
    if (email !== undefined) {
      updates.push("email = AES_ENCRYPT(?, ?)");
      values.push(email, config.AES_KEY);
    }
    if (phone !== undefined) {
      updates.push("phone = AES_ENCRYPT(?, ?)");
      values.push(phone, config.AES_KEY);
    }
    if (department !== undefined) {
      updates.push("department = ?");
      values.push(department);
    }
    if (role !== undefined) {
      updates.push("role = ?");
      values.push(role);
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: "没有要更新的字段" });
    }

    values.push(id);
    const result = await db.raw(
      `UPDATE staffs SET ${updates.join(", ")} WHERE id = ?`,
      values
    );

    if (result[0].affectedRows === 0) {
      return res.status(404).json({ success: false, message: "员工不存在" });
    }
    res.status(200).json({ success: true, message: "更新成功" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await db("staffs").where({ id }).delete();
    if (!deleted) {
      return res.status(404).json({ success: false, message: "员工不存在" });
    }
    res.status(200).json({ success: true, message: "删除成功" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
