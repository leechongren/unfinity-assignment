const Teacher = require("../models/teacher.model");

const registerTeacher = async (data) => {
  try {
    await Teacher.sync();
    await Teacher.findOrCreate({
      where: { teacher: data },
    });
  } catch (err) {
    console.err;
  }
};

module.exports = { registerTeacher };
