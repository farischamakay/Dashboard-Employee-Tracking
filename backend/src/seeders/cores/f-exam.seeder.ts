import { QueryInterface, Sequelize } from "sequelize";
import { v4 as uuidv4 } from "uuid";

// Fungsi untuk memilih status secara acak
function getRandomStatus(): string {
  const statuses = ["submitted", "in-progress", "completed", "cancelled"];
  const randomIndex = Math.floor(Math.random() * statuses.length);
  return statuses[randomIndex];
}

// Fungsi untuk membuat soal
function createQuestion(tryoutId: string) {
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
function createExam(
  userId: string,
  tryoutId: string,
  tryoutSectionTitle: string
) {
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
      scores: 90,
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
  async up(queryInterface: QueryInterface, sequelize: Sequelize) {
    const [users]: any[] = await queryInterface.sequelize.query(
      `SELECT userId as userId FROM users WHERE active = 1 LIMIT 5;`
    );

    const [tryoutSections]: any[] = await queryInterface.sequelize.query(`
      SELECT tryoutId as sectionId, title as sectionTitle 
      FROM tryout_sections 
      LIMIT 1
    `);

    if (!tryoutSections.length) {
      throw new Error("No tryout_sections found");
    }

    const { sectionId, sectionTitle } = tryoutSections[0];
    const exams = users.map((user: any) =>
      createExam(user.userId, sectionId, sectionTitle)
    );

    await queryInterface.bulkInsert("exams", exams, {});
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete("exams", {}, {});
  },
};
