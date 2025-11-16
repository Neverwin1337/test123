import { Router } from "express";
import {
  getAllGrades,
  getGradeById,
  addGrade,
  editGrade,
  deleteGrade,
  getGradeByStudentAndCourse,
} from "../controllers/gradeController.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = Router();

// 攞晒所有成績 - 淨係ARO先得
router.get("/", authenticate, requireRole("ARO"), getAllGrades);
// 攞單個成績 - 淨係ARO先得
router.get("/:id", authenticate, requireRole("ARO"), getGradeById);
// 加成績 - 淨係ARO先得
router.post("/AddGrading", authenticate, requireRole("ARO"), addGrade);
// 改成績 - 淨係ARO先得
router.post("/EditGrading", authenticate, requireRole("ARO"), editGrade);
// 透過學生同課程攞單個成績 - 淨係ARO先得
router.get("/by-student-course", authenticate, requireRole("ARO"), getGradeByStudentAndCourse);
// 刪成績 - 淨係ARO先得
router.delete("/DeleteGrading/:id", authenticate, requireRole("ARO"), deleteGrade);

export default router;
