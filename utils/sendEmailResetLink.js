import nodemailer from "nodemailer";

export const sendEmailResetLink = async (email, resetLink, emailSubject) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.GMAIL_PASSWORD,
      to: email,
      subject: `${emailSubject}`,
      text: `${emailSubject}`,
      html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reset Password</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        color: #333;
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }
      .container {
        max-width: 600px;
        width: 100%;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        padding: 20px;
        text-align: center;
      }
      .header img {
        max-width: 150px;
        margin-bottom: 20px;
      }
      .header h1 {
        font-size: 24px;
        color: #444;
        margin: 0 0 10px;
      }
      .content p {
        font-size: 16px;
        color: #555;
        margin: 15px 0;
        line-height: 1.6;
      }
      .button {
        display: inline-block;
        background-color: #4caf50;
        color: white;
        text-decoration: none;
        font-size: 16px;
        font-weight: bold;
        padding: 12px 25px;
        border-radius: 4px;
        margin: 20px 0;
      }
      .button:hover {
        background-color: #45a049;
      }
      .link {
        color: #4caf50;
        font-size: 14px;
        word-wrap: break-word;
      }
      .footer {
        margin-top: 20px;
        font-size: 14px;
        color: #777;
      }
      .footer a {
        color: #4caf50;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img
          src="https://themesbrand.com/velzon/html/material/assets/images/logo-dark.png"
          alt="Company Logo"
        />
        <h1>${emailSubject}</h1>
      </div>
      <div class="content">
        <p>Dear User,</p>
        <p>We received a request to reset your password.</p>
        <p>
          Click the button below to reset your password. If you did not request
          this, please ignore this email.
        </p>
        <a href=${resetLink} class="button"
          >Reset Password</a>
        <p>Or use this link:</p>
        <p>
          <a
            href="http://localhost:3000"
            class="link"
            >http://localhost:3000</a
          >
        </p>
      </div>
      <div class="footer">
        <p>Need help? Contact us at <a href="mailto:support@example.com">support@example.com</a></p>
        <p>&copy; 2025 Your Company. All rights reserved.</p>
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
