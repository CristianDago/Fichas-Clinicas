import { Sequelize } from "sequelize-typescript";
import { User } from "../models/user.model";
import { Profile } from "../models/profile.model";

const createSequelizeInstance = (
  connectionString: string,
  models: any[],
  name: string,
  dialect: 'mysql' | 'postgres' // <-- ¡NUEVO PARÁMETRO: Dialecto!
): Sequelize => {
  if (!connectionString) {
    throw new Error(`Environment variable for ${name} database not found.`);
  }

  return new Sequelize(connectionString, {
    dialect: dialect, // <-- ¡USANDO EL DIALECTO PASADO COMO ARGUMENTO!
    models,
    logging: false,
  });
};

export const sequelizeUser = createSequelizeInstance(
  process.env.CONNECT_DG_USERS!,
  [User],
  "User",
  "mysql" // <-- Asumiendo que User DB es MySQL
);

// ¡CAMBIO CLAVE AQUÍ! Ahora usa 'postgres' como dialecto para la DB de Profile
export const sequelizeProfile = createSequelizeInstance(
  process.env.CONNECT_DG_PROFILE!,
  [Profile],
  "Profile",
  "postgres" // <-- ¡DEFINIDO COMO POSTGRES PARA DESARROLLO!
);