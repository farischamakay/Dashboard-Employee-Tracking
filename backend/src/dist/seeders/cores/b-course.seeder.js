import { v4 as uuidv4 } from "uuid";
export default {
    async up(queryInterface, sequelize) {
        const courses = [
            {
                courseId: uuidv4(),
                code: "ISMS-S01_API_SECURITY",
                title: "API Security",
                description: "ini adalah course API Security",
                order: 1,
                data: JSON.stringify({
                    icon: " ",
                    type: "LMS",
                    telegram: { shortId: 1 },
                    startAt: "2025-05-01",
                    endDate: "2025-10-01",
                }),
                tag: "phincon",
                active: 1,
                createdAt: new Date("1/5/2025 11:32:55"),
                updatedAt: new Date("1/5/2025 11:32:55"),
            },
            {
                courseId: uuidv4(),
                code: "ISMS-S02_CLOUD_COMPUTING",
                title: "Cloud Computing",
                description: "ini adalah course Cloud Computing",
                order: 2,
                data: JSON.stringify({
                    icon: " ",
                    type: "LMS",
                    telegram: { shortId: 2 },
                    startDate: "2025-05-01",
                    endDate: "2025-05-01",
                }),
                tag: "phincon",
                active: 1,
                createdAt: new Date("1/5/2025 11:32:55"),
                updatedAt: new Date("1/5/2025 11:32:55"),
            },
            {
                courseId: uuidv4(),
                code: "ISMS-S03_DATA_ENCRYPTION",
                title: "Data Encryption",
                description: "ini adalah course Data Encryption",
                order: 3,
                data: JSON.stringify({
                    icon: " ",
                    type: "LMS",
                    telegram: { shortId: 3 },
                    startDate: "2025-05-01",
                    endDate: "2025-10-01",
                }),
                tag: "phincon",
                active: 1,
                createdAt: new Date("1/5/2025 11:32:55"),
                updatedAt: new Date("1/5/2025 11:32:55"),
            },
            {
                courseId: uuidv4(),
                code: "ISMS-S04_DATA_ENCRYPTION",
                title: "Data Science",
                description: "ini adalah course Data Science",
                order: 3,
                data: JSON.stringify({
                    icon: " ",
                    type: "LMS",
                    telegram: { shortId: 3 },
                    startDate: "2025-05-01",
                    endDate: "2025-10-01",
                }),
                tag: "phincon",
                active: 1,
                createdAt: new Date("1/5/2025 11:32:55"),
                updatedAt: new Date("1/5/2025 11:32:55"),
            },
        ];
        await queryInterface.bulkInsert("courses", courses, {});
    },
    async down(queryInterface) {
        await queryInterface.bulkDelete("courses", {}, {});
    },
};
