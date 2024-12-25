const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function main(email,name, amount,projectName) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: process.env.EMAIL, // sender address
    to: email, // list of receivers
    subject: "Payment Confirmation", // Subject line
    text: "", // plain text body
    html: `<div class="email-container">
    <div class="header">
      <h1>Payment Confirmation</h1>
    </div>
    <div class="content">
      <p>Dear <strong>${name}</strong>,</p>
      <p>Thank you for your generous contribution!</p>
      <p>We have successfully received your payment of <strong>Rs. ${amount}</strong> for the charity <strong>${projectName}</strong>.</p>
      <p>Your support helps us make a significant impact, and we truly appreciate your generosity.</p>
      <p>If you have any questions or need further assistance, please don't hesitate to contact us.</p>
    </div>
    <div class="footer">
      <p>Thank you for your support!</p>
    </div>
  </div>
  <style>
    .email-container {
    font-family: Arial, sans-serif;
      max-width: 600px;
      margin: 20px auto;
      background: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 20px;
    }
    .header h1 {
      color: #4CAF50;
    }
    .content {
      line-height: 1.6;
    }
    .content p {
      margin: 10px 0;
    }
    .footer {
      margin-top: 20px;
      text-align: center;
      font-size: 12px;
      color: #777;
    }
  </style>`, 
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

// main().catch(console.error);

module.exports=main;