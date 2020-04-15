const express = require("express");
const app = express();
const TeacherDAO = require("./daos/teacher.dao");
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
    await TeacherDAO.registerStudents(req.body.teacher, students);
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
      const allStudentsForAllTeachers = await TeacherDAO.findStudentsBelongingToAllTeachers(
        req.query.teacher,
        countOfTeachers
      );
      const listOfStudents = getValuesFromKeys(
        allStudentsForAllTeachers,
        "student"
      );
      result.students = listOfStudents;
    } else {
      const allStudentsForATeacher = await TeacherDAO.findCommonStudents(
        req.query.teacher
      );
      const listOfStudents = getValuesFromKeys(
        allStudentsForATeacher,
        "student"
      );
      result.students = listOfStudents;
    }
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
  }
});

app.post("/suspend", async (req, res) => {
  try {
    const result = await TeacherDAO.suspendStudent(req.body.student);
    if (result instanceof Error) {
      throw result;
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
    const mentionedStudents = req.body.notification
      .split(" ")
      .filter((word) => {
        return word.indexOf("@") === 0;
      })
      .map((student) => {
        return student.substring(1);
      });
    const allStudentsForATeacher = await TeacherDAO.findCommonStudents(
      req.body.teacher
    );
    const listOfStudentsForTeacher = getValuesFromKeys(
      allStudentsForATeacher,
      "student"
    );
    const combineNotifiedAndRegistered = mentionedStudents.concat(
      listOfStudentsForTeacher
    );
    const combinedAndNotSuspended = await TeacherDAO.findNotSuspendedStudents(
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
