// controllers/webhookController.js
import OfflineRequest from '../models/OfflineRequest.js';
import { parseSmsToBooking } from '../utils/smsParser.js';
import { sendSms } from '../utils/smsSender.js';
import { tryLockAndBook, getAvailableSlots } from '../services/appointmentService.js';

export async function smsWebhook(req, res, next) {
  try {
    // optional: verify signature header
    const raw = req.body; // depends on gateway
    const text = raw.Body || raw.message || raw.text;
    const from = raw.From || raw.from;
    const parsed = parseSmsToBooking(text);

    const offline = await OfflineRequest.create({
      source: 'sms',
      rawMessage: text,
      parsed
    });

    // attempt automatic booking if date & timeslot provided
    if (parsed.date && parsed.timeSlot && parsed.doctorId) {
      try {
        const appt = await tryLockAndBook({
          patientId: req.patientId, // create patient record or keep temp patient info
          doctorId: parsed.doctorId,
          date: parsed.date,
          timeSlot: parsed.timeSlot,
          type: parsed.type || 'in-person'
        });
        // mark offline request confirmed, link appointment
        offline.status = 'confirmed';
        offline.processedAt = new Date();
        await offline.save();
        // respond to sender
        await sendSms(from, `Booking confirmed for ${parsed.date} ${parsed.timeSlot}.`);
        // emit socket to mobile clients/admins
        const io = req.app.get('io'); io && io.emit('offline_booking_confirmed', { offline, appt });
      } catch (err) {
        // cannot book: reply with “pending” and next available options
        const avail = await getAvailableSlots(parsed.doctorId, parsed.date);
        await sendSms(from, `Could not book requested slot. Next available: ${avail.slice(0,3).join(', ')}`);
      }
    } else {
      // no date/time: reply with instruction and mark pending
      await sendSms(from, `We received your booking request. Hospital staff will confirm shortly.`);
    }

    return res.status(200).send('OK');
  } catch (err) {
    next(err);
  }
}
