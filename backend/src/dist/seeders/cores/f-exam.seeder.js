import { v4 as uuidv4 } from "uuid";
// Fungsi untuk memilih status secara acak
function getRandomStatus() {
    const statuses = ["submitted", "in-progress", "completed", "cancelled"];
    const randomIndex = Math.floor(Math.random() * statuses.length);
    return statuses[randomIndex];
}
function generateScore() {
    const raw = Math.floor(Math.random() * 9) + 12; // 12–20
    return raw * 5; // 60–100, kelipatan 5
}
// Fungsi untuk membuat soal
function createQuestion(tryoutId) {
    return {
        id: uuidv4(),
        score: 0,
        answer: null,
        imageType: "asset",
        examAnswer: null,
        scrambledLabel: [
            { label: "a", examLabel: "a" },
            { label: "b", examLabel: "b" },
            { label: "c", examLabel: "c" },
            { label: "d", examLabel: "d" },
        ],
        tryoutSections: [{ tryoutId: tryoutId }],
    };
}
// Fungsi untuk membuat exam
function createExam(userId, tryoutId, tryoutSectionTitle) {
    const now = new Date();
    const endTime = new Date(now.getTime() + 36000000); // 10 jam setelah sekarang
    return {
        examId: uuidv4(),
        userId,
        tag: null,
        active: 1,
        createdAt: now,
        updatedAt: endTime,
        data: JSON.stringify({
            scores: generateScore(),
            status: getRandomStatus(), // Menetapkan status acak
            platform: "website",
            duration: 36000000,
            startTime: now.toISOString(),
            endTime: endTime.toISOString(),
            tryoutId,
            tryoutSectionTitle,
            questions: [createQuestion(tryoutId)],
        }),
    };
}
export default {
    async up(queryInterface, sequelize) {
        const [users] = await queryInterface.sequelize.query(`SELECT userId as userId FROM users WHERE active = 1 LIMIT 5;`);
        const [tryoutSections] = await queryInterface.sequelize.query(`
      SELECT tryoutId as sectionId, title as sectionTitle 
      FROM tryout_sections 
      LIMIT 10
    `);
        if (!tryoutSections.length) {
            throw new Error("No tryout_sections found");
        }
        let exams = [];
        for (const section of tryoutSections) {
            for (const user of users) {
                exams.push(createExam(user.userId, section.sectionId, section.sectionTitle));
            }
        }
        await queryInterface.bulkInsert("exams", exams, {});
    },
    async down(queryInterface) {
        await queryInterface.bulkDelete("exams", {}, {});
    },
};
