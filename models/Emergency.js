import mongoose from "mongoose";

const emergencySchema = new mongoose.Schema(
  {
    type: { type: String, required: true }, // e.g. "Cardiac Arrest"
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
    status: {
      type: String,
      enum: ["pending", "resolved"],
      default: "pending",
    },
    description: { type: String },
  },
  { timestamps: true }
);

const Emergency = mongoose.model("Emergency", emergencySchema);
export default Emergency;
