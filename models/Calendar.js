const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String }, // e.g. "Checkup with Patient X"
  description: { type: String }, // optional details
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" }, // optional link
  type: { type: String, enum: ["appointment", "surgery", "meeting", "other"], default: "appointment" },
});

const dayScheduleSchema = new mongoose.Schema({
  date: { type: Date, required: true }, // e.g. 2025-09-15
  status: { 
    type: String, 
    enum: ["available", "busy", "onDuty", "offDuty"], 
    default: "available" 
  }, // toggle
  slots: [
    {
      hour: { type: String, required: true }, // "08:00-09:00"
      tasks: [taskSchema] 
    }
  ],
});

const calendarSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  schedules: [dayScheduleSchema], 
});

const Calendar = mongoose.model("Calendar", calendarSchema);
module.exports = Calendar;
