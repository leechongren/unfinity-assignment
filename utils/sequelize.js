const Sequelize = require("sequelize");
const sequelize = new Sequelize("school", "root", "Greenisgood123!", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = { Sequelize, sequelize };
