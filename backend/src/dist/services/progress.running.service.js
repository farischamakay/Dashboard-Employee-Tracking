import db from "../models/index.js";
import { QueryTypes } from "sequelize";
class ProgressService {
    async getRunningCourses() {
        try {
            const [runningCourses] = await db.sequelize.query(`
        SELECT courseId, title, data
        FROM courses
        WHERE JSON_UNQUOTE(JSON_EXTRACT(data, '$.startDate')) <= CURDATE()
          AND JSON_UNQUOTE(JSON_EXTRACT(data, '$.endDate')) >= CURDATE()
      `);
            return runningCourses;
        }
        catch (error) {
            throw new Error("failed to get progress:" + error.message);
        }
    }
    async getRunningTryoutSections() {
        try {
            const [runningTryouts] = await db.sequelize.query(`
      SELECT tryoutId, title, data
      FROM tryout_sections
      WHERE JSON_UNQUOTE(JSON_EXTRACT(data, '$.startDate')) <= CURDATE()
        AND JSON_UNQUOTE(JSON_EXTRACT(data, '$.endDate')) >= CURDATE()
    `);
            return runningTryouts;
        }
        catch (error) {
            throw new Error("failed to get progress:" + error.message);
        }
    }
    async getProgress(userId) {
        try {
            const [runningCourses] = await db.sequelize.query(`
        SELECT courseId, title
        FROM courses
        WHERE JSON_UNQUOTE(JSON_EXTRACT(data, '$.startDate')) <= CURDATE()
          AND JSON_UNQUOTE(JSON_EXTRACT(data, '$.endDate')) >= CURDATE()
      `);
            const [runningTryouts] = await db.sequelize.query(`
        SELECT tryoutId
        FROM tryout_sections
        WHERE JSON_UNQUOTE(JSON_EXTRACT(data, '$.startDate')) <= CURDATE()
          AND JSON_UNQUOTE(JSON_EXTRACT(data, '$.endDate')) >= CURDATE()
      `);
            const exams = await db.sequelize.query(`
        SELECT *
        FROM exams
        WHERE userId = userId
          AND JSON_UNQUOTE(JSON_EXTRACT(data, '$.status')) IN ('submitted', 'completed')
          AND (
            JSON_UNQUOTE(JSON_EXTRACT(data, '$.tryoutId')) IN (:runningTryoutIds)
            OR JSON_UNQUOTE(JSON_EXTRACT(data, '$.courseId')) IN (:runningCourseIds)
          )
        `, {
                replacements: {
                    userId: userId,
                    runningTryoutIds: runningTryouts.map((t) => t.tryoutId),
                    runningCourseIds: runningCourses.map((c) => c.courseId),
                },
                type: QueryTypes.SELECT,
            });
            const possibilityExam = runningCourses.length + runningTryouts.length;
            const progress = possibilityExam > 0 ? (exams.length / possibilityExam) * 100 : 0;
            console.log("progress", progress);
            console.log("exams", exams.length);
            console.log("runningCourses.length", runningCourses.length);
            console.log("runningTryouts.length", runningTryouts.length);
            return {
                userId,
                runningCourses,
                progress,
            };
        }
        catch (error) {
            throw new Error("failed to get progress:" + error.message);
        }
    }
    async getProgressAllUsers() {
        try {
            const [users] = await db.sequelize.query(`SELECT DISTINCT userId FROM users WHERE active = 1;`);
            const [runningCourses] = await db.sequelize.query(`
        SELECT courseId
        FROM courses
        WHERE JSON_UNQUOTE(JSON_EXTRACT(data, '$.startDate')) <= CURDATE()
          AND JSON_UNQUOTE(JSON_EXTRACT(data, '$.endDate')) >= CURDATE()
      `);
            const [runningTryouts] = await db.sequelize.query(`
        SELECT tryoutId
        FROM tryout_sections
        WHERE JSON_UNQUOTE(JSON_EXTRACT(data, '$.startDate')) <= CURDATE()
          AND JSON_UNQUOTE(JSON_EXTRACT(data, '$.endDate')) >= CURDATE()
      `);
            const runningCourseIds = runningCourses.map((c) => c.courseId);
            const runningTryoutIds = runningTryouts.map((t) => t.tryoutId);
            const exams = await db.sequelize.query(`
        SELECT
          userId,
          JSON_UNQUOTE(JSON_EXTRACT(data, '$.tryoutSectionTitle')) AS tryout_title,
          JSON_UNQUOTE(JSON_EXTRACT(data, '$.tryoutId')) AS tryoutId,
          JSON_UNQUOTE(JSON_EXTRACT(data, '$.title')) AS course_title,
          JSON_UNQUOTE(JSON_EXTRACT(data, '$.courseId')) AS courseId,
          JSON_UNQUOTE(JSON_EXTRACT(data, '$.status')) AS status,
          JSON_UNQUOTE(JSON_EXTRACT(data, '$.scores')) AS scores
        FROM exams
        WHERE JSON_UNQUOTE(JSON_EXTRACT(data, '$.status')) IN ('submitted', 'completed')
          AND (
            JSON_UNQUOTE(JSON_EXTRACT(data, '$.tryoutId')) IN (:runningTryoutIds)
            OR JSON_UNQUOTE(JSON_EXTRACT(data, '$.courseId')) IN (:runningCourseIds)
          )
        `, {
                replacements: {
                    runningTryoutIds,
                    runningCourseIds,
                },
                type: QueryTypes.SELECT,
            });
            const totalUser = users.length;
            const possibilityExam = runningCourses.length + runningTryouts.length;
            const allProgress = possibilityExam > 0 ? exams.length / (totalUser * possibilityExam) : 0;
            // Rata-rata quiz score
            const validScores = exams
                .map((exam) => exam.scores)
                .filter((score) => score !== null && !isNaN(score));
            const averageQuizScore = validScores.length > 0
                ? validScores.reduce((sum, val) => sum + parseFloat(val), 0) /
                    validScores.length
                : null;
            console.log("valid score", validScores);
            console.log("avr score", averageQuizScore);
            console.log("user ", totalUser);
            console.log("possibly ", possibilityExam);
            console.log("allprogress ", allProgress);
            const progressSummary = {
                totalUser: users.length,
                allProgress,
                averageQuizScore,
                exams,
            };
            return progressSummary;
        }
        catch (error) {
            throw new Error("failed to get progress:" + error.message);
        }
    }
    async generateReport(referenceType, referenceId) {
        try {
            let targetUsers = [];
            let groupTitle = null;
            if (referenceType === "user" && referenceId) {
                targetUsers = await db.sequelize.query(`SELECT userId, fullname, email FROM users WHERE userId = :userId AND active = 1`, {
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
                const groupData = userGroup[0];
                groupTitle = groupData?.title || null;
            }
            else if (referenceType === "group" && referenceId) {
                targetUsers = await db.sequelize.query(`SELECT u.userId, u.fullname, u.email FROM users u
           JOIN user_groups ug ON u.userId = ug.userId
           WHERE ug.groupId = :groupId AND u.active = 1`, {
                    replacements: { groupId: referenceId },
                    type: QueryTypes.SELECT,
                });
                const groupRows = await db.sequelize.query(`SELECT title FROM groups WHERE groupId = :groupId`, {
                    replacements: { groupId: referenceId, userId: referenceId },
                    type: QueryTypes.SELECT,
                });
                const groupData = groupRows[0];
                groupTitle = groupData?.title || null;
            }
            else {
                targetUsers = await db.sequelize.query(`SELECT userId, fullname, email FROM users WHERE active = 1`, {
                    type: QueryTypes.SELECT,
                });
            }
            const runningCourses = await db.sequelize.query(`SELECT courseId FROM courses
         WHERE JSON_UNQUOTE(JSON_EXTRACT(data, '$.startDate')) <= CURDATE()
           AND JSON_UNQUOTE(JSON_EXTRACT(data, '$.endDate')) >= CURDATE()`, { type: QueryTypes.SELECT });
            const runningTryouts = await db.sequelize.query(`SELECT tryoutId FROM tryout_sections
         WHERE JSON_UNQUOTE(JSON_EXTRACT(data, '$.startDate')) <= CURDATE()
           AND JSON_UNQUOTE(JSON_EXTRACT(data, '$.endDate')) >= CURDATE()`, { type: QueryTypes.SELECT });
            const runningCourseIds = runningCourses.map((c) => c.courseId);
            const runningTryoutIds = runningTryouts.map((t) => t.tryoutId);
            let totalExamCompleted = 0;
            let totalScore = 0;
            let totalScoreCount = 0;
            const totalExamPossible = targetUsers.length *
                (runningCourseIds.length + runningTryoutIds.length);
            const users = [];
            for (const user of targetUsers) {
                const exams = await db.sequelize.query(`SELECT userId, 
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
                        userId: user.userId,
                        runningTryoutIds,
                        runningCourseIds,
                    },
                    type: QueryTypes.SELECT,
                });
                // Rata-rata quiz score
                const validScores = exams
                    .map((exam) => exam.scores)
                    .filter((score) => score !== null && !isNaN(score));
                const userScoreSum = validScores.reduce((sum, val) => sum + val, 0);
                const userAverageScore = validScores.length > 0 ? userScoreSum / validScores.length : null;
                totalExamCompleted += exams.length;
                totalScore += userScoreSum;
                totalScoreCount += validScores.length;
                users.push({
                    id: user.userId,
                    name: user.fullname,
                    email: user.email,
                    examList: exams,
                    groupTitle,
                    examCompleted: exams.length,
                    examPossible: runningCourseIds.length + runningTryoutIds.length,
                    completion: ((exams.length /
                        (runningCourseIds.length + runningTryoutIds.length)) *
                        100).toFixed(2),
                    averageQuizScore: userAverageScore !== null ? userAverageScore.toFixed(2) : null,
                });
            }
            const averageCompletion = totalExamPossible > 0
                ? (totalExamCompleted / totalExamPossible) * 100
                : 0;
            const averageQuizScore = totalScoreCount > 0 ? totalScore / totalScoreCount : null;
            return {
                type: referenceType || "all",
                referenceId: referenceId || null,
                groupTitle,
                totalUser: targetUsers.length,
                totalExamPossible,
                totalExamCompleted,
                averageCompletion: averageCompletion.toFixed(2),
                averageQuizScore: averageQuizScore !== null ? averageQuizScore.toFixed(2) : null,
                users: users,
            };
        }
        catch (error) {
            throw new Error("failed to get progress: " + error.message);
        }
    }
}
export default new ProgressService();
