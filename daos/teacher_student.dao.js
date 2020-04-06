const Teacher_Student = require("../models/teacher_student.model");

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

module.exports = { registerStudentUnderTeacher };
