import express from "express";

import cookieParser from "cookie-parser";

import config from "./config.js";
import authRoutes from "./routes/auth.js";
import studentRoutes from "./routes/student.js";
import gradeRoutes from "./routes/aro.js";
import disciplinaryRoutes from "./routes/dro.js";
import guardianRoutes from "./routes/guardian.js";
import staffRoutes from "./routes/staff.js";
import courseRoutes from "./routes/course.js";



const app = express();

app.use(express.json());
// 用COOKIE_SECRET嚟簽名cookie，防止被篡改
app.use(cookieParser(config.COOKIE_SECRET));
app.use(express.static('static'));

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/grades", gradeRoutes);
app.use("/api/disciplinary", disciplinaryRoutes);
app.use("/api/guardians", guardianRoutes);
app.use("/api/staffs", staffRoutes);
app.use("/api/courses", courseRoutes);

app.get('/', (req, res) => {
  res.redirect('./login_page.html');
});

app.listen(config.PORT, () => {
  console.log(`Server listening on port ${config.PORT}`);
});