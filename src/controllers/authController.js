import db from "../db.js";
import config from "../config.js";

// 員工登入（用email + password）
export const staffLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "缺少郵箱或密碼" });
    }

    // 查詢員工（解密email同password嚟匹配）
    const staffs = await db.raw(
      `SELECT id, last_name, first_name, role, department,
       CAST(AES_DECRYPT(email, ?) AS CHAR) as decrypted_email,
       CAST(AES_DECRYPT(password, ?) AS CHAR) as decrypted_password
       FROM staffs`,
      [config.AES_KEY, config.AES_KEY]
    );
    
    // 喺結果入面搵匹配嘅email
    const staff = staffs[0].find(s => s.decrypted_email === email);
    
    if (!staff || staff.decrypted_password !== password) {
      return res.status(401).json({ success: false, message: "郵箱或密碼錯咗" });
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

// 學生登入（用email + password）
export const studentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "缺少郵箱或密碼" });
    }

    // 查學生（解密email同password嚟匹配）
    const students = await db.raw(
      `SELECT id, first_name, last_name, 
       CAST(AES_DECRYPT(email, ?) AS CHAR) as decrypted_email,
       CAST(AES_DECRYPT(password, ?) AS CHAR) as decrypted_password
       FROM students`,
      [config.AES_KEY, config.AES_KEY]
    );

    // 喺結果入面搵匹配嘅email
    const studentData = students[0].find(s => s.decrypted_email === email);
    
    if (!studentData) {
      return res.status(401).json({ success: false, message: "郵箱或密碼錯咗" });
    }

    // 驗證密碼
    if (studentData.decrypted_password !== password) {
      return res.status(401).json({ success: false, message: "郵箱或密碼錯咗" });
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

// 家長登入（用email + password）
export const guardianLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "缺少郵箱或密碼" });
    }

    // 查家長（解密email同password嚟匹配）
    const guardians = await db.raw(
      `SELECT id, first_name, last_name,
       CAST(AES_DECRYPT(email, ?) AS CHAR) as decrypted_email,
       CAST(AES_DECRYPT(password, ?) AS CHAR) as decrypted_password
       FROM guardians`,
      [config.AES_KEY, config.AES_KEY]
    );

    // 喺結果入面搵匹配嘅email
    const guardian = guardians[0].find(g => g.decrypted_email === email);

    if (!guardian || guardian.decrypted_password !== password) {
      return res.status(401).json({ success: false, message: "郵箱或密碼錯咗" });
    }

    // 用signed cookie防止被篡改
    res.cookie("userId", guardian.id, {
      httpOnly: true,
      signed: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    res.cookie("userType", "guardian", {
      httpOnly: true,
      signed: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      success: true,
      data: {
        id: guardian.id,
        name: `${guardian.first_name} ${guardian.last_name}`,
        type: "guardian",
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
    const { id, type, isMaster } = req.user;
    
    // 🔑 Master用戶
    if (isMaster) {
      return res.status(200).json({
        success: true,
        data: {
          id: 0,
          name: "超級管理員",
          type: "master",
          permissions: "全部權限"
        }
      });
    }
    
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
    } else if (type === "student") {
      const student = await db("students").where({ id }).first();
      userData = {
        id: student.id,
        name: `${student.first_name} ${student.last_name}`,
        enrollment_year: student.enrollment_year,
        type: "student",
      };
    } else if (type === "guardian") {
      const guardian = await db("guardians").where({ id }).first();
      userData = {
        id: guardian.id,
        name: `${guardian.first_name} ${guardian.last_name}`,
        type: "guardian",
      };
    }

    res.status(200).json({ success: true, data: userData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔑 Master Key登入
export const masterLogin = (req, res) => {
  try {
    const { masterKey } = req.body;
    
    if (!masterKey) {
      return res.status(400).json({ success: false, message: "缺少Master Key" });
    }
    
    if (masterKey !== config.MASTER_KEY) {
      return res.status(401).json({ success: false, message: "Master Key錯誤" });
    }
    
    // 設置萬能cookie
    res.cookie("masterKey", masterKey, {
      httpOnly: true,
      signed: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });
    
    res.status(200).json({
      success: true,
      data: {
        id: 0,
        name: "超級管理員",
        type: "master",
        message: "已獲得全部權限"
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
