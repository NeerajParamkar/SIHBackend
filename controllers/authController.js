import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Staff from '../models/Staff.js';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await Staff.findOne({ email });
    console.log(user)
    if (!user) return res.status(401).json({ success: false, error: 'Invalid credentials', statusCode: 401 });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ success: false, error: 'Invalid credentials', statusCode: 401 });
    const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
    return res.json({ success: true, data: { token, user: { id: user._id, name: user.name, role: user.role, email: user.email } } });
  } catch (e) { next(e); }
};


