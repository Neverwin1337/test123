import { Router } from "express";
import {
  getAllStaffs,
  getStaffById,
  addStaff,
  editStaff,
  deleteStaff,
} from "../controllers/staffController.js";

const router = Router();

// 攞晒所有員工
router.get("/", getAllStaffs);
// 攞單個員工
router.get("/:id", getStaffById);
// 加員工
router.post("/", addStaff);
// 改員工資料
router.put("/:id", editStaff);
// 刪員工
router.delete("/:id", deleteStaff);

export default router;
