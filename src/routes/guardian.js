import { Router } from "express";
import {
  getAllGuardians,
  getGuardianById,
  addGuardian,
  editGuardian,
  deleteGuardian,
} from "../controllers/guardianController.js";

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

export default router;
