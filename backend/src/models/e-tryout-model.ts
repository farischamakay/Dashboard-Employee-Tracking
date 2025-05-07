import { Model, DataTypes, Sequelize } from "sequelize";
import { TryoutSectionModel } from "../types/tryout.section.js";

export default (sequelize: Sequelize) => {
  class TryoutSection extends Model<TryoutSectionModel> {
    static associate(models: any) {}
  }

  TryoutSection.init(
    {
      tryoutId: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      order: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      data: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: null,
      },
      tag: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      active: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "TryoutSection",
      tableName: "tryout_sections",
    }
  );

  return TryoutSection;
};
