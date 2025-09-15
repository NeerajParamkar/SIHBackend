import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    // Basic Info
    name: {
      type: String,
      required: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    availability: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["active", "on-leave", "busy"],
      default: "active",
    },

    // Patients linked to this doctor
    patients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
      },
    ],

    // Reports handled by this doctor
    reports: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Report",
      },
    ],

    // Calendar (per-day schedule with hourly slots)
    calendar: [
      {
        date: {
          type: Date,
          required: true,
        },
        slots: [
          {
            time: { type: String, required: true }, // e.g. "09:00"
            status: {
              type: String,
              enum: ["free", "booked", "cancelled"],
              default: "free",
            },
            patient: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Patient",
              default: null,
            },
          },
        ],
      },
    ],

    // Emergencies assigned to this doctor
    emergencies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Emergency",
      },
    ],
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;
