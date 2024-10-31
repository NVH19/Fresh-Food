var phoneNumberInput = document.getElementById("phone");
var OTPInput = document.getElementById("OTP-code");
var usernameInput = document.getElementById("username");
var passwordInput = document.getElementById("password");


var phoneNumberError = document.getElementById("phoneNumber-error");
var OTPError = document.getElementById("OTP-error");
var usernameError = document.getElementById("username-error");
var passwordError = document.getElementById("password-error");

phoneNumberInput.addEventListener("keyup", function (event) {
    if (isNaN(event.target.value)){
        phoneNumberError.textContent = "Số điện thoại không hợp lệ";
    }
    else if (event.target.value.trim() === ''){
        phoneNumberError.textContent = "Vui lòng nhập số điện thoại";
    }
    else{
        phoneNumberError.textContent = "";
    }
    // if (phoneNumberInput.value === "") {
    //     phoneNumberValid = false;
    //     let error = event.target.value;
    //     phoneNumberError.textContent = error;
    // } else {
    //     phoneNumberValid = true;
    //     phoneNumberError.textContent = "";
    // }
});

// Kiểm tra tính hợp lệ của OTP-code
OTPInput.addEventListener("keyup", function (event) {
    if (event.target.value.trim() === '') {
        OTPError.textContent = "Không được bỏ trống";
    }
    else if (isNaN(event.target.value)) {
        OTPError.textContent = "Mã OTP không hợp lệ";
    }
    else if (OTPInput.value.length < 4){
        OTPError.textContent = "Nhập 4 số";
    }
    else {
        OTPError.textContent = "";
    }
});

// Kiểm tra tính hợp lệ của password
passwordInput.addEventListener("keyup", function (event) {
    if (event.target.value.trim() === "") {
        passwordError.textContent = "Vui lòng nhập mật khẩu!";
    } else if (passwordInput.value.length < 8) {
        passwordError.textContent = "Mật khẩu phải có ít nhất 8 kí tự";
    } else {
        passwordError.textContent = "";
    }
});

// Kiểm tra tính hợp lệ của username
usernameInput.addEventListener("keyup", function (event) {
    if (event.target.value.trim() === '') {
        usernameError.textContent = "Nhập tên người dùng";
    }
    else {
        usernameError.textContent = "";
    }
});

function message({title = '',content = '', type= '', dur = 3000}){
    const _alert = document.getElementById('message');
    const message = document.createElement('div');
    const autoClose = setTimeout(function () {
        _alert.removeChild(message);
    }, dur + 1000);

    message.onclick = function(e){
        if(e.target.closest('.message__close')){
            _alert.removeChild(message);
            clearTimeout(autoClose);
        }
    }
    const icons = {
        succes: 'fas fa-check-circle',
        warning: 'fas fa-exclamation-circle',
        error: 'fas fa-times'
    }
    message.classList.add('message', `${type}`);
    message.style.animation = `slideInLeft ease .3s, fadeOut linear 1s ${(dur/1000).toFixed(2)}s forwards`;
    message.innerHTML = `
        <div class="message__icon">
            <i class= "${icons[title.toLowerCase()]}"></i>
        </div>
        <div class="message__body">
            <h3 class="message__title">${title}</h3>
            <p class="message__content">${content}</p>
        </div>
        <div class="message__close">
            <i class="fas fa-times"></i>
        </div>
    `;
    _alert.appendChild(message);
    
}
// send request sign
document.getElementById("signUpForm").addEventListener("submit", function(event){
    event.preventDefault();
    const phoneNumber = document.getElementById("phone").value;
    const OTP_code = document.getElementById("OTP-code").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    fetch('http://localhost:8000/addUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({phoneNumber:phoneNumber, username:username,password:password})
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            if (data.status != 200) {
                message({ title : data.title, content : data.message, type : data.title.toLowerCase(), dur : 5000 });
            } else {
                message({ title: data.title, content: data.message, type: data.title.toLowerCase(), dur: 5000 });
                setTimeout(function(){
                    window.location.href = "/login";
                },1000);
            }
        })
        .catch(error => {

        });
});