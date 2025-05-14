import db from "../models/index.js";
class RunningProgressService {
    async getRunningCourses() {
        try {
            const [runningCourses] = await db.sequelize.query(`
        SELECT courseId, title, data
        FROM courses
        WHERE JSON_UNQUOTE(JSON_EXTRACT(data, '$.startDate')) <= CURDATE()
          AND JSON_UNQUOTE(JSON_EXTRACT(data, '$.endDate')) >= CURDATE()
          AND ACTIVE = 1
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
        AND ACTIVE = 1
    `);
            return runningTryouts;
        }
        catch (error) {
            throw new Error("failed to get progress:" + error.message);
        }
    }
}
export default new RunningProgressService();
