import { QueryInterface, Sequelize } from "sequelize";
import { v4 as uuidv4 } from "uuid";

export default {
  async up(queryInterface: QueryInterface, sequelize: Sequelize) {
    const groups = [
      {
        groupId: "c7ff6a0f-715b-4f5a-8f27-1b8fb2dc0d89",
        parentId: null,
        code: "PHINTRACO_GROUP",
        title: "Phintraco Group",
        data: JSON.stringify({ icon: "🏢", type: "group" }),
        tag: "phintraco_group",
        active: 1,
        createdAt: new Date("2025-05-01T11:32:55"),
        updatedAt: new Date("2025-05-01T11:32:55"),
      },
      {
        groupId: "e0cd0220-c0cd-41d4-977b-23a6d312c108",
        parentId: "c7ff6a0f-715b-4f5a-8f27-1b8fb2dc0d89",
        code: "PHINCON",
        title: "Phincon",
        data: JSON.stringify({ icon: "🏢", type: "group" }),
        tag: "phincon",
        active: 1,
        createdAt: new Date("2025-05-01T11:32:55"),
        updatedAt: new Date("2025-05-01T11:32:55"),
      },
      {
        groupId: "a0c32e11-18a7-4e33-bce7-cf46da285cd4",
        parentId: "c7ff6a0f-715b-4f5a-8f27-1b8fb2dc0d89",
        code: "PHINTECH",
        title: "Phintech",
        data: JSON.stringify({ icon: "💻", type: "group" }),
        tag: "phintech",
        active: 1,
        createdAt: new Date("2025-05-01T11:32:55"),
        updatedAt: new Date("2025-05-01T11:32:55"),
      },
      {
        groupId: "fc2e9ed3-bff2-42e0-8a0c-63fdfc83ccf5",
        parentId: "e0cd0220-c0cd-41d4-977b-23a6d312c108",
        code: "PHINCON_ACADEMY",
        title: "Phincon Academy",
        data: JSON.stringify({ icon: "🖥️", type: "group" }),
        tag: "phincon_academy",
        active: 1,
        createdAt: new Date("2025-05-01T11:32:55"),
        updatedAt: new Date("2025-05-01T11:32:55"),
      },
      {
        groupId: "d3e8b66a-79a5-49d6-b6f1-0c7cfad69a36",
        parentId: "e0cd0220-c0cd-41d4-977b-23a6d312c108",
        code: "MITRASOL",
        title: "Phincon Mitra Solusi",
        data: JSON.stringify({ icon: "📈", type: "group" }),
        tag: "mitrasol",
        active: 1,
        createdAt: new Date("2025-05-01T11:32:55"),
        updatedAt: new Date("2025-05-01T11:32:55"),
      },
      {
        groupId: "5a2cd028-07f4-4d76-bf17-944fc4aabb9e",
        parentId: "c7ff6a0f-715b-4f5a-8f27-1b8fb2dc0d89",
        code: "MITRACOMM",
        title: "Mitracomm Ekasarana",
        data: JSON.stringify({ icon: "🌐", type: "group" }),
        tag: "mitracomm",
        active: 1,
        createdAt: new Date("2025-05-01T11:32:55"),
        updatedAt: new Date("2025-05-01T11:32:55"),
      },
    ];
    await queryInterface.bulkInsert("groups", groups, {});
  },
  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete("groups", {}, {});
  },
};
