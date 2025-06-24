import { Router, Request, Response, NextFunction } from "express";
import { patientController } from "../controllers/patient.controller";
import { verifyToken } from "../middlewares/jwt.middlewares";
import { upload } from "../middlewares/multer.middleware";
import { MulterRequest } from "../interfaces/express.interface";

const router = Router();

router.use(verifyToken);

router.get("/", patientController.getAllPatientsHandler);

router.post(
  "/",
  upload.fields([
    { name: "document1", maxCount: 1 },
    { name: "document2", maxCount: 1 },
    { name: "document3", maxCount: 1 },
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    await patientController.createPatientHandler(
      req as MulterRequest,
      res,
      next
    );
  }
);

router.get("/:id", patientController.getPatientByIdHandler);

router.put(
  "/:id",
  upload.fields([
    { name: "document1", maxCount: 1 },
    { name: "document2", maxCount: 1 },
    { name: "document3", maxCount: 1 },
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    await patientController.updatePatientHandler(
      req as MulterRequest,
      res,
      next
    );
  }
);

router.delete("/:id", patientController.deletePatientHandler);

export default router;
