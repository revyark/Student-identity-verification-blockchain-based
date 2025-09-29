import { Router } from "express";
import { getVerifierProfile, updateVerifierProfile } from "../controllers/verifier.controller.js";

const router = Router();

router.get('/:id/profile', getVerifierProfile);
router.put('/:id/profile', updateVerifierProfile);

export default router;


