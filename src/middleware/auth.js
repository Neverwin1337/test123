import db from "../db.js";

// 驗證用戶登咗入未
export const authenticate = async (req, res, next) => {
  try {
    // 讀取signed cookie（防止被篡改）
    const userId = req.signedCookies.userId;
    const userType = req.signedCookies.userType;

    if (!userId || !userType) {
      return res.status(401).json({ success: false, message: "未登入或cookie已被篡改" });
    }

    // 睇下用戶存唔存在
    let user;
    if (userType === "staff") {
      user = await db("staffs").where({ id: userId }).first();
    } else if (userType === "student") {
      user = await db("students").where({ id: userId }).first();
    }

    if (!user) {
      return res.status(401).json({ success: false, message: "用戶唔存在" });
    }

    req.user = { id: userId, type: userType };
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 驗證係咪管理員（staff）
export const requireStaff = (req, res, next) => {
  if (req.user.type !== "staff") {
    return res.status(403).json({ success: false, message: "權限唔夠" });
  }
  next();
};

// 驗證學生淨係可以睇自己嘅嘢
export const requireSelfOrStaff = (req, res, next) => {
  const resourceId = req.params.id || req.body.student_id;
  
  if (req.user.type === "staff") {
    return next();
  }
  
  if (req.user.type === "student" && req.user.id == resourceId) {
    return next();
  }
  
  return res.status(403).json({ success: false, message: "淨係可以睇自己嘅資料" });
};

// 驗證員工有冇指定嘅role
export const requireRole = (requiredRole) => {
  return async (req, res, next) => {
    try {
      if (req.user.type !== "staff") {
        return res.status(403).json({ success: false, message: "權限唔夠" });
      }

      const staff = await db("staffs").where({ id: req.user.id }).first();
      
      if (!staff || staff.role !== requiredRole) {
        return res.status(403).json({ 
          success: false, 
          message: `淨係${requiredRole}先可以做呢個操作` 
        });
      }

      next();
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
};
