const { Sequelize, sequelize } = require("../utils/sequelize");

const Model = Sequelize.Model;
class Teacher_Student extends Model {}

Teacher_Student.init(
  {
    teacher: {
      type: Sequelize.STRING,
      unique: "compositeIndex",
    },
    student: {
      type: Sequelize.STRING,
      unique: "compositeIndex",
    },
  },
  {
    sequelize,
    modelName: "teacher_student",
  }
);

module.exports = Teacher_Student;
