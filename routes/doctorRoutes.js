import express from "express";
import {
  addPatientToDoctor,
  addDoctorSchedule,
  attendEmergency,
  addDoctor,
  getDoctorDetails,
  addReportToPatient,
  upsertCalendarSlot,
  addEmergency,
  getDoctorEmergencies,
  updateEmergency,
  acknowledgeEmergency,
  createRoom,
  addPatient,
  getPatients,
  uploadReport
} from "../controllers/doctorController.js";
import { getDoctorIdFromParams, getDoctorAndPatientFromParams } from "../middleware/doctorMiddleware.js";
// import { createRoom } from "../controllers/roomController.js";

const router = express.Router();

// Add doctor (no doctorId required)
router.post("/", addDoctor);

// Routes that require doctorId - apply middleware
router.get("/:doctorId", getDoctorIdFromParams, getDoctorDetails);
router.post("/:doctorId/patients", getDoctorIdFromParams, addPatientToDoctor);
router.post("/:doctorId/schedule", getDoctorIdFromParams, addDoctorSchedule);
router.put("/:doctorId/emergency/:emergencyId", getDoctorIdFromParams, attendEmergency);

router.post("/:doctorId/patients/:patientId/reports", getDoctorAndPatientFromParams, addReportToPatient);

router.post("/:doctorId/calendar", upsertCalendarSlot);

router.post("/:doctorId/emergencies", addEmergency);

router.get("/:doctorId/emergencies", getDoctorEmergencies);

router.put("/emergencies/:emergencyId", updateEmergency); //doctors note

router.patch("/emergencies/:emergencyId/acknowledge", acknowledgeEmergency); 

router.post("/create-room", createRoom);

router.post("/add-patient", addPatient);

// Get all patients of a doctor
router.get("/patients/:doctorId", getPatients);

// Upload a report
router.post("/upload-report", uploadReport);
export default router;
