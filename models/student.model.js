const { Sequelize, sequelize } = require("../utils/sequelize");
const Teacher = require("./teacher.model");

const Student = sequelize.define("student", {
  student: {
    type: Sequelize.STRING,
    unique: true,
  },
  suspended: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
});

Student.associate = (models) => {
  Student.belongsToMany(models.Teacher, { through: "TeacherStudent" });
};

module.exports = Student;
