import { Sequelize } from "sequelize-typescript";
import { User } from "../models/user.model";
import { Student } from "../models/student.model";

const createSequelizeInstance = (
  connectionString: string,
  models: any[],
  name: string
): Sequelize => {
  if (!connectionString) {
    throw new Error(`Environment variable for ${name} database not found.`);
  }

  return new Sequelize(connectionString, {
    dialect: "mysql",
    models,
    logging: false,
  });
};

export const sequelizeUser = createSequelizeInstance(
  process.env.CONNECT_DG_USERS!,
  [User],
  "User"
);

export const sequelizeStudent = createSequelizeInstance(
  process.env.CONNECT_DG_STUDENTS!,
  [Student],
  "Student"
);
