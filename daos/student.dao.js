const Student = require("../models/student.model");

const registerStudent = async (data) => {
  try {
    await Student.sync();
    await Student.findOrCreate({
      where: { student: data },
    });
  } catch (err) {
    console.err;
  }
};

module.exports = { registerStudent };
