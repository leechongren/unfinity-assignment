const express = require("express");
const app = express();
const TeacherDAO = require("./daos/teacher.dao");
const StudentDAO = require("./daos/student.dao");
const Teacher_StudentDAO = require("./daos/teacher_student.dao");
app.use(express.json());

app.get("/", (req, res) => {
  res.send({
    "0": "POST /register",
  });
});

app.post("/register", async (req, res) => {
  try {
    const students = req.body.students;
    await TeacherDAO.registerTeacher(req.body.teacher);
    await students.map((student) => {
      StudentDAO.registerStudent(student);
      Teacher_StudentDAO.registerStudentUnderTeacher(req.body.teacher, student);
    });
    res.sendStatus(204);
  } catch (err) {
    console.log(err);
  }
});

app.get("/commonstudents", async (req, res) => {
  try {
    const result = {};
    const hasMoreThanOneTeacher = Array.isArray(req.query.teacher);
    const getValuesFromKeys = (arr, str) => {
      return arr.map((ele) => ele[str]);
    };
    if (hasMoreThanOneTeacher) {
      const countOfTeachers = req.query.teacher.length;
      const allStudentsForAllTeachers = await Teacher_StudentDAO.findStudentsBelongingToAllTeachers(
        req.query.teacher,
        countOfTeachers
      );
      const listOfStudents = getValuesFromKeys(
        allStudentsForAllTeachers,
        "student"
      );
      result.students = listOfStudents;
    } else {
      const MESSAGE_FOR_ONLY_ONE_TEACHER = `student only under teacher ${req.query.teacher}`;
      const allStudentsForATeacher = await Teacher_StudentDAO.findAllStudentsBelongingToOneTeacher(
        req.query.teacher
      );
      const listOfStudents = getValuesFromKeys(
        allStudentsForATeacher,
        "student"
      );
      listOfStudents.push(MESSAGE_FOR_ONLY_ONE_TEACHER);
      result.students = listOfStudents;
    }
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
  }
});

// app.post("/suspend", async (req, res) => {
//   try {
//     await Student.sync();
//     const student = req.body.student;
//     await Student.update(
//       { suspended: true },
//       {
//         where: { student: student },
//       }
//     );
//     res.sendStatus(204);
//   } catch (err) {
//     console.log(err);
//   }
// });
module.exports = app;
