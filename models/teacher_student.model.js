const { Sequelize, sequelize } = require("../utils/sequelize");

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

const Teacher = sequelize.define("teacher", {
  teacher: {
    type: Sequelize.STRING,
    unique: true,
  },
});

Student.belongsToMany(Teacher, { through: "TeacherStudent" });
Teacher.belongsToMany(Student, { through: "TeacherStudent" });

sequelize.sync();

module.exports = { Student, Teacher };
