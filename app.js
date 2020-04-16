const express = require("express");
const app = express();
const TeacherDAO = require("./daos/teacher.dao");
app.use(express.json());

app.get("/", (req, res) => {
  res.send({
    "0": "POST /register",
    "1": "GET /commonstudents",
    "2": "POST /suspend",
    "3": "POST /retrievefornotifications",
  });
});

app.post("/register", async (req, res, next) => {
  try {
    if (!req.body.teacher || !req.body.students) {
      throw new Error("Missing teacher or student input");
    }
    const students = req.body.students;
    await TeacherDAO.registerStudents(req.body.teacher, students);
    res.sendStatus(204);
  } catch (err) {
    if (err.message === "Missing teacher or student input") {
      err.statusCode = 422;
    }
    next(err);
  }
});

app.get("/commonstudents", async (req, res, next) => {
  try {
    const result = {};
    if (!req.query.teacher) {
      throw new Error("No teachers selected");
    }
    const hasMoreThanOneTeacher = Array.isArray(req.query.teacher);
    if (hasMoreThanOneTeacher) {
      const countOfTeachers = req.query.teacher.length;
      const allStudentsForAllTeachers = await TeacherDAO.findStudentsBelongingToAllTeachers(
        req.query.teacher,
        countOfTeachers
      );
      result.students = allStudentsForAllTeachers;
    } else {
      const allStudentsForATeacher = await TeacherDAO.findCommonStudents(
        req.query.teacher
      );
      result.students = allStudentsForATeacher;
    }
    res.status(200).json(result);
  } catch (err) {
    if (err.message === "No teachers selected") {
      err.statusCode = 422;
    }
    next(err);
  }
});

app.post("/suspend", async (req, res, next) => {
  try {
    if (!req.body.student) {
      throw new Error("Please enter a student");
    }
    const result = await TeacherDAO.suspendStudent(req.body.student);
    if (result instanceof Error) {
      throw result;
    }
    res.sendStatus(204);
  } catch (err) {
    if (err.message === "Please enter a student") {
      err.statusCode = 422;
    } else if (err.message === "Student Not Found") {
      err.statusCode = 404;
    }
    next(err);
  }
});

app.post("/retrievefornotifications", async (req, res, next) => {
  try {
    const result = {};
    if (!req.body.teacher) {
      throw new Error("Missing teacher input");
    }
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
    const combineNotifiedAndRegistered = mentionedStudents.concat(
      allStudentsForATeacher
    );
    const combinedAndNotSuspended = await TeacherDAO.findNotSuspendedStudents(
      combineNotifiedAndRegistered
    );
    result.recipients = combinedAndNotSuspended;
    res.status(200).json(result);
  } catch (err) {
    if (err.message === "Missing teacher input") {
      err.statusCode = 422;
    }
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500);
  console.log(err);
  if (err.statusCode) {
    res.send({ error: err.message });
  } else {
    res.send({ error: "internal server error" });
  }
});

module.exports = app;
