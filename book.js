const params =
    new URLSearchParams(window.location.search);

document.getElementById("bookTitle").innerText =
    params.get("title");

document.getElementById("bookAuthor").innerText =
    "Author: " + params.get("author");

document.getElementById("bookPrice").innerText =
    "Price: ₹" + params.get("price");

document.getElementById("bookCategory").innerText =
    "Category: " + params.get("category");

document.getElementById("bookImage").src =
    params.get("image");