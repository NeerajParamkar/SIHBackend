import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
  //can use .populate directly to connect patient schema instead of quering ervytime
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
  doctorId: String,//can be selected by patient or allocated by hospital
  date: Date,
  time: String,
  reason: String,
  appointmentType: String,
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },
  bookingMode: {
    type: String,
    enum: ["online", "offline"],
    default: "online",
  },
  createdAt: Date,
});

export default mongoose.model("Appointment", AppointmentSchema);