const Teacher_Student = require("../models/teacher_student.model");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const registerStudentUnderTeacher = async (teacher, student) => {
  try {
    await Teacher_Student.sync();
    await Teacher_Student.findOrCreate({
      where: { teacher: teacher, student: student },
    });
  } catch (err) {
    console.err;
  }
};

const findStudentsBelongingToAllTeachers = async (
  teachers,
  countOfTeachers
) => {
  try {
    return await Teacher_Student.findAll({
      attributes: ["student"],
      where: [
        {
          teacher: {
            [Op.or]: teachers,
          },
        },
      ],
      group: ["student"],
      having: Sequelize.literal(`count(student) = ${countOfTeachers}`),
    });
  } catch (err) {
    console.err;
  }
};

const findAllStudentsBelongingToOneTeacher = async (teacher) => {
  try {
    return await Teacher_Student.findAll({
      attributes: ["student"],
      where: {
        teacher: teacher,
      },
    });
  } catch (err) {
    console.err;
  }
};

module.exports = {
  registerStudentUnderTeacher,
  findStudentsBelongingToAllTeachers,
  findAllStudentsBelongingToOneTeacher,
};
