const { Sequelize, sequelize } = require("../utils/sequelize");

const Model = Sequelize.Model;
class Teacher extends Model {}

Teacher.init(
  {
    teacher: {
      type: Sequelize.STRING,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "teacher",
  }
);

module.exports = Teacher;
