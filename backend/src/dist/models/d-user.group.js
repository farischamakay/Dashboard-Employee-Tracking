import { Model, DataTypes } from "sequelize";
export default (sequelize) => {
    class UserGroup extends Model {
        static associate(models) {
            UserGroup.belongsTo(models.User, { foreignKey: "userId" });
            UserGroup.belongsTo(models.Group, { foreignKey: "groupId" });
        }
    }
    UserGroup.init({
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
    }, {
        sequelize,
        modelName: "UserGroup",
        tableName: "user_groups",
    });
    return UserGroup;
};
