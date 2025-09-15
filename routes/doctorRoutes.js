import express from "express";
import {
  addPatientToDoctor,
  addDoctorSchedule,
  attendEmergency,
  addDoctor,
  getDoctorDetails,
  addReportToPatient
} from "../controllers/doctorController.js";
import { getDoctorIdFromParams, getDoctorAndPatientFromParams } from "../middleware/doctorMiddleware.js";

const router = express.Router();

// Add doctor (no doctorId required)
router.post("/", addDoctor);

// Routes that require doctorId - apply middleware
router.get("/:doctorId", getDoctorIdFromParams, getDoctorDetails);
router.post("/:doctorId/patients", getDoctorIdFromParams, addPatientToDoctor);
router.post("/:doctorId/schedule", getDoctorIdFromParams, addDoctorSchedule);
router.put("/:doctorId/emergency/:emergencyId", getDoctorIdFromParams, attendEmergency);

// Routes that require both doctorId and patientId - apply combined middleware
router.post("/:doctorId/patients/:patientId/reports", getDoctorAndPatientFromParams, addReportToPatient);



export default router;
