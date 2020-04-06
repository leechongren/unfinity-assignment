const Sequelize = require("sequelize");
const sequelize = new Sequelize("<SchemaName>", "<username>", "<password>", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = { Sequelize, sequelize };
