import express from 'express';
import { getDoctors } from '../controllers/doctorController.js';
import authenticateToken from '../middleware/authenticateToken.js';

const router = express.Router();

router.get('/', authenticateToken, getDoctors);

export default router;
