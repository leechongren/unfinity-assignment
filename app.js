const express = require("express");
const app = express();
const Teacher = require("./models/teacher.model");
const Student = require("./models/student.model");
const Teacher_Student = require("./models/teacher_student.model");
app.use(express.json());

app.get("/", (req, res) => {
  res.send({
    "0": "POST /register",
  });
});

app.post("/register", async (req, res) => {
  try {
    await Teacher.sync();
    await Student.sync();
    await Teacher_Student.sync();
    const students = req.body.students;
    await Teacher.findOrCreate({
      where: { teacher: req.body.teacher },
    });
    await students.map((student) => {
      Student.findOrCreate({
        where: { student: student },
      });
      Teacher_Student.findOrCreate({
        where: { teacher: req.body.teacher, student: student },
      });
    });
    res.sendStatus(204);
  } catch (err) {
    console.log(err);
  }
});

module.exports = app;
