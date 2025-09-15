import Doctor from "../models/doctor.js";
import Patient from "../models/patient.js";
import Emergency from "../models/Emergency.js";
import Report from "../models/Report.js";
/**
 * 📌 Add a new Doctor
 * Route: POST /api/doctors
 */
const addDoctor = async (req, res) => {
  try {
    const { name, mobile, specialization, availability, status } = req.body;

    // Check if doctor already exists with mobile number
    const existingDoctor = await Doctor.findOne({ mobile });
    if (existingDoctor) {
      return res.status(400).json({ 
        success: false,
        message: "Doctor with this mobile already exists" 
      });
    }

    // Create new doctor
    const doctor = new Doctor({
      name,
      mobile,
      specialization,
      availability,
      status,
    });

    await doctor.save();

    res.status(201).json({
      success: true,
      message: "Doctor added successfully",
      doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding doctor",
      error: error.message,
    });
  }
};

/**
 * Add Report to Specific Patient under Doctor
 * Uses middleware that validates both doctorId and patientId
 */
const addReportToPatient = async (req, res) => {
  try {
    const { doctorId, patientId } = req.params;
    const { title, content } = req.body;

    const patient = await Patient.findById(patientId);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // Build file URLs array
    const files = req.files ? req.files.map(file => `http://localhost:5000/uploads/${file.filename}`) : [];

    const report = new Report({
      title,
      content,
      doctor: doctorId,
      patient: patientId,
      uploadedBy: doctorId,
      files,
    });

    await report.save();

    // Link report to patient
    patient.reports.push(report._id);
    await patient.save();

    res.status(201).json({ message: "Report added successfully", report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ... existing code ...

const getDoctorDetails = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.doctorId)
      .populate({
        path: "patients",
        populate: {
          path: "reports",
          model: "Report",
          select: "title content files uploadedBy createdAt updatedAt"
        }
      });

    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    res.json({ doctor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addPatientToDoctor = async (req, res) => {
  try {
    // Doctor already validated by middleware
    const doctor = req.doctor;
    const doctorId = req.doctorId;
    const { name, age, gender, contact, history } = req.body;

    const patient = new Patient({
      name,
      age,
      gender,
      contact,
      history,
      doctor: doctorId,
    });
    await patient.save();

    doctor.patients.push(patient._id);
    await doctor.save();

    res.status(201).json({ 
      success: true,
      message: "Patient added successfully", 
      patient 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

const addDoctorSchedule = async (req, res) => {
  try {
    // Doctor already validated by middleware
    const doctor = req.doctor;
    const { date, slots } = req.body; // slots = [{ time: "09:00" }, { time: "10:00" }]

    // Check if schedule already exists for that date
    let calendarDay = doctor.calendar.find(
      (day) => day.date.toISOString().split("T")[0] === new Date(date).toISOString().split("T")[0]
    );

    if (calendarDay) {
      // Add slots to existing day
      calendarDay.slots.push(...slots.map((s) => ({ ...s, status: "free" })));
    } else {
      // Create new day schedule
      doctor.calendar.push({
        date,
        slots: slots.map((s) => ({ ...s, status: "free" })),
      });
    }

    await doctor.save();

    res.status(201).json({
      success: true,
      message: "Schedule added successfully",
      doctor,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};


const attendEmergency = async (req, res) => {
  try {
    // Doctor already validated by middleware
    const doctor = req.doctor;
    const { emergencyId } = req.params;

    const emergency = await Emergency.findById(emergencyId);
    if (!emergency) {
      return res.status(404).json({ 
        success: false,
        message: "Emergency not found" 
      });
    }

    // Mark emergency as resolved
    emergency.status = "resolved";
    await emergency.save();

    // Ensure emergency is tracked under doctor
    if (!doctor.emergencies.includes(emergency._id)) {
      doctor.emergencies.push(emergency._id);
      await doctor.save();
    }

    res.status(200).json({
      success: true,
      message: "Emergency attended successfully",
      emergency,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

export {
  addDoctor,
  getDoctorDetails,
  addPatientToDoctor,
  addDoctorSchedule,
  attendEmergency,
  addReportToPatient 
};
