const Student = require("../models/student.model");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

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
    return await Student.findOrCreate({
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

const findFromListOfStudentsNotSuspended = async (students) => {
  try {
    await Student.sync();
    return await Student.findAll({
      attributes: ["student"],
      raw: true,
      where: {
        suspended: false,
        [Op.or]: { student: students },
      },
    });
  } catch (err) {
    console.err;
  }
};

module.exports = {
  findStudent,
  registerStudent,
  suspendStudent,
  findFromListOfStudentsNotSuspended,
};
