import express from 'express';
import { login } from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';
import { loginValidation } from '../utils/validations/authValidation.js';
const router = express.Router();
router.post('/login', loginValidation, validate, login);
export default router;


