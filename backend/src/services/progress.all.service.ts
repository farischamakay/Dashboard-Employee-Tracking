import { group } from "console";
import db from "../models/index.js";
import { QueryTypes } from "sequelize";

class ProgressService {
  async getProgressById(userId: string) {
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

      const userData: {
        fullname: string;
        email: string;
        phoneNumber: string;
      }[] = await db.sequelize.query(
        `SELECT fullname, email, phoneNumber FROM users WHERE userId = :userId`,
        {
          replacements: { userId: userId },
          type: QueryTypes.SELECT,
        }
      );

      const userGroup = await db.sequelize.query(
        `SELECT g.title FROM groups g
          JOIN user_groups ug ON g.groupId = ug.groupId
          WHERE ug.userId = :userId
          LIMIT 1`,
        {
          replacements: { userId: userId },
          type: QueryTypes.SELECT,
        }
      );

      const groupData = userGroup[0] as { title: string } | undefined;
      const groupTitle = groupData?.title || null;

      const runningCourseIds = runningCourses.map((c: any) => c.courseId);
      const runningTryoutIds = runningTryouts.map((t: any) => t.tryoutId);

      const exams: any[] = await db.sequelize.query(
        `
        SELECT 
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
          )
        `,
        {
          replacements: {
            userId: userId,
            runningTryoutIds:
              runningTryoutIds.length > 0 ? runningTryoutIds : [""],
            runningCourseIds:
              runningCourseIds.length > 0 ? runningCourseIds : [""],
          },
          type: QueryTypes.SELECT,
        }
      );

      // Calculate metrics
      const user = userData[0];
      const examCompleted = exams.length;
      const examPossible = runningCourseIds.length + runningTryoutIds.length;
      const completion =
        examPossible > 0
          ? Math.min(100, Math.round((examCompleted / examPossible) * 100))
          : 0;

      // Calculate average quiz score
      let totalScore = 0;
      let scoreCount = 0;
      exams.forEach((exam) => {
        try {
          // Handle case when scores is already a number
          if (typeof exam.scores === "number") {
            totalScore += exam.scores;
            scoreCount++;
            return;
          }

          // Handle stringified JSON
          const scores =
            typeof exam.scores === "string"
              ? JSON.parse(exam.scores)
              : exam.scores;

          if (Array.isArray(scores)) {
            const validScores = scores.filter(
              (s) => s && typeof s.value === "number"
            );
            if (validScores.length > 0) {
              const examTotal = validScores.reduce(
                (sum, score) => sum + score.value,
                0
              );
              totalScore += examTotal / validScores.length;
              scoreCount++;
            }
          } else if (
            typeof scores === "object" &&
            scores !== null &&
            typeof scores.value === "number"
          ) {
            // Handle case when scores is a single object {value: number}
            totalScore += scores.value;
            scoreCount++;
          } else if (typeof scores === "number") {
            // Handle case when scores is direct number
            totalScore += scores;
            scoreCount++;
          }
        } catch (e) {
          console.error("Error processing scores:", e, "for exam:", exam);
        }
      });

      const averageQuizScore =
        scoreCount > 0 ? Math.round((totalScore / scoreCount) * 100) / 100 : 0;
      return {
        id: userId,
        name: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        groupTitle,
        averageQuizScore,
        examCompleted,
        examPossible,
        completion,
        examList: exams.map((exam) => ({
          title: exam.tryout_title || exam.course_title,
          type: exam.tryoutId ? "tryout" : "course",
          status: exam.status,
          score: exam.scores ? JSON.parse(exam.scores) : null,
        })),
      };
    } catch (error: any) {
      throw new Error("failed to get progress:" + error.message);
    }
  }

  async getProgressAll() {
    try {
      const [users] = await db.sequelize.query(
        `SELECT DISTINCT userId FROM users WHERE active = 1;`
      );
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
        g.groupId as groupId,
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

      const groupData = groupStats.map((stat: any) => ({
        groupId: stat.groupId,
        group: stat.group,
        total: stat.total_user,
        submitter: stat.submitter_count,
      }));

      // Hitung progress grup
      const groupProgress = groupData.map((data) => {
        const progress =
          data.total > 0 ? (data.submitter / data.total) * 100 : 0;
        return {
          groupId: data.groupId,
          group: data.group,
          total: data.total,
          submitter: data.submitter,
          progress: parseFloat(progress.toFixed(2)), // Membatasi 2 desimal
        };
      });

      const runningCourseIds = runningCourses.map((c: any) => c.courseId);
      const runningTryoutIds = runningTryouts.map((t: any) => t.tryoutId);

      const averageScoresPerTryout = await db.sequelize.query(
        `
        SELECT 
          JSON_UNQUOTE(JSON_EXTRACT(e.data, '$.tryoutSectionTitle')) AS tryout_title,
          ROUND(AVG(CAST(JSON_UNQUOTE(JSON_EXTRACT(e.data, '$.scores')) AS DECIMAL(10,2))), 2) AS average_score_users
        FROM exams e
        WHERE 
          JSON_UNQUOTE(JSON_EXTRACT(e.data, '$.status')) IN ('submitted', 'completed')
          AND JSON_UNQUOTE(JSON_EXTRACT(e.data, '$.tryoutId')) IN (:runningTryoutIds)
        GROUP BY tryout_title
        ORDER BY average_score_users DESC
        `,
        {
          replacements: {
            runningTryoutIds,
          },
          type: QueryTypes.SELECT,
        }
      );

      const exams: any[] = await db.sequelize.query(
        `
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
        `,
        {
          replacements: {
            runningTryoutIds,
            runningCourseIds,
          },
          type: QueryTypes.SELECT,
        }
      );

      const totalUser = users.length;
      const possibilityExam = runningCourses.length + runningTryouts.length;

      const allProgressScore =
        possibilityExam > 0
          ? parseFloat(
              ((exams.length / (totalUser * possibilityExam)) * 100).toFixed(2)
            )
          : 0;

      const validScores = exams
        .map((exam) => {
          if (typeof exam.scores === "string") {
            return parseFloat(exam.scores);
          }
          return exam.scores;
        })
        .filter(
          (score) =>
            typeof score === "number" && !isNaN(score) && isFinite(score)
        );

      const averageQuizScore =
        validScores.length > 0
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
    } catch (error: any) {
      throw new Error("failed to get progress:" + error.message);
    }
  }
}

export default new ProgressService();
