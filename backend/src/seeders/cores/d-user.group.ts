import { QueryInterface, Sequelize } from "sequelize";
import { v4 as uuidv4 } from "uuid";

export default {
  async up(queryInterface: QueryInterface, sequelize: Sequelize) {
    // Ambil data user yang aktif
    const users = await queryInterface.sequelize.query(
      `SELECT userId FROM users WHERE active = 1;`
    );

    // Ambil data group yang aktif
    const groups = await queryInterface.sequelize.query(
      `SELECT groupId FROM groups WHERE active = 1;`
    );

    // Membuat kombinasi user dan group, dengan maksimal 3 group per user
    const user_groups = users[0].flatMap((user: any) => {
      // Mengacak group terlebih dahulu
      const shuffledGroups = groups[0].sort(() => 0.5 - Math.random());

      // Ambil maksimal 3 group
      const selectedGroups = shuffledGroups.slice(0, 3);

      return selectedGroups.map((group: any) => ({
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

  async down(queryInterface: QueryInterface) {
    // Menghapus semua data user_groups jika rollback
    await queryInterface.bulkDelete("user_groups", {}, {});
  },
};
