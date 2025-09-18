import { body } from 'express-validator';
export const loginValidation = [
  body('email').isEmail(),
  body('password').isString().isLength({ min: 6 }),
];


