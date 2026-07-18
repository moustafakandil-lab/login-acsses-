// src/utils/sendEmail.js
//
// This is the ONE place in the whole app that sends email.
// Nothing else should call an email provider directly — always
// import and call sendEmail() from here, so every email is
// guaranteed to pass through the same logging step.
//
// It calls a Firebase Cloud Function ("sendEmail", see
// functions/index.js) which does the actual sending through a
// local/test SMTP inbox (Ethereal) rather than a real provider.

import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const sendEmailFn = httpsCallable(functions, 'sendEmail');

/**
 * Send an email and record it in the emailLogs collection.
 * @param {{to: string, subject: string, body: string}} message
 */
export async function sendEmail({ to, subject, body }) {
  const logRef = collection(db, 'emailLogs');

  try {
    const result = await sendEmailFn({ to, subject, body });

    await addDoc(logRef, {
      to,
      subject,
      status: 'sent',
      sentAt: serverTimestamp(),
      previewUrl: result.data?.previewUrl || null // Ethereal test inbox link
    });

    return { success: true };
  } catch (err) {
    // Never let a failed email crash the app — log the failure
    // with a reason so it's visible in the list.
    await addDoc(logRef, {
      to,
      subject,
      status: 'failed',
      reason: err.message || 'Unknown error',
      sentAt: serverTimestamp()
    });

    return { success: false, reason: err.message };
  }
}
