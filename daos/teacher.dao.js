const Model = require("../models/teacher_student.model");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const registerStudents = async (teacher, students) => {
  try {
    const [registeredTeacher, created] = await Model.Teacher.findOrCreate({
      where: { teacher: teacher },
    });
    for (let i = 0; i < students.length; i++) {
      const [registeredStudent, created] = await Model.Student.findOrCreate({
        where: { student: students[i] },
      });
      await registeredStudent.addTeacher(registeredTeacher);
    }
  } catch (err) {
    console.err;
  }
};

const findCommonStudents = async (teacher) => {
  try {
    const results = await Model.Teacher.findOne({
      attributes: ["teacher"],
      where: {
        teacher: teacher,
      },
      include: {
        model: Model.Student,
        attributes: ["student"],
        through: { attributes: [] },
      },
    });
    return results.get({ plain: true }).students;
  } catch (err) {
    console.err;
  }
};

const findStudentsBelongingToAllTeachers = async (
  teachers,
  countOfTeachers
) => {
  try {
    const allStudents = await Model.Teacher.findAll({
      where: [
        {
          teacher: {
            [Op.or]: teachers,
          },
        },
      ],
      include: {
        attributes: ["student"],
        model: Model.Student,
        through: { attributes: [] },
      },
      group: ["student"],
      having: Sequelize.literal(`count(student) = ${countOfTeachers}`),
    });
    const plainResult = allStudents.map((student) => {
      return student.get({ plain: true }).students;
    });
    return plainResult.flat();
  } catch (err) {
    console.err;
  }
};

const suspendStudent = async (student) => {
  try {
    const found = await Model.Student.findOne({ where: { student: student } });
    if (!found) {
      throw new Error("Student Not Found");
    } else {
      await Model.Student.update(
        { suspended: true },
        {
          where: { student: student },
        }
      );
    }
  } catch (err) {
    return err;
  }
};

const findNotSuspendedStudents = async (students) => {
  try {
    return await Model.Student.findAll({
      attributes: ["student"],
      raw: true,
      where: {
        suspended: false,
        [Op.or]: { student: students },
      },
    });
  } catch (err) {
    console.err;
  }
};

module.exports = {
  findCommonStudents,
  registerStudents,
  findStudentsBelongingToAllTeachers,
  suspendStudent,
  findNotSuspendedStudents,
};
