import { v4 as uuidv4 } from "uuid";
export default {
    async up(queryInterface, sequelize) {
        // Ambil data user yang aktif
        const users = await queryInterface.sequelize.query(`SELECT userId FROM users WHERE active = 1;`);
        // Ambil data group yang aktif
        const groups = await queryInterface.sequelize.query(`SELECT groupId FROM groups WHERE active = 1;`);
        // Membuat kombinasi user dan group menggunakan flatMap untuk meratakan array
        const user_groups = users[0].flatMap((user) => {
            return groups[0].map((group) => ({
                userGroupId: uuidv4(),
                userId: user.userId,
                groupId: group.groupId,
                data: "{}",
                createdAt: new Date("2025-01-05T11:32:55Z"),
                updatedAt: new Date("2025-01-05T11:32:55Z"),
            }));
        });
        // Memasukkan data user_groups ke dalam tabel
        await queryInterface.bulkInsert("user_groups", user_groups, {});
    },
    async down(queryInterface) {
        // Menghapus semua data user_groups jika rollback
        await queryInterface.bulkDelete("user_groups", {}, {});
    },
};
