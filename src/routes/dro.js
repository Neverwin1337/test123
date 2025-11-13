import { Router } from "express";
import {
  getAllDisciplinaryRecords,
  getDisciplinaryRecordById,
  addDisciplinaryRecord,
  editDisciplinaryRecord,
  deleteDisciplinaryRecord,
} from "../controllers/disciplinaryController.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = Router();

// 攞晒所有紀律記錄 - 淨係DRO先得
router.get("/", authenticate, requireRole("DRO"), getAllDisciplinaryRecords);
// 攞單個紀律記錄 - 淨係DRO先得
router.get("/:id", authenticate, requireRole("DRO"), getDisciplinaryRecordById);
// 加紀律記錄 - 淨係DRO先得
router.post("/AddDisciplinary", authenticate, requireRole("DRO"), addDisciplinaryRecord);
// 改紀律記錄 - 淨係DRO先得
router.post("/EditDisciplinary", authenticate, requireRole("DRO"), editDisciplinaryRecord);
// 刪紀律記錄 - 淨係DRO先得
router.delete("/DeleteDisciplinary/:id", authenticate, requireRole("DRO"), deleteDisciplinaryRecord);

export default router;
