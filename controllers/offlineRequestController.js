import OfflineRequest from '../models/OfflineRequest.js';
import { sendSms } from '../utils/smsSender.js';

export async function respondOfflineRequest(req, res, next) {
  try {
    const { id } = req.params;
    const { status, message } = req.body; 
    // status could be "confirmed" | "rejected" | "pending"

    const offline = await OfflineRequest.findById(id);
    if (!offline) {
      return res.status(404).json({ error: 'Offline request not found' });
    }

    offline.status = status;
    offline.processedAt = new Date();
    await offline.save();

    // send SMS to patient (parsed.contact comes from smsParser)
    if (offline.parsed?.contact) {
      await sendSms(
        offline.parsed.contact,
        message || `Your appointment request has been ${status}.`
      );
    }

    // notify frontend clients via Socket.io (if enabled)
    const io = req.app.get('io');
    io && io.emit('offline_request_updated', { offline });

    res.json({ success: true, offline });
  } catch (err) {
    next(err);
  }
}
