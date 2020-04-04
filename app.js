const express = require("express");
const app = express();
const Teacher = require("./models/teacher.model");

app.use(express.json());

app.get("/", (req, res) => {
  res.send({
    "0": "POST /register",
  });
});

app.post("/register", async (req, res) => {
  try {
    await Teacher.sync();
    const [teacher, created] = await Teacher.findOrCreate({
      where: { teacher: req.body.teacher },
    });
    res.sendStatus(204);
  } catch (err) {
    console.err;
  }
});

module.exports = app;
