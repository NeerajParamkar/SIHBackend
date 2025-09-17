import mongoose from "mongoose";

const labreportSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },

    // 🔥 Who uploaded this report (could be Doctor or LabDoctor)
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "uploadedByRole" },

    // 🔥 Tell mongoose whether uploadedBy is a Doctor or LabDoctor
    uploadedByRole: { type: String, required: true, enum: ["Doctor", "LabDoctor"] },

    files: [{ type: String }], // file URLs
  },
  { timestamps: true }
);

const LabReport = mongoose.models.LabReport || mongoose.model("LabReport", labreportSchema);
export default LabReport;