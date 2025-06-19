import "reflect-metadata";
import "dotenv/config";
import app from "./app";
import { sequelizeStudent, sequelizeUser } from "./config/sequelize";
import { createServer } from "http";

const port = process.env.PORT || 3000;

const server = createServer(app);

const main = async () => {
  const runDbSync = process.env.DB_SYNC_ON_STARTUP === "true";

  if (runDbSync) {
    console.log(
      "LOG: DB_SYNC_ON_STARTUP está en 'true'. Intentando sincronizar bases de datos..."
    );
    try {
      await sequelizeUser.authenticate();
      await sequelizeUser.sync();
      console.log("Base de datos userdb conectada y sincronizada.");
    } catch (error) {
      console.error("Error conectando a userdb:", error);
      process.exit(1);
    }

    try {
      await sequelizeStudent.authenticate();
      await sequelizeStudent.sync();
      console.log("Base de datos profiledb conectada y sincronizada.");
    } catch (error) {
      console.error("Error conectando a profiledb:", error);
      process.exit(1);
    }
  } else {
    console.log(
      "LOG: DB_SYNC_ON_STARTUP NO está en 'true'. Solo autenticando bases de datos..."
    );
    try {
      await sequelizeUser.authenticate();
      console.log("Base de datos userdb conectada.");
    } catch (error) {
      console.error("Error conectando a userdb:", error);
      process.exit(1);
    }

    try {
      await sequelizeStudent.authenticate();
      console.log("Base de datos profiledb conectada.");
    } catch (error) {
      console.error("Error conectando a profiledb:", error);
      process.exit(1);
    }
  }

  server.listen(port, () => {
    console.log(`Servidor encendido en puerto ${port}`);
  });

  const gracefulShutdown = async (signal: string) => {
    console.log(`${signal} recibida. Iniciando apagado...`);

    try {
      await new Promise<void>((resolve, reject) => {
        server.close((err) => {
          if (err) {
            console.error("Error cerrando el servidor HTTP:", err);
            return reject(err);
          }
          console.log("Servidor HTTP cerrado.");
          resolve();
        });
      });

      await sequelizeUser.close();
      console.log("Conexión a userdb cerrada.");
      await sequelizeStudent.close();
      console.log("Conexión a profiledb cerrada.");

      process.exit(0);
    } catch (error) {
      console.error("Error durante el apagado elegante:", error);
      process.exit(1);
    }
  };
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
};

main();
