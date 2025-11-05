import { Sequelize } from "@sequelize/core";
import { MySqlDialect } from "@sequelize/mysql";

const { DB_HOST, DB_NAME, DB_PASS, DB_USER } = process.env;

const sequelize = new Sequelize({
  dialect: MySqlDialect,
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  logging: false,
  port: 3306,
});

try {
  await sequelize.authenticate();
  console.log("Connected to DB");
} catch (error) {
  console.log("Can not connect to the database");
  process.exit();
}

export default sequelize;
