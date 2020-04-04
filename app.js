const express = require("express");
const app = express();
const Teacher = require("./models/teacher.model");
const Student = require("./models/student.model");

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
    const students = req.body.students;
    const [teacherObj, createdTeacher] = await Teacher.findOrCreate({
      where: { teacher: req.body.teacher },
    });
    const [studentObj, createdStudents] = await students.map((student) => {
      Student.findOrCreate({
        where: { student: student },
      });
    });

    res.sendStatus(204);
  } catch (err) {
    console.err;
  }
});

module.exports = app;
