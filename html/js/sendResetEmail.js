const nodemailer = require('nodemailer');

const sendResetEmail = async (email, resetToken, id, taikhoan) => {
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
        html: `<p>Chào bạn ${taikhoan.HoTen},</p>
		<p>Chúng tôi xin gửi lời chào thân ái đến bạn. Bạn đang nhận được thông báo này vì bạn đã gửi một yêu cầu thay đổi mật khẩu.</p>
		<p>Nếu bạn không thực hiện thao tác này, vui lòng bỏ qua email này và không cung cấp đường link cho bất kì ai khác.</p>

		<p>Nếu có:</p>
        <p><strong>Vui lòng click đường link này để đăng nhập và thay đổi mật khẩu: https://ptudw13.onrender.com/quenmatkhau/${id}/${resetToken}.</p>
        <p>Lưu ý rằng đường link sẽ hết hạn trong vòng 15 phút.</p>

		<p>Chúng tôi xin cảm ơn bạn vì đã tin tưởng sử dụng dịch vụ của chúng tôi. Nếu bạn có bất kỳ câu hỏi hoặc cần thêm thông tin, đừng ngần ngại liên hệ với chúng tôi qua email này.</p>
		<p>Trân trọng,<br><strong>PTUDW-13</strong></p>`,
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
