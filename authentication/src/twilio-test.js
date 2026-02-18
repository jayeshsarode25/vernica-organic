import Twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const client = new Twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

console.log("Username:", client.username);

async function test() {
  const msg = await client.messages.create({
    body: "Test message",
    from: process.env.TWILIO_PHONE_NUMBER,
    to: "+918007434939"
  });
  console.log(msg.sid);
}

test();
