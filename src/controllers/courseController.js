import db from "../db.js";
import { logDataModification } from "../utils/logger.js";

export const getAllCourses = async (req, res) => {
  try {
    const courses = await db("courses").select("*");
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await db("courses").where({ id }).first();
    if (!course) {
      return res.status(404).json({ success: false, message: "课程不存在" });
    }
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addCourse = async (req, res) => {
  try {
    const { course_name } = req.body;
    if (!course_name) {
      return res.status(400).json({ success: false, message: "缺少课程名称" });
    }
    const [id] = await db("courses").insert({ course_name });
    logDataModification("CREATE", "course", req, { id, course_name });
    res.status(201).json({ success: true, data: { id } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const editCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { course_name } = req.body;
    if (!course_name) {
      return res.status(400).json({ success: false, message: "缺少课程名称" });
    }
    const updated = await db("courses").where({ id }).update({ course_name });
    if (!updated) {
      return res.status(404).json({ success: false, message: "课程不存在" });
    }
    logDataModification("UPDATE", "course", req, { id, changedFields: ["course_name"] });
    res.status(200).json({ success: true, message: "更新成功" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await db("courses").where({ id }).delete();
    if (!deleted) {
      return res.status(404).json({ success: false, message: "课程不存在" });
    }
    logDataModification("DELETE", "course", req, { id });
    res.status(200).json({ success: true, message: "删除成功" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
