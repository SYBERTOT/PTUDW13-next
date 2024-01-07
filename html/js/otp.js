
var otpVal = 0;
function sendMail(hoten, email){
    let otp = Math.floor(100000 + Math.random() * 900000);;

	let emailbody = `<p>Kính gửi ${hoten},</p>
					<p>Chúng tôi hy vọng rằng bạn đang có một ngày tốt lành. Như một phần của biện pháp bảo mật, chúng tôi đã bắt đầu một quá trình xác minh cho tài khoản của bạn. Mã OTP (One-Time Password) của bạn được cung cấp dưới đây:</p>
					<p><strong>Mã OTP: ${otp}</strong></p>
					<p>Vui lòng nhập mã này trên trang xác minh để hoàn tất quá trình. Lưu ý rằng mã OTP chỉ có hiệu lực trong khoảng thời gian giới hạn và không nên chia sẻ với bất kỳ ai vì lý do bảo mật.</p>
					<p>Nếu bạn không bắt đầu quá trình xác minh này hoặc có bất kỳ lo ngại nào, vui lòng liên hệ ngay lập tức với đội ngũ hỗ trợ của chúng tôi tại [Email hoặc Số Điện Thoại Hỗ Trợ].</p>
					<p>Cảm ơn bạn đã chọn dịch vụ của chúng tôi.</p>
					<p>Trân trọng,<br>PTUDW-13</p>`;
	Email.send({
    SecureToken : "d988b362-8e86-4b80-b52f-02b32ae7553c",
    To : email,
    From : "ptpnam21@clc.fitus.edu.vn",
    Subject : "Email OTP using JavaScript",
    Body : emailbody,
	}).then(
		message => {
			if (message === "OK") {
				alert("OTP sent to your email " + email);
			}
		}
	);
    return otp;
}
document.getElementById('emailbtn').addEventListener('click', (event) => {
    event.preventDefault();

    // Get the email value
    const emailValue = document.getElementById('inputEmail').value;

    // Make an AJAX request to the server using fetch
    fetch('/quenmatkhau', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailValue }),
    })
    .then(response => response.json())
    .then(data => {
        // Handle the response from the server
        //otpVal = data.otpVal;
        console.log(data);
        if(data.msg == 'true')
            otpVal = sendMail(data.hoten, emailValue);
    })
    .catch(error => console.error('Error:', error));
});
// document.getElementById('emailbtn').addEventListener('click', (event) => {
//     event.preventDefault();

//     // Get the email value
//     const emailValue = document.getElementById('inputEmail').value;

//     // Make an AJAX request to the server using fetch
//     fetch('/quenmatkhau', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email: emailValue }),
//     })
//     .then(response => response.json())
//     .then(data => {
//         // Handle the response from the server
//         //otpVal = data.otpVal;
//         console.log(data);
//         if(data.msg == 'true')
//             otpVal = sendMail(data.hoten, emailValue);
//     })
//     .catch(error => console.error('Error:', error));
// });
function validateOTP(){
    let x = document.getElementById('otpInput').value;
    if(x == otpVal)
        return true;
    else {
        alert("OTP tầm bậy");
        return false;
    }
    return false;
}