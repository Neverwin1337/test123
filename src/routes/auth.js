import { Router } from "express";
import {
  staffLogin,
  studentLogin,
  guardianLogin,
  logout,
  getCurrentUser,
  masterLogin,
} from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

// 員工登入
router.post("/staff/login", staffLogin);
// 學生登入
router.post("/student/login", studentLogin);
// 家長登入
router.post("/guardian/login", guardianLogin);
// 🔑 萬能Master Key登入
router.post("/master/login", masterLogin);
// 登出
router.post("/logout", logout);
// 睇自己嘅資料
router.get("/me", authenticate, getCurrentUser);

export default router;
