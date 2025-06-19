import { Router, Request, Response, NextFunction } from "express";
import { studentController } from "../controllers/student.controller";
import { verifyToken } from "../middlewares/jwt.middlewares";
import { upload } from "../middlewares/multer.middleware";
import { MulterRequest } from "../interfaces/express.interface";

const router = Router();

router.use(verifyToken);

router.get("/", studentController.getAllStudentsHandler);

router.post(
  "/",
  upload.fields([
    { name: "studentImage", maxCount: 1 },
    { name: "birthCertificate", maxCount: 1 },
    { name: "studyCertificate", maxCount: 1 },
    { name: "linkDni", maxCount: 1 },
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    await studentController.createStudentHandler(
      req as MulterRequest,
      res,
      next
    );
  }
);

router.get("/:id", studentController.getStudentByIdHandler);

router.put(
  "/:id",
  upload.fields([
    { name: "studentImage", maxCount: 1 },
    { name: "birthCertificate", maxCount: 1 },
    { name: "studyCertificate", maxCount: 1 },
    { name: "linkDni", maxCount: 1 },
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    await studentController.updateStudentHandler(
      req as MulterRequest,
      res,
      next
    );
  }
);

router.delete("/:id", studentController.deleteStudentHandler);

export default router;
