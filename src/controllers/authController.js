import db from "../db.js";
import config from "../config.js";

// 員工登入
export const staffLogin = async (req, res) => {
  try {
    const { id, password } = req.body;
    
    if (!id || !password) {
      return res.status(400).json({ success: false, message: "缺少账号或密码" });
    }

    const staff = await db("staffs").where({ id }).first();
    
    if (!staff || staff.password !== password) {
      return res.status(401).json({ success: false, message: "账号或密码错误" });
    }

    // 用signed cookie防止被篡改
    res.cookie("userId", staff.id, {
      httpOnly: true,
      signed: true,  // 簽名cookie
      maxAge: 24 * 60 * 60 * 1000, // 24小時
      sameSite: 'strict',  // 防CSRF攻擊
      secure: process.env.NODE_ENV === 'production'  // 生產環境用HTTPS
    });
    res.cookie("userType", "staff", {
      httpOnly: true,
      signed: true,  // 簽名cookie
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });

    res.status(200).json({
      success: true,
      data: {
        id: staff.id,
        name: `${staff.first_name} ${staff.last_name}`,
        role: staff.role,
        type: "staff",
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 學生登入（用學號同身份證後6位做密碼）
export const studentLogin = async (req, res) => {
  try {
    const { id, password } = req.body;
    
    if (!id || !password) {
      return res.status(400).json({ success: false, message: "缺少账号或密码" });
    }

    // 查學生同埋佢嘅身份證號
    const student = await db.raw(
      `SELECT id, first_name, last_name, 
       CAST(AES_DECRYPT(identification_number, ?) AS CHAR) as id_number
       FROM students WHERE id = ?`,
      [config.AES_KEY, id]
    );

    const studentData = student[0][0];
    
    if (!studentData) {
      return res.status(401).json({ success: false, message: "賬號或密碼錯咗" });
    }

    // 驗證密碼（身份證後6位）
    const last6Digits = studentData.id_number?.slice(-6);
    if (last6Digits !== password) {
      return res.status(401).json({ success: false, message: "賬號或密碼錯咗" });
    }

    // 用signed cookie防止被篡改
    res.cookie("userId", studentData.id, {
      httpOnly: true,
      signed: true,  // 簽名cookie
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'strict',  // 防CSRF攻擊
      secure: process.env.NODE_ENV === 'production'  // 生產環境用HTTPS
    });
    res.cookie("userType", "student", {
      httpOnly: true,
      signed: true,  // 簽名cookie
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });

    res.status(200).json({
      success: true,
      data: {
        id: studentData.id,
        name: `${studentData.first_name} ${studentData.last_name}`,
        type: "student",
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 登出
export const logout = (req, res) => {
  res.clearCookie("userId");
  res.clearCookie("userType");
  res.status(200).json({ success: true, message: "登出成功" });
};

// 攞當前用戶嘅資料
export const getCurrentUser = async (req, res) => {
  try {
    const { id, type } = req.user;
    
    let userData;
    if (type === "staff") {
      const staff = await db("staffs").where({ id }).first();
      userData = {
        id: staff.id,
        name: `${staff.first_name} ${staff.last_name}`,
        role: staff.role,
        department: staff.department,
        type: "staff",
      };
    } else {
      const student = await db("students").where({ id }).first();
      userData = {
        id: student.id,
        name: `${student.first_name} ${student.last_name}`,
        enrollment_year: student.enrollment_year,
        type: "student",
      };
    }

    res.status(200).json({ success: true, data: userData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
