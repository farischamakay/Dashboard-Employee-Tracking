import { Model, DataTypes, Sequelize } from "sequelize";

export default (sequelize: Sequelize) => {
  class Group extends Model {
    static associate(models: any) {
      Group.belongsTo(models.Group, { as: "Parent", foreignKey: "parentId" });

      Group.belongsToMany(models.User, {
        through: models.UserGroup,
        foreignKey: "groupId",
      });
    }
  }

  Group.init(
    {
      groupId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      parentId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "groups",
          key: "groupId",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
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
      modelName: "Group",
      tableName: "groups",
    }
  );

  return Group;
};
