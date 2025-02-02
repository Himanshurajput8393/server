import { OTP } from "../model/OTP.js";
import nodemailer from "nodemailer";
import { createOTP } from "../services/createOTP.js";

export const sendOTPVerificationEmail = async (userId, email) => {
  try {
    let otp = await createOTP();
    otp.toString();
    console.log(otp);
    
    
    const hashOTP = await OTP.hashOTP(otp);

    const inputOTP = new OTP({
      otp: hashOTP,
      userId,
    });
    const savedOTP = await inputOTP.save();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    const info = transporter.sendMail({
      from: process.env.GMAIL_PASSWORD,
      to: email,
      subject: "Email Verification",
      text: "Email Verification",
      html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta
      name="description"
      content="Verify your email to start using our product."
    />
    <meta name="author" content="Themesbrand" />
    <title>Email Verification</title>
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap"
      rel="stylesheet"
    />
    <style>
      body {
        font-family: "Inter", sans-serif;
        background-color: #f4f4f4;
        color: #333333;
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }
      .e-container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        padding: 20px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
      }
      .e-header {
        text-align: center;
        padding: 10px 0;
      }
      .e-header h1 {
        margin: 0;
        color: #434242;
        font-size: 24px;
      }
      .e-header img {
        padding-bottom: 18px;
      }
      .e-content {
        margin: 20px 0;
        text-align: center;
      }
      .e-content span{
         padding-left: 5px;
         font-weight: bold;
      }
      .e-content p {
        font-size: 16px;
        line-height: 1.5;
      }
      .code {
        font-size: 28px;
        font-weight: bold;
        color: #4caf50;
        margin: 20px 0;
      }
      .e-footer {
        text-align: center;
        padding: 10px 0;
        font-size: 14px;
        color: #666363;
        margin-top: 20px;
      }
      .verify-button {
        display: inline-block;
        background-color: #4caf50;
        color: #ffffff;
        padding: 12px 25px;
        text-decoration: none;
        font-weight: bold;
        border-radius: 4px;
        margin-top: 20px;
        font-size: 16px;
      }
      .verify-button:hover {
        background-color: #45a049;
      }
      .verify-link {
        text-decoration: none;
        color: #4caf50;
        font-weight: bold;
        word-break: break-word;
      }
      a {
        color: inherit;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="e-container">
        <div class="e-header">
          <img
            src="https://themesbrand.com/velzon/html/material/assets/images/logo-dark.png"
            alt="Velzon Logo"
          />
          <h1>Email Verification Required</h1>
        </div>
        <div class="e-content">
          <p>Dear<span>User,</span> Thank you for signing up!</p>
          <p>
            Please use the following verification code to complete your
            registration:
          </p>
          <p class="code">${otp}</p>
          <p>
            <strong>Note:</strong> This OTP is valid for the next
            <strong>10 minutes</strong>. If the OTP expires, please request a
            new one.
          </p>
          <p>Or, verify using this link:</p>
          <p>
            <a href="http://localhost:3000/api/v1/register" class="verify-link"
              >http://localhost:3000/api/v1/register</a
            >
          </p>
        </div>
      </div>
      <div class="e-footer">
        <p>Need Help?</p>
        <p>
          Please contact us at
          <a href="mailto:info@velzon.com">info@velzon.com</a>
        </p>
        <p>&copy; 2025 Velzon. Designed & Developed by Themesbrand</p>
      </div>
    </div>
  </body>
</html>
`,
    });
  } catch (error) {
    console.log(error.message);
  }
};
