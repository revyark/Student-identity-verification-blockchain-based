import {Router} from "express";
import {registerInstitute, registerStudent, registerVerifier} from "../controllers/Registering.controller.js";

const router=Router();
router.post('/institute',registerInstitute);
router.post('/verifier',registerVerifier);
router.post('/student',registerStudent);

export default router;