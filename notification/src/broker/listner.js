import { subscribeToQueue } from "../broker/rabbit.js";
import sendEmail from "../utils/email.js";

function startListener() {
  subscribeToQueue("user_created", async (msg) => {
    const { email, phone, name } = msg;
    console.log("queue data", msg);

    if (!email) {
      throw new Error("Email Missing Queue Payload");
    }

    const template = `
      <h1>Welcome to Vernika Organic 🌿</h1>
      <p>Dear ${name},</p>
      <p>Thank you for joining <strong>Vernika Organic</strong>.</p>
      <p>With love & care 🌱</p>
      <strong>Team Vernika Organic</strong>
    `;

    await sendEmail(
      email,
      "Welcome to Vernika Organic",
      "Thank you for registering with Vernika Organic.",
      template,
    );

    console.log("Welcome email send to:",email);
  });
}

export default startListener;
