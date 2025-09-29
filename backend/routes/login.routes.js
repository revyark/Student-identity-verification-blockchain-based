import {Router} from "express";
import { loginInstitute,loginStudent,loginVerifier } from "../controllers/Login.controller.js";

const router=Router();
router.post('/institute',loginInstitute);
router.post('/verifier',loginVerifier);
router.post('/student',loginStudent);
export default router;