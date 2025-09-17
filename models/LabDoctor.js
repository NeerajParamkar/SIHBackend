import mongoose from "mongoose";

// Report Schema (specific to lab)
const labReportSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    fileUrl: { type: String }, // if PDF, scan, or image is uploaded
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

// Patient Schema (inside lab doctor)
const labPatientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    contact: { type: String },
    history: { type: String }, // medical history notes
    reports: [labReportSchema], // embedded reports
  },
  { _id: true }
);

// Lab Doctor Schema
const labDoctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    specialization: { type: String, default: "Lab Doctor" },
    mobile: { type: String, required: true, unique: true },
    patients: [labPatientSchema], // array of patients (with embedded reports)
  },
  { timestamps: true }
);

const LabDoctor = mongoose.model("LabDoctor", labDoctorSchema);

export default LabDoctor;
