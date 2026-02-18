// import twilioClient from "../config/twilio.js";

// export default async function sendSms(to, message) {
//   try {
//     // console.log("Sending SMS using:", twilioClient.username);

//     const result = await twilioClient.messages.create({
//       body: message,
//       from: process.env.TWILIO_PHONE_NUMBER,
//       to
//     });

//     // console.log("✅ SMS sent:", result.sid);
//     return result.sid;

//   } catch (error) {
//     console.error("Twilio error:",  error.code, error.message);
//     throw new Error("Failed to send OTP");
//   }
// }

import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendSms = async (to, message) => {
  try {
    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: `whatsapp:${to}`,
      body: message,
    });
  } catch (error) {
    console.error("Twilio WhatsApp error:", error.code, error.message);
    throw new Error("Failed to send OTP");
  }
};

export default sendSms;
