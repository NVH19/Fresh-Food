
let slideIndex = 0;
let slides = document.getElementsByClassName("slides");
let dots = document.getElementsByClassName("dot");
let slideTimeout;
showSlides();
function showSlides() {
    let i;
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1 }
    if (slideIndex < 1) { slideIndex = slides.length }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active-dot", "");
    }
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active-dot";
    // console.log(slideIndex);
    clearTimeout(slideTimeout);
    slideTimeout = setTimeout(function () {
        plusSlides(1);
    }, 5000);
}

function plusSlides(n) {
    slideIndex += n - 1;
    showSlides();
}

function currentSlide(n) {
    slideIndex = n - 1;
    showSlides();
}
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', function (event) {
        event.preventDefault(); // Ngăn chặn hành động mặc định của liên kết
        document.querySelectorAll('.menu-item').forEach(link => {
            link.classList.remove('active'); // Loại bỏ lớp active khỏi tất cả các mục
        });
        item.classList.add('active'); // Thêm lớp active vào mục được nhấp
    });
});

// const listSlides = document.querySelector('.slides');
// const imgs = document.getElementsByTagName('img');
// let slideIndex = 0;

// setInterval(() => {
//     slideIndex++;
//     let width = imgs[0].offsetWidth
//     listSlides.style.transform = `translateX(${width * -1}px)`;
// } ,4000)

// let slideIndex = 0;
// const slides = document.querySelectorAll('.slides');
// const listSlides = document.getElementsByTagName('img');

// function updateSlides() {
//     let width = listSlides[0].offsetWidth;
//     slideIndex++;

//     // Nếu slideIndex vượt quá số lượng slide, quay lại slide đầu tiên
//     if (slideIndex >= slides.length) {
//         slideIndex = 0;
//     }

//     // Chuyển động các slide sang trái
//     slides.style.transform = `translateX(${-width * slideIndex}px)`;
// }

// setInterval(updateSlides, 4000);

document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem('accessToken');
    function isTokenExpired(token) {
        // Tách phần payload ra khỏi token
        const payload = JSON.parse(atob(token.split('.')[1]));

        // Lấy thời gian hiện tại (Unix timestamp)
        const currentTime = Math.floor(Date.now() / 1000);

        // So sánh thời gian hiện tại với thời gian hết hạn trong payload
        return payload.exp < currentTime;
    }
    if (isTokenExpired(token)){
        window.location.href = "/login";
    }
    if (token) {
        fetch('/user', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => {
                const settingDiv = document.getElementById('user');
                settingDiv.innerHTML = `
                    <a href="#" class="log check">
                        <i class="fa-regular fa-user icon__user"></i>
                        ${data.name}
                    </a>
                    <ul class="log user-menu">
                        <li class="user-item"><a href="">Account</a></li>
                        <li class="user-item"><a href="">Orders</a></li>
                        <li class="user-item" id="logout"><a href="">Logout</a></li>
                    </ul>
                `;
                const logoutButton = document.getElementById('logout');
                if (logoutButton) {
                    logoutButton.addEventListener("click", function (event) {
                        event.preventDefault();
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('refreshToken');
                        setTimeout(function(){
                            window.location.href = "/login";
                        }, 1000);
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
});

document.addEventListener("DOMContentLoaded",function(){
    fetch('http://localhost:8000/categories')
        .then(response => response.json())
        .then(data => {
            var categories = data; 
            // console.log(categories);
            var categories_list = document.getElementById('category-list');

            categories.forEach(function (item){
                var category_item = creatCategory(item);
                categories_list.appendChild(category_item);
            });

            function creatCategory(item){
                // console.log(item.image);
                var category_item = document.createElement('div');
                category_item.classList.add('category-item');
                category_item.innerHTML = `
                    <div class="category-img" style="background-image: url('${item.image}');"></div>
                    <div class="category-name">${item.title}</div>
                `;
                // console.log(category_item);
                return category_item;
            }
        })
        .catch(e => {
            console.error('Lỗi khi gửi yêu cầu API:', e);
        });
    
    fetch('http://localhost:8000/newProducts')
        .then(response => response.json())
        .then(data => {
            var currentPage = 1;
            document.getElementById('prev-button').addEventListener('click', prevPage);
            document.getElementById('next-button').addEventListener('click', nextPage);
            function prevPage() {
                if (currentPage > 1) {
                    currentPage--;
                    renderNewProducts();
                }
            }
            function nextPage() {
                if (currentPage < Math.ceil(data.length / 10)) {
                    currentPage++;
                    renderNewProducts();
                }
            }
            // console.log(data);
            const newProducts = data;
            function renderNewProducts(){
                const container = document.getElementById('product-list');
                container.innerHTML = '';
                const start = (currentPage - 1) * 10;
                const end = start + 10;
                const itemsPerPage = newProducts.slice(start, end);
                itemsPerPage.forEach(item => {
                    // console.log(item);
                    var productItem = document.createElement('div');
                    productItem.classList.add('product-item');
                    productItem.innerHTML = `
                    <div class="product-img" style="background-image: url('${item.image}');"></div>
                    <div class="product-name">${item.name}</div>
                    <div class="product-info">
                        <div class="product-price">${item.price}$</div>
                        <div class="product-sold">${item.sold} sold</div>
                    </div>
                `;
                    container.appendChild(productItem);
                });
                document.getElementById('page-info').textContent = `Page ${currentPage} of ${Math.ceil(newProducts.length / 10)}`;
            }
            renderNewProducts();
        })
        .catch(e => {
            console.error('Lỗi khi gửi yêu cầu API:', e);
        });
});
