import axios from 'axios';

export const getDoctors = async (req, res) => {
  try {
    const { department, gender } = req.query;

    const hospitalRes = await axios.get((`${HOSPITAL_BACKEND_URL}/api/doctors`), {
      params: { department, gender }
    });

    res.status(200).json(hospitalRes.data);
  } catch (error) {
    console.error('Error fetching doctors:', error.message);
    res.status(500).json({ message: 'Failed to fetch doctor list' });
  }
};
