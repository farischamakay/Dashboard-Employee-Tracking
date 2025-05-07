import express from "express";
import reportRouter from "./report.route.js";
const router = express.Router();
router.use("/reports/", reportRouter);
export default router;
