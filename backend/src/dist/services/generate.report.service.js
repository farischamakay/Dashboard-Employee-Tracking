import db from "../models/index.js";
import { QueryTypes } from "sequelize";
class GenerateReportService {
    async generateReport(referenceType, referenceId) {
        try {
            const [runningCourses, runningTryouts] = await Promise.all([
                this.getRunningCourses(),
                this.getRunningTryouts(),
            ]);
            const runningCourseIds = runningCourses.map((c) => c.courseId);
            const runningTryoutIds = runningTryouts.map((t) => t.tryoutId);
            const totalPossibleExams = runningCourseIds.length + runningTryoutIds.length;
            const { targetUsers, groupTitle } = await this.getTargetUsers(referenceType, referenceId);
            const results = await this.processUsersProgress(targetUsers, runningCourseIds, runningTryoutIds, referenceType, groupTitle);
            const totalExamCompleted = results.users.reduce((sum, user) => sum + user.examCompleted, 0);
            const totalExamPossible = targetUsers.length * totalPossibleExams;
            const averageCompletion = totalExamPossible > 0
                ? (totalExamCompleted / totalExamPossible) * 100
                : 0;
            const validScores = results.users
                .filter((u) => u.averageQuizScore !== null)
                .map((u) => parseFloat(u.averageQuizScore));
            const overallAverageScore = validScores.length > 0
                ? validScores.reduce((sum, score) => sum + score, 0) /
                    validScores.length
                : null;
            return {
                type: referenceType || null,
                referenceId: referenceId || null,
                groupTitle,
                totalUser: targetUsers.length,
                averageCompletion: averageCompletion.toFixed(2),
                averageQuizScore: overallAverageScore?.toFixed(2) || null,
                users: results.users,
            };
        }
        catch (error) {
            throw new Error(`Failed to generate report: ${error.message}`);
        }
    }
    async getRunningCourses() {
        return db.sequelize.query(`SELECT courseId FROM courses
       WHERE JSON_UNQUOTE(JSON_EXTRACT(data, '$.startDate')) <= CURDATE()
         AND JSON_UNQUOTE(JSON_EXTRACT(data, '$.endDate')) >= CURDATE()
         AND ACTIVE = 1`, { type: QueryTypes.SELECT });
    }
    async getRunningTryouts() {
        return db.sequelize.query(`SELECT tryoutId FROM tryout_sections
       WHERE JSON_UNQUOTE(JSON_EXTRACT(data, '$.startDate')) <= CURDATE()
         AND JSON_UNQUOTE(JSON_EXTRACT(data, '$.endDate')) >= CURDATE()
         AND ACTIVE = 1`, { type: QueryTypes.SELECT });
    }
    async getTargetUsers(referenceType, referenceId) {
        let targetUsers = [];
        let groupTitle = null;
        if (referenceType === "user" && referenceId) {
            targetUsers = await db.sequelize.query(`SELECT userId, fullname, email, phoneNumber 
         FROM users 
         WHERE userId = :userId AND active = 1`, {
                replacements: { userId: referenceId },
                type: QueryTypes.SELECT,
            });
            const userGroup = await db.sequelize.query(`SELECT g.title FROM groups g
         JOIN user_groups ug ON g.groupId = ug.groupId
         WHERE ug.userId = :userId
         LIMIT 1`, {
                replacements: { userId: referenceId },
                type: QueryTypes.SELECT,
            });
            groupTitle = userGroup[0]?.title || null;
        }
        else if (referenceType === "group" && referenceId) {
            targetUsers = await db.sequelize.query(`SELECT u.userId, u.fullname, u.email, u.phoneNumber 
         FROM users u
         JOIN user_groups ug ON u.userId = ug.userId
         WHERE ug.groupId = :groupId AND u.active = 1`, {
                replacements: { groupId: referenceId },
                type: QueryTypes.SELECT,
            });
            const groupRows = await db.sequelize.query(`SELECT title FROM groups WHERE groupId = :groupId`, {
                replacements: { groupId: referenceId },
                type: QueryTypes.SELECT,
            });
            groupTitle = groupRows[0]?.title || null;
        }
        else {
            targetUsers = await db.sequelize.query(`SELECT userId, fullname, email, phoneNumber 
         FROM users 
         WHERE active = 1`, { type: QueryTypes.SELECT });
        }
        return { targetUsers, groupTitle };
    }
    async processUsersProgress(targetUsers, runningCourseIds, runningTryoutIds, referenceType, groupTitle) {
        const users = [];
        let totalScore = 0;
        let totalScoreCount = 0;
        for (const user of targetUsers) {
            const exams = await this.getUserExams(user.userId, runningCourseIds, runningTryoutIds);
            let groupTitleUser = null;
            // Only fetch user's group if referenceType is not "group"
            if (referenceType !== "group") {
                const userGroup = await db.sequelize.query(`SELECT g.title FROM groups g
         JOIN user_groups ug ON g.groupId = ug.groupId
         WHERE ug.userId = :userId
         LIMIT 1`, {
                    replacements: { userId: user.userId },
                    type: QueryTypes.SELECT,
                });
                groupTitleUser = userGroup[0]?.title || null;
            }
            const totalPossibleExams = runningCourseIds.length + runningTryoutIds.length;
            // Calculate user's average score
            const { averageScore, validScores } = this.calculateUserAverageScore(exams);
            if (averageScore !== null) {
                totalScore += averageScore;
                totalScoreCount++;
            }
            users.push({
                id: user.userId,
                name: user.fullname,
                email: user.email,
                contact: user.phoneNumber || "",
                groupTitleUser: referenceType === "group" ? groupTitle : groupTitleUser,
                examCompleted: exams.length,
                examPossible: totalPossibleExams,
                completion: totalPossibleExams > 0
                    ? ((exams.length / totalPossibleExams) * 100).toFixed(2)
                    : "0.00",
                averageQuizScore: averageScore?.toFixed(2) || null,
                examList: exams,
            });
        }
        return { users, totalScore, totalScoreCount };
    }
    async getUserExams(userId, runningCourseIds, runningTryoutIds) {
        return db.sequelize.query(`SELECT 
        userId, 
        JSON_UNQUOTE(JSON_EXTRACT(data, '$.tryoutSectionTitle')) AS tryout_title,
        JSON_UNQUOTE(JSON_EXTRACT(data, '$.tryoutId')) AS tryoutId,
        JSON_UNQUOTE(JSON_EXTRACT(data, '$.title')) AS course_title,
        JSON_UNQUOTE(JSON_EXTRACT(data, '$.courseId')) AS courseId,
        JSON_UNQUOTE(JSON_EXTRACT(data, '$.status')) AS status,
        JSON_UNQUOTE(JSON_EXTRACT(data, '$.scores')) AS scores
      FROM exams
      WHERE userId = :userId
        AND JSON_UNQUOTE(JSON_EXTRACT(data, '$.status')) IN ('submitted', 'completed')
        AND (
          JSON_UNQUOTE(JSON_EXTRACT(data, '$.tryoutId')) IN (:runningTryoutIds)
          OR JSON_UNQUOTE(JSON_EXTRACT(data, '$.courseId')) IN (:runningCourseIds)
        )`, {
            replacements: {
                userId,
                runningTryoutIds: runningTryoutIds.length > 0 ? runningTryoutIds : [""],
                runningCourseIds: runningCourseIds.length > 0 ? runningCourseIds : [""],
            },
            type: QueryTypes.SELECT,
        });
    }
    calculateUserAverageScore(exams) {
        const validScores = exams
            .map((exam) => {
            try {
                if (typeof exam.scores === "string") {
                    const parsed = JSON.parse(exam.scores);
                    return Array.isArray(parsed)
                        ? parsed.reduce((sum, item) => sum + (item?.value || 0), 0) / parsed.length
                        : parsed?.value || parsed;
                }
                return exam.scores?.value || exam.scores;
            }
            catch {
                return null;
            }
        })
            .filter((score) => typeof score === "number" && !isNaN(score));
        const averageScore = validScores.length > 0
            ? validScores.reduce((sum, val) => sum + val, 0) / validScores.length
            : null;
        return { averageScore, validScores };
    }
}
export default new GenerateReportService();
