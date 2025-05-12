import db from "../models/index.js";
import { QueryTypes } from "sequelize";
class ProgressService {
    async getProgressAll() {
        try {
            // 1. Get active users (should return 21 users)
            const [activeUsers] = await db.sequelize.query(`SELECT userId, fullname as name, username, email, phoneNumber FROM users WHERE active = 1;`);
            // 2. Get user-group mappings
            const [userGroups] = await db.sequelize.query(`
        SELECT 
          ug.userId,
          g.title as groupTitle,
          g.groupId
        FROM user_groups ug
        JOIN groups g ON ug.groupId = g.groupId
      `);
            // Create lookup tables
            const userGroupMap = new Map();
            userGroups.forEach((ug) => {
                if (!userGroupMap.has(ug.userId)) {
                    userGroupMap.set(ug.userId, []);
                }
                userGroupMap.get(ug.userId).push({
                    title: ug.groupTitle,
                    id: ug.groupId,
                });
            });
            // 3. Get other required data
            const [groups] = await db.sequelize.query(`SELECT groupId, title FROM groups;`);
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
            // 4. Get group statistics (fixed to avoid user duplication)
            const [groupStats] = await db.sequelize.query(`
        SELECT 
          g.groupId,
          g.title AS \`group\`,
          COUNT(DISTINCT ug.userId) AS total_user,
          COUNT(DISTINCT CASE 
            WHEN JSON_UNQUOTE(JSON_EXTRACT(e.data, '$.status')) IN ('submitted', 'completed') THEN e.userId 
          END) AS submitter_count
        FROM \`groups\` g
        JOIN user_groups ug ON g.groupId = ug.groupId
        LEFT JOIN exams e ON e.userId = ug.userId AND e.userId IN (
          SELECT userId FROM users WHERE active = 1
        )
        GROUP BY g.groupId, g.title
      `);
            const groupProgress = groupStats.map((stat) => {
                const progress = stat.total_user > 0
                    ? (stat.submitter_count / stat.total_user) * 100
                    : 0;
                return {
                    groupId: stat.groupId,
                    group: stat.group,
                    total: stat.total_user,
                    submitter: stat.submitter_count,
                    progress: parseFloat(progress.toFixed(2)),
                };
            });
            const runningCourseIds = runningCourses.map((c) => c.courseId);
            const runningTryoutIds = runningTryouts.map((t) => t.tryoutId);
            // 5. Get exam data for active users only
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
          AND userId IN (SELECT userId FROM users WHERE active = 1)
        `, {
                replacements: {
                    runningTryoutIds,
                    runningCourseIds,
                },
                type: QueryTypes.SELECT,
            });
            const averageScoresPerTryout = await db.sequelize.query(`
        SELECT 
          JSON_UNQUOTE(JSON_EXTRACT(e.data, '$.tryoutId')) AS tryoutId,
          JSON_UNQUOTE(JSON_EXTRACT(e.data, '$.tryoutSectionTitle')) AS tryout_title,
          ROUND(AVG(CAST(JSON_UNQUOTE(JSON_EXTRACT(e.data, '$.scores')) AS DECIMAL(10,2))), 2) AS average_score_users
        FROM exams e
        WHERE 
          JSON_UNQUOTE(JSON_EXTRACT(e.data, '$.status')) IN ('submitted', 'completed')
          AND JSON_UNQUOTE(JSON_EXTRACT(e.data, '$.tryoutId')) IN (:runningTryoutIds)
          AND userId IN (SELECT userId FROM users WHERE active = 1)
        GROUP BY tryout_title
        ORDER BY average_score_users DESC
        `, {
                replacements: { runningTryoutIds },
                type: QueryTypes.SELECT,
            });
            // 6. Calculate metrics
            const totalUser = activeUsers.length; // Now correctly 21
            const possibilityExam = runningCourses.length + runningTryouts.length;
            const allProgressScore = possibilityExam > 0
                ? parseFloat(((exams.length / (totalUser * possibilityExam)) * 100).toFixed(2))
                : 0;
            const validScores = exams
                .map((exam) => {
                if (typeof exam.scores === "string") {
                    try {
                        return parseFloat(exam.scores);
                    }
                    catch {
                        return null;
                    }
                }
                return exam.scores;
            })
                .filter((score) => typeof score === "number" && !isNaN(score) && isFinite(score));
            const averageQuizScore = validScores.length > 0
                ? parseFloat((validScores.reduce((sum, val) => sum + val, 0) /
                    validScores.length).toFixed(2))
                : null;
            // 7. Build final response
            const progressSummary = {
                totalUser,
                totalGroups: groups.length,
                averageQuizScore,
                completion: allProgressScore,
                totalExamPossible: runningCourseIds.length + runningTryoutIds.length,
                totalExamCompleted: exams.length,
                groupProgress,
                averageScoresPerTryout,
                users: activeUsers.map((user) => {
                    const userExams = exams.filter((exam) => exam.userId === user.userId);
                    const examPossible = runningCourseIds.length + runningTryoutIds.length;
                    const examCompleted = userExams.length;
                    const completion = examPossible > 0 ? (examCompleted / examPossible) * 100 : 0;
                    const userGroups = userGroupMap.get(user.userId) || [];
                    const groupTitle = userGroups.map((g) => g.title).join(", ") || "No Group";
                    const groupIds = userGroups.map((g) => g.id);
                    const userScores = userExams
                        .map((exam) => {
                        if (typeof exam.scores === "string") {
                            try {
                                return parseFloat(exam.scores);
                            }
                            catch {
                                return null;
                            }
                        }
                        return exam.scores;
                    })
                        .filter((score) => typeof score === "number" && !isNaN(score) && isFinite(score));
                    const userAverageQuizScore = userScores.length > 0
                        ? parseFloat((userScores.reduce((sum, val) => sum + val, 0) / userScores.length).toFixed(2))
                        : null;
                    return {
                        id: user.userId,
                        name: user.name || "",
                        username: user.username || "",
                        email: user.email || "",
                        phoneNumber: user.phoneNumber || "",
                        groupTitle,
                        groupIds,
                        averageQuizScore: userAverageQuizScore,
                        examCompleted,
                        examPossible,
                        completion: parseFloat(completion.toFixed(2)),
                        examList: userExams.map((exam) => ({
                            id: exam.tryoutId,
                            title: exam.tryout_title || exam.course_title,
                            type: exam.tryoutId ? "tryout" : "course",
                            status: exam.status,
                            score: exam.scores
                                ? typeof exam.scores === "string"
                                    ? (() => {
                                        try {
                                            return JSON.parse(exam.scores);
                                        }
                                        catch {
                                            return exam.scores;
                                        }
                                    })()
                                    : exam.scores
                                : null,
                        })),
                    };
                }),
            };
            return progressSummary;
        }
        catch (error) {
            throw new Error("failed to get progress:" + error.message);
        }
    }
}
export default new ProgressService();
