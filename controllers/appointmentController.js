import Appointment from "../models/Appointment.js";
import axios from "axios";

const HOSPITAL_BACKEND_URL = 'http://hospital-backend-url'; // Update accordingly

export const bookAppointment = async (req, res) => {
  try {
    const {
      patientId,
      doctorId,
      date,
      time,
      reason,
      appointmentType,
      bookingMode,
    } = req.body;

    if (!patientId) return res.status(400).json({ message: "PatientId is missing" });
    if (!date) return res.status(400).json({ message: "Please Provide the Date" });

    const idempotencyKey = req.headers['idempotency-key']; // Read idempotency key from headers

    if (!idempotencyKey) {
      return res.status(400).json({ message: "Idempotency key required" });
    }

    // Check if booking with this idempotency key already exists
    const existingAppointment = await Appointment.findOne({ idempotencyKey });

    if (existingAppointment) {
      // Return existing appointment to avoid duplicate booking
      return res.status(200).json({ message: 'Duplicate idempotent booking', appointment: existingAppointment });
    }

    const bookingPayload = {
      patientId,
      doctorId,
      date,
      reason,
      appointmentType,
      ...(time?.trim() && { time }),
    };

    if (bookingMode === "Online") {
      try {
        // Call hospital backend API
        const hospitalResponse = await axios.post(
          `${HOSPITAL_BACKEND_URL}/api/appointments`,
          bookingPayload
        );

        const assignedTime = hospitalResponse.data.assignedTime || bookingPayload.time || null;

        const appointment = new Appointment({
          patient: patientId,
          doctorId: doctorId || hospitalResponse.data.assignedDoctorId || null,
          date,
          time: assignedTime,
          reason,
          appointmentType,
          status: hospitalResponse.data.status || "pending",
          bookingMode: "Online",
          idempotencyKey, // Save the idempotency key here
        });

        await appointment.save();

        return res.status(201).json({
          message: "Appointment booked",
          appointment,
          note:
            assignedTime !== time
              ? `Requested slot unavailable. Assigned next available slot: ${assignedTime}`
              : null,
        });
      } catch (err) {
        console.log("Hospital backend unreachable", err.message);
        return res.status(503).json({ message: "Hospital backend unreachable, please try later or book offline" });
      }
    }

    // For offline bookings
    const appointment = new Appointment({
      patient: patientId,
      doctorId: doctorId || null,
      date,
      time: time || null,
      reason,
      appointmentType,
      status: "pending_offline",
      bookingMode: "Offline",
      idempotencyKey, // Save idempotency key here as well
    });

    await appointment.save();

    return res.status(201).json({
      message: "Appointment saved offline, will sync later",
      appointment,
    });
  } catch (error) {
    console.error("Booking error:", error.message);
    return res.status(500).json({ message: "Server error booking appointment" });
  }
};


export const getPatientAppointments = async (req, res) => {
  try {
    const patientId = req.user?.id || req.query.patientId;

    if (!patientId) return res.status(400).json({ message: "Patient ID required" });

    const appointments = await Appointment.find({ patient: patientId }).sort({ date: -1, time: -1 });

    res.status(200).json({ appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error.message);
    res.status(500).json({ message: "Server error fetching appointments" });
  }
};

export const getDoctorSlots=async (req,res)=>{
     const { doctorId, date } = req.query;

  if (!doctorId || !date) {
    return res.status(400).json({ error: 'doctorId and date query params are required' });
  }

  try {
    // Fetch slot data from hospital backend
    const response = await axios.get(`${HOSPITAL_BACKEND_URL}/api/appointments/slots`, {
      params: { doctorId, date }
    });

    // Return the slot data to frontend
    return res.json(response.data);
  } catch (error) {
    console.error('Error fetching slots from hospital backend:', error.message);
    return res.status(500).json({ error: 'Failed to fetch slots' });
  }
}