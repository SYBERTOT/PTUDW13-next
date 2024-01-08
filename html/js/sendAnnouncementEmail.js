const nodemailer = require('nodemailer');

const sendAnnouncementEmail = async (email, subject, content) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'ptudw13@gmail.com',
            pass: 'qwba hrdr ahuw rkdx',
        },
    });  

    const mailOptions = {
        from: 'ptudw13@gmail.com',
        to: email,
        subject: subject,
        html: content,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

module.exports = sendAnnouncementEmail;
