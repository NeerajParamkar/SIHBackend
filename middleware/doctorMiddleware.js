import mongoose from 'mongoose';
import Doctor from '../models/doctor.js';
import Patient from '../models/patient.js';

const getDoctorAndPatientFromParams = async (req, res, next) => {
  try {
    const { doctorId, patientId } = req.params;
    
    // Check if doctorId is provided
    if (!doctorId) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Doctor ID is required',
          details: 'doctorId parameter is missing from the request'
        }
      });
    }
    
    // Validate doctorId ObjectId format
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid Doctor ID format',
          details: 'doctorId must be a valid MongoDB ObjectId'
        }
      });
    }
    
    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Doctor not found',
          details: `No doctor found with ID: ${doctorId}`
        }
      });
    }
    
    // Add doctorId and doctor to request object
    req.doctorId = doctorId;
    req.doctor = doctor;
    
    // Handle patientId if provided
    if (patientId) {
      // Validate patientId ObjectId format
      if (!mongoose.Types.ObjectId.isValid(patientId)) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Invalid Patient ID format',
            details: 'patientId must be a valid MongoDB ObjectId'
          }
        });
      }
      
      // Check if patient exists
      const patient = await Patient.findById(patientId);
      if (!patient) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Patient not found',
            details: `No patient found with ID: ${patientId}`
          }
        });
      }
      
      // Verify patient belongs to the doctor
      if (patient.doctor.toString() !== doctorId) {
        return res.status(403).json({
          success: false,
          error: {
            message: 'Access denied',
            details: 'Patient does not belong to the specified doctor'
          }
        });
      }
      
      // Add patientId and patient to request object
      req.patientId = patientId;
      req.patient = patient;
    }
    
    next();
  } catch (error) {
    console.error('Error in getDoctorAndPatientFromParams middleware:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Server error while validating IDs',
        details: error.message
      }
    });
  }
};

/**
 * Middleware to extract and validate only doctor ID from request parameters
 * Adds doctorId and doctor to req object for use in subsequent middleware/controllers
 */
const getDoctorIdFromParams = async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    
    // Check if doctorId is provided
    if (!doctorId) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Doctor ID is required',
          details: 'doctorId parameter is missing from the request'
        }
      });
    }
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid Doctor ID format',
          details: 'doctorId must be a valid MongoDB ObjectId'
        }
      });
    }
    
    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Doctor not found',
          details: `No doctor found with ID: ${doctorId}`
        }
      });
    }
    
    // Add doctorId and doctor to request object
    req.doctorId = doctorId;
    req.doctor = doctor;
    
    next();
  } catch (error) {
    console.error('Error in getDoctorIdFromParams middleware:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Server error while validating doctor ID',
        details: error.message
      }
    });
  }
};

export {
  getDoctorIdFromParams,
  getDoctorAndPatientFromParams
};