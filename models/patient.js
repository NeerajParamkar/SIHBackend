import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number },
    gender: { type: String },
    contact: { type: String },
    history: { type: String },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true }, // 🔥 link patient to a doctor
    reports: [{ type: mongoose.Schema.Types.ObjectId, ref: "Report" }] // 🔥 store reports for patient
  },
  { timestamps: true }
);

const Patient = mongoose.model("Patient", patientSchema);
export default Patient;
