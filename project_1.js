let cart = [];
let total = 0;
let wishlist = [];
let ratings = {};
document.getElementById("shopBtn").addEventListener("click", function () {

    alert("Welcome to Online Book Store!");
});

async function loadBooks() {
    try {
        const response = await fetch("http://localhost:3000/api/books");
        const books = await response.json();

        const booksSection = document.getElementById("books");
        booksSection.innerHTML = "";

        books.forEach(book => {

    let imageName = "";

    if (book.title === "Java Programming") {
        imageName = "LbnayKPIU9w-B3DMyWrQI3en-uP0KU-lAA_R22tFHpe9dxM83lFEOwRcNxh-D70FktbA0-JwKMLC9m8OwcKOk9j0p3zUWmGN9LGn9QTBaGCbYO8VvstXvgW3qvEqavvUSkQC7sKsurvRUyhTQ_F5b7zZBB8rtwrVEaAo1O_J5lg8uM1XAhDlKBcym4s75Cl-.jpeg";
    }
    else if (book.title === "Data Structures") {
        imageName = "nrg7Z3R54x_FxwJPkeepTf39KUbSRGy8myWOM1AVkJpBWYGDYby61jxwZtneY9T4Msro6eE57RRCGJe48l_3u5_wWFoIAtKLWCz69JBh2DF8Pv0LVQJAzBuSq53FkSCIZitbtzLazG2CFb2vn5jNHOC7nIkklv2drrsGUyVQIWB0YnvMT5yb1Soj4bPEJNAa.jpeg";
    }
    else if (book.title === "Web Development") {
        imageName = "Jn0dA5gKctI2y_OXL36ZCRQmgDX9Bu2ab81KE8f1Zdw_tL4MDYtH1fp0pOMpNfNKzNLhYuyQprDnKKl9lcVuslErrNyZsQfT6b4t_4V5uGOpe5cWTqN1aS95i1ZlaTaLpxlWMRsuSOyYNcH87wbyBwuhvgTelDsGCJDiPSsVbWI1Qqzwp4u0X9ATc071Eh6X.jpeg";
    }
    else if (book.title === "Database Management") {
        imageName = "ATL_-1MZJwhRWpmjNduu2oZXZpO4aik1MG-BnQT5K5ugsdKeqzWCb6svJt5LZf6LsxGma23HecRVvweVeZJzKVDBDmceFP_fLB4uWk_ILyNJbkIYTHGbc_ixfxx0pl7oqAOmE2E2Vhbdudt4dgPBiN7wiOrltXZIqZort6tlWJIEdqG_Dvl6ysR8AA8LXriy.jpeg";
    }
            booksSection.innerHTML += `
                <div class="book-card"
                  onclick="window.location.href='book.html?title=${book.title}&author=${book.author}&price=${book.price}&category=${book.category}&image=${imageName}'">
                    <img src="${imageName}" alt="${book.title}">
                    <h3>${book.title}</h3>
                    <p>${book.author}</p>
                    <p>₹${book.price}</p>
                    <p>${book.category}</p>
                    <button onclick="addToCart('${book.title}', ${book.price})">
                        Add To Cart
                    </button>
                    <button onclick="addToWishlist('${book.title}')">
                       ❤️ Wishlist
                   </button> 
                </div>
            `;
        });

    } catch (error) {
        console.error(error);
    }
}

loadBooks();

function searchBook() {
    let searchText = document.getElementById("searchBox").value.toLowerCase();

    let cards = document.querySelectorAll(".book-card");

    cards.forEach(card => {
        let title = card.querySelector("h3").innerText.toLowerCase();

        if (title.includes(searchText)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

function addToCart(bookName, price) {

    cart.push({
        name: bookName,
        price: price
    });

    total += price;

    document.getElementById("cartCount").innerText =
        "🛒 Cart: " + cart.length;

    let cartItems =
        document.getElementById("cartItems");

    cartItems.innerHTML += `
    <p id="${bookName}">
        ${bookName} - ₹${price}
        <button onclick="removeFromCart('${bookName}', ${price})">
            ❌
        </button>
    </p>
`;

    document.getElementById("totalPrice").innerText =
        "Total: ₹" + total;
}
function removeFromCart(bookName, price) {

    let item = document.getElementById(bookName);

    if(item){
        item.remove();
    }

    total -= price;

    if(total < 0){
        total = 0;
    }

    cart.pop();

    document.getElementById("cartCount").innerText =
        "🛒 Cart: " + cart.length;

    document.getElementById("totalPrice").innerText =
        "Total: ₹" + total;
}
document.querySelector("#contact button")
.addEventListener("click", function () {

    let name = document.querySelector('#contact input[type="text"]').value;
    let email = document.querySelector('#contact input[type="email"]').value;

    if (name === "" || email === "") {
        alert("Please fill all fields");
    } else {
        alert("Thank You! We will contact you soon.");
    }
});
let userName = localStorage.getItem("name");

if(userName){
    document.getElementById("welcomeUser").innerText =
        "Welcome, " + userName;
}

function logout(){

    localStorage.clear();

    alert("Logged Out Successfully");

    window.location.href = "login.html";
}
function addToWishlist(bookName){

    wishlist.push(bookName);

    let wishlistItems =
        document.getElementById("wishlistItems");

    wishlistItems.innerHTML += `
        <p>${bookName}</p>
    `;

    alert(bookName + " Added To Wishlist ❤️");
}
document.getElementById("darkModeBtn")
.addEventListener("click", function(){

    document.body.classList.toggle("dark-mode");

});
async function placeOrder() {

    let order = {
        title: "Book Order",
        quantity: cart.length,
        total: total
    };

    const response =
        await fetch(
            "http://localhost:3000/api/orders",
            {
                method: "POST",
                headers: {
                    "Content-Type":
                    "application/json"
                },
                body: JSON.stringify(order)
            }
        );

    const data =
        await response.json();

    alert(data.message);
}
function addReview(bookTitle){

    let reviewText =
        document.getElementById(
            `review-${bookTitle}`
        ).value;

    if(reviewText === ""){
        alert("Enter Review");
        return;
    }

    if(!ratings[bookTitle]){
        ratings[bookTitle] = 0;
    }

    ratings[bookTitle]++;

    let reviewDiv =
        document.getElementById(
            `reviews-${bookTitle}`
        );

    reviewDiv.innerHTML += `
        <p>⭐ ${reviewText}</p>
    `;

    document.getElementById(
        `review-${bookTitle}`
    ).value = "";

    document.getElementById(
        `ratingCount-${bookTitle}`
    ).innerText =
        "Reviews: " + ratings[bookTitle];
}
