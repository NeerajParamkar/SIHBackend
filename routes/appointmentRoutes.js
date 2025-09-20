import express from 'express';
import {bookAppointment,getPatientAppointments,getDoctorSlots} from '../controllers/appointmentController.js';
import authenticateToken from '../middleware/authenticateToken.js';

const router = express.Router();
// route to book appoinmtment
router.post('/booking', bookAppointment);
router.get('/patient', authenticateToken, getPatientAppointments);
router.get("/slots",getDoctorSlots);

export default router;
