import { Router } from "express";
import { getInstituteProfile, updateInstituteProfile, getInstituteStats } from "../controllers/institute.controller.js";
import { issueCredential, revokeCredential, uploadCredentialFile, listStudentCredentials } from "../controllers/Credentials.controller.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join('uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const upload = multer({ dest: uploadDir });

const router = Router();

router.get('/:id/profile', getInstituteProfile);
router.put('/:id/profile', updateInstituteProfile);
router.get('/:id/stats', getInstituteStats);

// Credentials
router.post('/:id/credentials/issue', issueCredential);
router.patch('/:id/credentials/:credentialHash/revoke', revokeCredential);
router.post('/:id/credentials/upload', upload.single('file'), uploadCredentialFile);
router.get('/:id/credentials/student/:studentId', listStudentCredentials);

export default router;
