// models/CallRoom.js
import mongoose from "mongoose";

const CallRoomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  doctorId: String,
  patientId: String,
  createdAt: { type: Date, default: Date.now }
});

const CallRoom = mongoose.model("CallRoom", CallRoomSchema);

export default CallRoom;
