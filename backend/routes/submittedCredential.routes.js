import express from "express";
import multer from "multer";
import { 
  uploadStudentDocument, 
  getCredentialsForVerifier, 
  getCredentialsForStudent 
} from "../controllers/submittedCredential.controller.js";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow common document and image formats
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only documents and images are allowed'));
    }
  }
});

// POST /api/submitted-credentials/upload
router.post("/upload", upload.single('document'), uploadStudentDocument);

// GET /api/submitted-credentials/verifier/:verifierWalletAddress
router.get("/verifier/:verifierWalletAddress", getCredentialsForVerifier);

// GET /api/submitted-credentials/student/:studentWalletAddress
router.get("/student/:studentWalletAddress", getCredentialsForStudent);

export default router;