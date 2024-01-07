const nodemailer = require('nodemailer');
require('dotenv').config();

const bcrypt = require('bcrypt');
const saltRounds = 10;


const sendResetEmail = (email, resetToken) => {
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
        text: `Click the following link to reset your password: http://localhost:4000/quenmatkhau/${resetToken}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

module.exports = sendResetEmail;