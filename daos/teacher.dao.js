const Model = require("../models/teacher_student.model");

registerStudents = async (teacher, students) => {
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

module.exports = { findCommonStudents, registerStudents };
