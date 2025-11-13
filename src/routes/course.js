import { Router } from "express";
import {
  getAllCourses,
  getCourseById,
  addCourse,
  editCourse,
  deleteCourse,
} from "../controllers/courseController.js";

const router = Router();

// 攞晒所有課程
router.get("/", getAllCourses);
// 攞單個課程
router.get("/:id", getCourseById);
// 加課程
router.post("/", addCourse);
// 改課程
router.put("/:id", editCourse);
// 刪課程
router.delete("/:id", deleteCourse);

export default router;
