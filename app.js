const express = require("express");
const app = express();
const TeacherDAO = require("./daos/teacher.dao");
const StudentDAO = require("./daos/student.dao");
const Teacher_StudentDAO = require("./daos/teacher_student.dao");
app.use(express.json());

const getValuesFromKeys = (arr, str) => {
  return arr.map((ele) => ele[str]);
};

app.get("/", (req, res) => {
  res.send({
    "0": "POST /register",
    "1": "GET /commonstudents",
    "2": "POST /suspend",
    "3": "POST /retrievefornotifications",
  });
});

app.post("/register", async (req, res) => {
  try {
    const students = req.body.students;
    await TeacherDAO.registerTeacher(req.body.teacher);
    for (let i = 0; i < students.length; i++) {
      await StudentDAO.registerStudent(students[i]);
      await Teacher_StudentDAO.registerStudentUnderTeacher(
        req.body.teacher,
        students[i]
      );
    }
    res.sendStatus(204);
  } catch (err) {
    console.log(err);
  }
});

app.get("/commonstudents", async (req, res) => {
  try {
    const result = {};
    const hasMoreThanOneTeacher = Array.isArray(req.query.teacher);
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

app.post("/suspend", async (req, res) => {
  try {
    const student = await StudentDAO.findStudent(req.body.student);
    if (student === null) {
      throw new Error("Student Not Found");
    } else {
      await StudentDAO.suspendStudent(req.body.student);
    }
    res.sendStatus(204);
  } catch (err) {
    if (err.message === "Student Not Found") {
      res.status(404).send({
        error:
          "Student does not exist in database, please ensure that student is registered",
      });
    }
  }
});

app.post("/retrievefornotifications", async (req, res) => {
  try {
    const result = {};
    const notifications = req.body.notification;
    const getMentionedStudents = notifications
      .split(" ")
      .filter((word) => {
        return word.indexOf("@") === 0;
      })
      .map((student) => {
        return student.substring(1);
      });
    const allStudentsForATeacher = await Teacher_StudentDAO.findAllStudentsBelongingToOneTeacher(
      req.body.teacher
    );
    const listOfStudentsForTeacher = getValuesFromKeys(
      allStudentsForATeacher,
      "student"
    );
    const combineNotifiedAndRegistered = getMentionedStudents.concat(
      listOfStudentsForTeacher
    );
    const combinedAndNotSuspended = await StudentDAO.findFromListOfStudentsNotSuspended(
      combineNotifiedAndRegistered
    );

    const getValuesFromCombinedAndNotSuspended = getValuesFromKeys(
      combinedAndNotSuspended,
      "student"
    );
    result.recipients = getValuesFromCombinedAndNotSuspended;
    res.status(200).json(result);
  } catch (err) {
    console.err;
  }
});
module.exports = app;
