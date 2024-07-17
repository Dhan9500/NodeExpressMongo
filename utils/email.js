// eslint-disable-next-line import/no-extraneous-dependencies
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1) Create transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // 2) Create Options

    const mailOptions = {
        from: 'Test1 <test@1.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    // 3) Actually send the mail

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
