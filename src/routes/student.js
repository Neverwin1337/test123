import { Router } from "express";
import {
  getAllStudents,
  getStudentById,
  addStudent,
  editStudent,
  getStudentGrades,
  getStudentDisciplinaryRecords,
} from "../controllers/studentController.js";
import { authenticate, requireStaff, requireSelfOrStaff } from "../middleware/auth.js";

const router = Router();

// 攞晒所有學生 - 淨係管理員先得
router.get("/", authenticate, requireStaff, getAllStudents);

// 攞單個學生 - 管理員或者學生自己先得
router.get("/:id", authenticate, requireSelfOrStaff, getStudentById);

// 加學生 - 淨係管理員先得
router.post("/", authenticate, requireStaff, addStudent);

// 改學生資料 - 管理員或者學生自己先得
router.post("/edit/:id", authenticate, requireSelfOrStaff, editStudent);

// 睇學生成績 - 管理員或者學生自己先得
router.get("/grade/:id", authenticate, requireSelfOrStaff, getStudentGrades);

// 睇學生紀律記錄 - 管理員或者學生自己先得
router.get("/disciplinary/:id", authenticate, requireSelfOrStaff, getStudentDisciplinaryRecords);

export default router;