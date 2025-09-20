import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String,
  language: String,
  createdAt:Date,
});

module.exports=mongoose.model('Patient',PatientSchema)
