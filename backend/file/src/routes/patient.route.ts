import { Router, Request, Response, NextFunction } from "express";
import { patientController } from "../controllers/patient.controller"; // Importa el controlador renombrado
import { verifyToken } from "../middlewares/jwt.middlewares"; // Asegúrate de que esta ruta sea correcta
import { upload } from "../middlewares/multer.middleware"; // Asegúrate de que esta ruta sea correcta
import { MulterRequest } from "../interfaces/express.interface"; // Asegúrate de que esta ruta sea correcta

const router = Router();

router.use(verifyToken);

router.get("/", patientController.getAllPatientsHandler); // Renombrado

router.post(
  "/",
  // Adaptar 'upload.fields' para los nuevos nombres de documentos
  upload.fields([
    { name: "document1", maxCount: 1 },
    { name: "document2", maxCount: 1 },
    { name: "document3", maxCount: 1 },
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    await patientController.createPatientHandler( // Renombrado
      req as MulterRequest,
      res,
      next
    );
  }
);

router.get("/:id", patientController.getPatientByIdHandler); // Renombrado

router.put(
  "/:id",
  // Adaptar 'upload.fields' para los nuevos nombres de documentos
  upload.fields([
    { name: "document1", maxCount: 1 },
    { name: "document2", maxCount: 1 },
    { name: "document3", maxCount: 1 },
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    await patientController.updatePatientHandler( // Renombrado
      req as MulterRequest,
      res,
      next
    );
  }
);

router.delete("/:id", patientController.deletePatientHandler); // Renombrado

export default router;