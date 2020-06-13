const nodeMailer = require('nodemailer');

const sendEmail = async (options) => {

    // create transporter
    const transPorter = nodeMailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });

    let message = {
        from: `${process.env.FROM_NAME}  <${process.env.FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
    }
    const info = await transPorter.sendMail(message);

    console.log(`message sent to ${info.messageId}`);

}

module.exports = sendEmail;