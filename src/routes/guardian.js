import { Router } from "express";
import {
  getAllGuardians,
  getGuardianById,
  addGuardian,
  editGuardian,
  deleteGuardian,
  getMyChildren,
  getMyChildById,
  getMyChildGrades,
  getMyChildDisciplinaryRecords,
} from "../controllers/guardianController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

// 攞晒所有家長
router.get("/", getAllGuardians);
// 攞單個家長
router.get("/:id", getGuardianById);
// 加家長
router.post("/", addGuardian);
// 改家長資料
router.put("/:id", editGuardian);
// 刪家長
router.delete("/:id", deleteGuardian);

// 監護人睇自己小朋友列表
router.get("/my/children", authenticate, getMyChildren);
// 監護人睇自己單一小朋友資料
router.get("/my/children/:studentId", authenticate, getMyChildById);
// 監護人睇自己小朋友成績
router.get("/my/children/:studentId/grades", authenticate, getMyChildGrades);
// 監護人睇自己小朋友紀律記錄
router.get("/my/children/:studentId/disciplinary", authenticate, getMyChildDisciplinaryRecords);

export default router;
