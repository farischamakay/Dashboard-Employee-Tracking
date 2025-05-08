import { QueryInterface, Sequelize } from "sequelize";
import { v4 as uuidv4 } from "uuid";

export default {
  async up(queryInterface: QueryInterface, sequelize: Sequelize) {
    let users = [
      {
        userId: uuidv4(),
        fullname: "Sigit Sasongko",
        username: "FastTiger-N4c3W",
        email: "sigit.center31@gmail.com",
        phoneNumber: "+6286403152165",
        password:
          "$2b$10$ULAkbSgwEoNKhCdwyymq3O8ui6MGp0a7eGhWrwuWKLaBd2nbkcsU.",
        active: 1,
        data: "{}",
        createdAt: "4/5/2025 15:20:10",
        updatedAt: "4/5/2025 15:47:38",
      },
      {
        userId: uuidv4(),
        fullname: "Sigit",
        username: "FastT",
        email: "sigit.r31@gmail.com",
        phoneNumber: "+6282103152165",
        password:
          "$2b$10$ULAkbSgwEoNKhCdwyymq3O8ui6MGp0a7eGhWrwuWKLaBd2nbkcsU.",
        active: 1,
        data: "{}",
        createdAt: "4/5/2025 15:20:10",
        updatedAt: "4/5/2025 15:47:38",
      },
      {
        userId: uuidv4(),
        fullname: "Sigit123",
        username: "FastTraaaa",
        email: "sigit123.r31@gmail.com",
        phoneNumber: "+6282103321165",
        password:
          "$2b$10$ULAkbSgwEoNKhCdwyymq3O8ui6MGp0a7eGhWrwuWKLaBd2nbkcsU.",
        active: 1,
        data: "{}",
        createdAt: "4/5/2025 15:20:10",
        updatedAt: "4/5/2025 15:47:38",
      },
      {
        userId: uuidv4(),
        fullname: "Sasongko",
        username: "FastTraaaaSasongko",
        email: "sasongko.r31@gmail.com",
        phoneNumber: "+6282103225165",
        password:
          "$2b$10$ULAkbSgwEoNKhCdwyymq3O8ui6MGp0a7eGhWrwuWKLaBd2nbkcsU.",
        active: 1,
        data: "{}",
        createdAt: "4/5/2025 15:20:10",
        updatedAt: "4/5/2025 15:47:38",
      },
      {
        userId: uuidv4(),
        fullname: "Farischa",
        username: "Farrr",
        email: "farischa.center31@gmail.com",
        phoneNumber: "+6286403952125",
        password:
          "$2b$10$ULAkbSgwEoNKhCdwyymq3O8ui6MGp0a7eGhWrwuWKLaBd2nbkcsU.",
        active: 1,
        data: "{}",
        createdAt: "4/5/2025 15:20:10",
        updatedAt: "4/5/2025 15:47:38",
      },
      {
        userId: uuidv4(),
        fullname: "Bobby",
        username: "Bobbb",
        email: "bobby.center31@gmail.com",
        phoneNumber: "+6286903152125",
        password:
          "$2b$10$ULAkbSgwEoNKhCdwyymq3O8ui6MGp0a7eGhWrwuWKLaBd2nbkcsU.",
        active: 1,
        data: "{}",
        createdAt: "4/5/2025 15:20:10",
        updatedAt: "4/5/2025 15:47:38",
      },

      {
        userId: uuidv4(),
        fullname: "Fandy",
        username: "Fandd",
        email: "fandy.center31@gmail.com",
        phoneNumber: "+6289403152125",
        password:
          "$2b$10$ULAkbSgwEoNKhCdwyymq3O8ui6MGp0a7eGhWrwuWKLaBd2nbkcsU.",
        active: 1,
        data: "{}",
        createdAt: "4/5/2025 15:20:10",
        updatedAt: "4/5/2025 15:47:38",
      },

      {
        userId: uuidv4(),
        fullname: "Makay",
        username: "Makayyy",
        email: "Makay.center31@gmail.com",
        phoneNumber: "+6283403152125",
        password:
          "$2b$10$ULAkbSgwEoNKhCdwyymq3O8ui6MGp0a7eGhWrwuWKLaBd2nbkcsU.",
        active: 1,
        data: "{}",
        createdAt: "4/5/2025 15:20:10",
        updatedAt: "4/5/2025 15:47:38",
      },

      {
        userId: uuidv4(),
        fullname: "Dharma",
        username: "Dharmaa",
        email: "Dharmaa.center31@gmail.com",
        phoneNumber: "+6286403152125",
        password:
          "$2b$10$ULAkbSgwEoNKhCdwyymq3O8ui6MGp0a7eGhWrwuWKLaBd2nbkcsU.",
        active: 1,
        data: "{}",
        createdAt: "4/5/2025 15:20:10",
        updatedAt: "4/5/2025 15:47:38",
      },
    ];

    await queryInterface.bulkInsert("users", users, {});
  },
  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete("users", {}, {});
  },
};
