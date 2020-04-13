const { Sequelize, sequelize } = require("../utils/sequelize");
const Student = require("./student.model");

const Teacher = sequelize.define("teacher", {
  teacher: {
    type: Sequelize.STRING,
    unique: true,
  },
});

Teacher.associate = (models) => {
  Teacher.belongsToMany(models.Student, { through: "TeacherStudent" });
};

module.exports = Teacher;
