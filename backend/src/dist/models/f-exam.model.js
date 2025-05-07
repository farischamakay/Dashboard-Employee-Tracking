import { Model, DataTypes } from "sequelize";
export default (sequelize) => {
    class Exam extends Model {
        static associate(models) {
            Exam.belongsTo(models.User, {
                foreignKey: "userId",
                onDelete: "CASCADE",
            });
        }
    }
    Exam.init({
        examId: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
        },
        userId: {
            type: DataTypes.UUID,
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
    }, {
        sequelize,
        modelName: "Exam",
        tableName: "exams",
    });
    return Exam;
};
