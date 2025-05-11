import ProgressService from "../services/progress.all.service.js";
import GenerateReportService from "../services/generate.report.service.js";
import RunningProgressService from "../services/progress.running.service.js";
class ReportController {
    async getAllCourses(req, res) {
        try {
            const listRunningCourses = await RunningProgressService.getRunningCourses();
            res.status(200).json({
                status: "Success",
                message: "Successfully get list running courses",
                listRunningCourses,
            });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    async getAllTryouts(req, res) {
        try {
            const listRunningTryouts = await RunningProgressService.getRunningTryoutSections();
            res.status(200).json({
                status: "Success",
                message: "Successfully get list running tryouts",
                listRunningTryouts,
            });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    async getUserProgress(req, res) {
        console.log("Raw productId from params:", req.params.productId);
        // Clean the ID (remove leading colon if present)
        const userId = req.params.userId.replace(/^:/, "");
        console.log("Cleaned productId:", userId);
        try {
            const userProgress = await ProgressService.getProgressById(userId);
            res.status(200).json({
                status: "Success",
                message: "Successfully get list running exams",
                userProgress,
            });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    async getAllProgressUsers(req, res) {
        try {
            const progressUsers = await ProgressService.getProgressAll();
            res.status(200).json({
                status: "Success",
                message: "Successfully get list running exams",
                progressUsers,
            });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    async generateReport(req, res) {
        try {
            const report = await GenerateReportService.generateReport(req.body.referenceType, req.body.referenceId);
            res.status(200).json({
                status: "Success",
                message: "Successfully get list running exams",
                report,
            });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}
export default new ReportController();
