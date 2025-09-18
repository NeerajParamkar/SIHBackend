
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http  from 'http';
import { Server } from 'socket.io';

dotenv.config();
const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors());

import connectDB from "./config/db.js";
connectDB();

import doctorRoutes from "./routes/doctorRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import staffRoutes from "./routes/staffRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import emergencyRoutes from "./routes/emergencyRoutes.js"
import offlineRequestRoute from "./routes/offlineRequestRoute.js"

app.use("/api/doctors", doctorRoutes);
app.use("/api/patients", patientRoutes);
app.use("/", authRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/emergencies", emergencyRoutes);
app.use("/offline-requests", offlineRequestRoute);


app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running successfully",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Create Socket.IO server
const io = new Server(server, {
  cors: { origin: '*' }, // allow RN app to connect
});

// Socket.IO events
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join', (roomId) => {
    socket.join(roomId);
    console.log(`${socket.id} joined room ${roomId}`);
    socket.to(roomId).emit('peer-joined', { id: socket.id });
  });

  socket.on('offer', ({ roomId, offer, to }) => {
    socket.to(to || roomId).emit('offer', { from: socket.id, offer });
  });

  socket.on('answer', ({ roomId, answer, to }) => {
    socket.to(to || roomId).emit('answer', { from: socket.id, answer });
  });

  socket.on('ice-candidate', ({ roomId, candidate, to }) => {
    socket.to(to || roomId).emit('ice-candidate', { from: socket.id, candidate });
  });

  socket.on('leave', (roomId) => {
    socket.leave(roomId);
    socket.to(roomId).emit('peer-left', { id: socket.id });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});


const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://192.168.1.45:${PORT}`);
});