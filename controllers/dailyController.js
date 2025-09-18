import axios from 'axios';
import CallRoom from '../models/CallRoom.js';

// Create a Daily.co room
const createDailyRoom = async (req, res) => {
  try {
    const { patientId, doctorId } = req.body;

    // Validate required parameters
    if (!patientId || !doctorId) {
      return res.status(400).json({
        success: false,
        error: 'patientId and doctorId are required'
      });
    }

    // Daily.co API configuration
    const DAILY_API_KEY = process.env.DAILY_API_KEY;
    const DAILY_API_URL = 'https://api.daily.co/v1/rooms';

    if (!DAILY_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'Daily API key is missing'
      });
    }

    // Create room configuration
    const roomConfig = {
      name: `consultation-${doctorId}-${patientId}-${Date.now()}`,
      privacy: 'public', // or 'private' if you want
      properties: {
        enable_chat: true,
        enable_knocking: false,
        enable_prejoin_ui: true,
        start_video_off: false,
        start_audio_off: false,
        enable_people_ui: true
      }
    };

    // Make API request to Daily.co
    const response = await axios.post(DAILY_API_URL, roomConfig, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DAILY_API_KEY}`
      }
    });

    const room = response.data;
    const roomUrl = `https://medkit.daily.co/${room.name}`;

    // Store room information in database
    const callRoom = new CallRoom({
      roomId: roomUrl,
      doctorId: doctorId,
      patientId: patientId,
      createdAt: new Date()
    });

    await callRoom.save();

    // Return room information
    res.status(200).json({
      success: true,
      roomUrl: roomUrl,
      roomId: room.id,
      roomName: room.name,
      config: roomConfig
    });
  } catch (error) {
    console.error('Error creating Daily.co room:', error.response?.data || error.message);

    if (error.response) {
      res.status(error.response.status).json({
        success: false,
        error: error.response.data?.error || 'Failed to create video call room'
      });
    } else if (error.request) {
      res.status(500).json({
        success: false,
        error: 'Network error - unable to reach Daily.co API'
      });
    } else {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to create video call room'
      });
    }
  }
};

// Get room information
const getDailyRoom = async (req, res) => {
  try {
    const { roomName } = req.params;
    
    if (!roomName) {
      return res.status(400).json({
        success: false,
        error: 'roomName is required'
      });
    }
    
    const DAILY_API_KEY = process.env.DAILY_API_KEY;
    const DAILY_API_URL = `https://api.daily.co/v1/rooms/${roomName}`;
    
    const response = await axios.get(DAILY_API_URL, {
      headers: {
        'Authorization': `Bearer ${DAILY_API_KEY}`
      }
    });
    
    res.status(200).json({
      success: true,
      room: response.data
    });
  } catch (error) {
    console.error('Error getting Daily.co room:', error.response?.data || error.message);
    
    if (error.response) {
      res.status(error.response.status).json({
        success: false,
        error: error.response.data?.error || 'Failed to get room information'
      });
    } else if (error.request) {
      res.status(500).json({
        success: false,
        error: 'Network error - unable to reach Daily.co API'
      });
    } else {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get room information'
      });
    }
  }
};

// Delete a room
const deleteDailyRoom = async (req, res) => {
  try {
    const { roomName } = req.params;
    
    if (!roomName) {
      return res.status(400).json({
        success: false,
        error: 'roomName is required'
      });
    }
    
    const DAILY_API_KEY = process.env.DAILY_API_KEY;
    const DAILY_API_URL = `https://api.daily.co/v1/rooms/${roomName}`;
    
    await axios.delete(DAILY_API_URL, {
      headers: {
        'Authorization': `Bearer ${DAILY_API_KEY}`
      }
    });
    
    res.status(200).json({
      success: true,
      message: 'Room deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting Daily.co room:', error.response?.data || error.message);
    
    if (error.response) {
      res.status(error.response.status).json({
        success: false,
        error: error.response.data?.error || 'Failed to delete room'
      });
    } else if (error.request) {
      res.status(500).json({
        success: false,
        error: 'Network error - unable to reach Daily.co API'
      });
    } else {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to delete room'
      });
    }
  }
};

export {
  createDailyRoom,
  getDailyRoom,
  deleteDailyRoom
};