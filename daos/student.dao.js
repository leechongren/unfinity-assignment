const Student = require("../models/student.model");

const findStudent = async (student) => {
  try {
    await Student.sync();
    return await Student.findOne({ where: { student: student } });
  } catch (err) {
    console.err;
  }
};

const registerStudent = async (student) => {
  try {
    await Student.sync();
    await Student.findOrCreate({
      where: { student: student },
    });
  } catch (err) {
    console.err;
  }
};

const suspendStudent = async (student) => {
  try {
    await Student.sync();
    await Student.update(
      { suspended: true },
      {
        where: { student: student },
      }
    );
  } catch (err) {
    console.err;
  }
};

module.exports = { findStudent, registerStudent, suspendStudent };
