import express from "express";
import ReportController from "../controllers/report.course.controller.js";
const router = express.Router();

router.get("/running-courses", ReportController.getAllCourses);
router.get("/running-tryout-sections", ReportController.getAllTryouts);
router.get("/progress/:userId", ReportController.getUserProgress);
router.get("/progress", ReportController.getAllProgressUsers);
router.post("/generate-report/progress", ReportController.generateReport);

export default router;
