var phoneNumberInput = document.getElementById("phoneNumberUser");
var passwordInput = document.getElementById("passwordUser");


var phoneNumberError = document.getElementById("phoneNumber-error");
var passwordError = document.getElementById("password-error");

phoneNumberInput.addEventListener("keyup", function (event) {
    if (isNaN(event.target.value)) {
        phoneNumberError.textContent = "Số điện thoại không hợp lệ";
    }
    else if (event.target.value.trim() === '') {
        phoneNumberError.textContent = "Vui lòng nhập số điện thoại";
    }
    else {
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
function openResetPass() {
    document.getElementById("confirmPhone").style.display = "flex";
    document.getElementById("login").classList.add("blur");
}

function closeResetPass() {
    document.getElementById("confirmPhone").style.display = "none";
    document.getElementById("confirmOTP").style.display = "none";
    document.getElementById("resetPass").style.display = "none";
    document.getElementById("login").classList.remove("blur");
}

function confirmOTP(){
    document.getElementById("confirmPhone").style.display = "none";
    document.getElementById("confirmOTP").style.display = "flex";
    document.getElementById("login").classList.add("blur");
}

function resetPass() {
    document.getElementById("confirmOTP").style.display = "none";
    document.getElementById("resetPass").style.display = "flex";
    document.getElementById("login").classList.add("blur");
}
function message({ title = '', content = '', type = '', dur = 3000 }) {
    const _alert = document.getElementById('message');
    const message = document.createElement('div');
    const autoClose = setTimeout(function () {
        _alert.removeChild(message);
    }, dur + 1000);

    message.onclick = function (e) {
        if (e.target.closest('.message__close')) {
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
    message.style.animation = `slideInLeft ease .3s, fadeOut linear 1s ${(dur / 1000).toFixed(2)}s forwards`;
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

document.getElementById("loginForm").addEventListener("submit", function(event){
    event.preventDefault();
    const phoneNumber = document.getElementById("phoneNumberUser").value;
    const password = document.getElementById("passwordUser").value;
    fetch('http://localhost:8000/checkLogin',{
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({phoneNumber, password})
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            if (data.status != 200) {
                message({ title: data.title, content: data.message, type: data.title.toLowerCase(), dur: 5000 });
            } else {
                console.log(data);
                message({ title: data.title, content: data.message, type: data.title.toLowerCase(), dur: 5000 });
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);
                setTimeout(function () {
                    window.location.href = "/";
                }, 1000);
            }
        })
        .catch(error => {

        });
})