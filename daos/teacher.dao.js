const Model = require("../models/teacher_student.model");

registerStudents = async (teacher, students) => {
  try {
    const registeredTeacher = await Model.Teacher.create({
      teacher: teacher,
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

const registerTeacher = async (data) => {
  try {
    await Teacher.sync();
    return await Teacher.findOrCreate({
      where: { teacher: data },
    });
  } catch (err) {
    console.err;
  }
};

module.exports = { registerTeacher, registerStudents };
