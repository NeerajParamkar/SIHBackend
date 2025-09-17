import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number },
    gender: { type: String },
    contact: { type: String },
    history: { type: String },

    // Main doctor who treats this patient
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },

    // All reports (added by main doctor OR lab doctor)
    reports: [{ type: mongoose.Schema.Types.ObjectId, ref: "LabReport" }]  // Changed from "Report" to "LabReport"
  },
  { timestamps: true }
);

const Patient = mongoose.model("Patient", patientSchema);
export default Patient;