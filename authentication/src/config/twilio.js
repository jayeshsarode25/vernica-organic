import Twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
  throw new Error("Twilio credentials are missing");
}

const twilioClient = new Twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// console.log("✅ Twilio initialized:", twilioClient.username);

export default twilioClient;
