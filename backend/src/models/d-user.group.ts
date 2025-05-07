import { Model, DataTypes, Sequelize } from "sequelize";
import { UserGroupModel } from "../types/user.group.type.js";

export default (sequelize: Sequelize) => {
  class UserGroup extends Model<UserGroupModel> {
    static associate(models: any) {
      UserGroup.belongsTo(models.User, { foreignKey: "userId" });
      UserGroup.belongsTo(models.Group, { foreignKey: "groupId" });
    }
  }

  UserGroup.init(
    {
      userGroupId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      groupId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      data: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: null,
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
      modelName: "UserGroup",
      tableName: "user_groups",
    }
  );

  return UserGroup;
};
