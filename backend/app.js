import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import loginRoutes from './routes/login.routes.js';
import registerRoutes from './routes/register.routes.js';
import instituteRoutes from './routes/institute.routes.js';
import verifierRoutes from './routes/verifier.routes.js';
import submittedCredentialRoutes from './routes/submittedCredential.routes.js';
import verificationRoutes from './routes/verification.routes.js';
import blockchainRoutes from './routes.js';
import cookieParser from 'cookie-parser';
import './config/web3config.js'; // Commented out for testing without blockchain
dotenv.config();
const app = express();
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST','PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({limit: '16kb'}));
app.use(express.urlencoded({extended: true, limit: '16kb'}));
app.use(express.static('public'))
app.use(cookieParser())


app.use('/api/login', loginRoutes);
app.use('/api/register', registerRoutes);
app.use('/api/institute', instituteRoutes);
app.use('/api/verifier', verifierRoutes);
app.use('/api/submitted-credentials', submittedCredentialRoutes);
app.use('/api/verification', verificationRoutes);
app.use('/api/blockchain', blockchainRoutes);
export default app;