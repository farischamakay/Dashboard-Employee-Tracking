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
    async getProgressById(userId) {
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
            const username = await db.sequelize.query(`SELECT fullname, phoneNumber FROM users WHERE userId = :userId`, {
                replacements: { userId: userId },
                type: QueryTypes.SELECT,
            });
            const name = username[0]?.fullname || "";
            const phoneNumber = username[0]?.phoneNumber || "";
            const userGroup = await db.sequelize.query(`SELECT g.title FROM groups g
          JOIN user_groups ug ON g.groupId = ug.groupId
          WHERE ug.userId = :userId
          LIMIT 1`, {
                replacements: { userId: userId },
                type: QueryTypes.SELECT,
            });
            const groupData = userGroup[0];
            const groupTitle = groupData?.title || null;
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
        WHERE userId = userId
          AND JSON_UNQUOTE(JSON_EXTRACT(data, '$.status')) IN ('submitted', 'completed')
          AND (
            JSON_UNQUOTE(JSON_EXTRACT(data, '$.tryoutId')) IN (:runningTryoutIds)
            OR JSON_UNQUOTE(JSON_EXTRACT(data, '$.courseId')) IN (:runningCourseIds)
          )
        `, {
                replacements: {
                    userId: userId,
                    runningTryoutIds,
                    runningCourseIds,
                },
                type: QueryTypes.SELECT,
            });
            // Rata-rata quiz score
            const validScores = exams
                .map((exam) => exam.scores)
                .filter((score) => score !== null && !isNaN(score));
            const possibilityExam = runningCourses.length + runningTryouts.length;
            const averageQuizScore = validScores.length > 0
                ? validScores.reduce((sum, val) => sum + parseFloat(val), 0) /
                    validScores.length
                : null;
            const progress = possibilityExam > 0 ? (exams.length / possibilityExam) * 100 : 0;
            return {
                id: userId,
                name,
                phoneNumber,
                groupTitle,
                averageQuizScore,
                examCompleted: exams.length,
                examPossible: runningCourseIds.length + runningTryoutIds.length,
                completion: progress.toFixed(2),
                examList: exams,
            };
        }
        catch (error) {
            throw new Error("failed to get progress:" + error.message);
        }
    }
    async getProgressAll() {
        try {
            const [users] = await db.sequelize.query(`SELECT DISTINCT userId FROM users WHERE active = 1;`);
            const [groups] = await db.sequelize.query(`SELECT title FROM groups;`);
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
            // Ambil statistik grup (total user, submitter_count per grup)
            const [groupStats] = await db.sequelize.query(`
      SELECT 
        g.title AS \`group\`,
        COUNT(DISTINCT ug.userId) AS total_user,
        COUNT(DISTINCT CASE 
          WHEN JSON_UNQUOTE(JSON_EXTRACT(e.data, '$.status')) IN ('submitted', 'completed') THEN e.userId 
        END) AS submitter_count
      FROM \`groups\` g
      JOIN user_groups ug ON g.groupId = ug.groupId
      LEFT JOIN exams e ON e.userId = ug.userId
      GROUP BY g.title
    `);
            const groupData = groupStats.map((stat) => ({
                group: stat.group,
                total: stat.total_user,
                submitter: stat.submitter_count,
            }));
            // Hitung progress grup
            const groupProgress = groupData.map((data) => {
                const progress = data.total > 0 ? (data.submitter / data.total) * 100 : 0;
                return {
                    group: data.group,
                    total: data.total,
                    submitter: data.submitter,
                    progress: parseFloat(progress.toFixed(2)), // Membatasi 2 desimal
                };
            });
            const runningCourseIds = runningCourses.map((c) => c.courseId);
            const runningTryoutIds = runningTryouts.map((t) => t.tryoutId);
            const averageScoresPerTryout = await db.sequelize.query(`
        SELECT 
          JSON_UNQUOTE(JSON_EXTRACT(e.data, '$.tryoutSectionTitle')) AS tryout_title,
          ROUND(AVG(CAST(JSON_UNQUOTE(JSON_EXTRACT(e.data, '$.scores')) AS DECIMAL(10,2))), 2) AS average_score_users
        FROM exams e
        WHERE 
          JSON_UNQUOTE(JSON_EXTRACT(e.data, '$.status')) IN ('submitted', 'completed')
          AND JSON_UNQUOTE(JSON_EXTRACT(e.data, '$.tryoutId')) IN (:runningTryoutIds)
        GROUP BY tryout_title
        ORDER BY average_score_users DESC
        `, {
                replacements: {
                    runningTryoutIds,
                },
                type: QueryTypes.SELECT,
            });
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
            const allProgressScore = possibilityExam > 0
                ? parseFloat(((exams.length / (totalUser * possibilityExam)) * 100).toFixed(2))
                : 0;
            // Rata-rata quiz score
            const validScores = exams
                .map((exam) => exam.scores)
                .filter((score) => score !== null && !isNaN(score));
            const averageQuizScore = validScores.length > 0
                ? validScores.reduce((sum, val) => sum + parseFloat(val), 0) /
                    validScores.length
                : null;
            const progressSummary = {
                totalUser: users.length,
                totalGroups: groups.length,
                averageQuizScore,
                completion: allProgressScore,
                totalExamPossible: runningCourseIds.length + runningTryoutIds.length,
                totalExamCompleted: exams.length,
                groupProgress,
                averageScoresPerTryout,
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
