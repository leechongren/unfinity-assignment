const { Sequelize, sequelize } = require("../utils/sequelize");

const Model = Sequelize.Model;
class Student extends Model {}

Student.init(
  {
    student: {
      type: Sequelize.STRING,
      unique: true,
    },
    suspended: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "student",
  }
);

module.exports = Student;
