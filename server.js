import express from 'express';
// import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js'
import appointmentRoutes from './routes/appointmentRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
connectDB();

app.use(cors());
// app.use(bodyParser.json());
app.use(express.json());


// Test route
app.get('/', (req, res) => {
  res.send('Backend server is running.');
});


//main routes
app.use('/api/appointments',appointmentRoutes);
app.use('/api/doctors',doctorRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

