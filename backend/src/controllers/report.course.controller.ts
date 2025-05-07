import { Request, Response } from "express";
import ProgressService from "../services/progress.running.service.js";

class ReportController {
  async getAllCourses(req: Request, res: Response): Promise<void> {
    try {
      const listRunningCourses = await ProgressService.getRunningCourses();
      res.status(200).json({
        status: "Success",
        message: "Successfully get list running courses",
        listRunningCourses,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAllTryouts(req: Request, res: Response): Promise<void> {
    try {
      const listRunningTryouts =
        await ProgressService.getRunningTryoutSections();
      res.status(200).json({
        status: "Success",
        message: "Successfully get list running tryouts",
        listRunningTryouts,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getUserProgress(req: Request, res: Response): Promise<void> {
    console.log("Raw productId from params:", req.params.productId);

    // Clean the ID (remove leading colon if present)
    const userId = req.params.userId.replace(/^:/, "");
    console.log("Cleaned productId:", userId);

    try {
      const userProgress = await ProgressService.getProgress(userId);
      res.status(200).json({
        status: "Success",
        message: "Successfully get list running exams",
        userProgress,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAllProgressUsers(req: Request, res: Response): Promise<void> {
    try {
      const progressUsers = await ProgressService.getProgressAll();
      res.status(200).json({
        status: "Success",
        message: "Successfully get list running exams",
        progressUsers,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async generateReport(req: Request, res: Response): Promise<void> {
    try {
      const report = await ProgressService.generateReport(
        req.body.referenceType,
        req.body.referenceId
      );
      res.status(200).json({
        status: "Success",
        message: "Successfully get list running exams",
        report,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new ReportController();
