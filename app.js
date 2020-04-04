const express = require("express");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
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

app.get("/commonstudents", async (req, res) => {
  try {
    const result = {};
    const hasMoreThanOneTeacher = Array.isArray(req.query.teacher);
    const getValuesFromKeys = (arr, str) => {
      return arr.map((ele) => ele[str]);
    };
    if (hasMoreThanOneTeacher) {
      const countOfTeachers = req.query.teacher.length;
      const arrayOfStudents = await Teacher_Student.findAll({
        attributes: ["student"],
        where: [
          {
            teacher: {
              [Op.or]: req.query.teacher,
            },
          },
        ],
        group: ["student"],
        having: Sequelize.literal(`count(student) = ${countOfTeachers}`),
      });
      const listOfStudents = getValuesFromKeys(arrayOfStudents, "student");
      result.students = listOfStudents;
    } else {
      const MESSAGE_FOR_ONLY_ONE_TEACHER = `student only under teacher ${req.query.teacher}`;
      const arrayOfStudents = await Teacher_Student.findAll({
        attributes: ["student"],
        where: {
          teacher: req.query.teacher,
        },
      });
      const listOfStudents = getValuesFromKeys(arrayOfStudents, "student");
      listOfStudents.push(MESSAGE_FOR_ONLY_ONE_TEACHER);
      result.students = listOfStudents;
    }
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
  }
});

module.exports = app;
