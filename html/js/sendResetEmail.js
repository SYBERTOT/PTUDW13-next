const nodemailer = require('nodemailer');

const sendResetEmail = async (email, resetToken, id) => {
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
        subject: 'Password Reset',
        text: `Click the following link to reset your password: https://ptudw13.onrender.com/quenmatkhau/${id}/${resetToken}`,
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

module.exports = sendResetEmail;
