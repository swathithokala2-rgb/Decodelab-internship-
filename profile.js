let name = localStorage.getItem("name");
let email = localStorage.getItem("email");

document.getElementById("profileName").innerText =
    "Name: " + (name || "Guest");

document.getElementById("profileEmail").innerText =
    "Email: " + (email || "Not Available");

function logout(){

    localStorage.clear();

    alert("Logged Out Successfully");

    window.location.href = "login.html";
}