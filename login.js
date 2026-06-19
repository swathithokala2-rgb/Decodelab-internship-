async function login() {

    const user = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    const response = await fetch(
        "http://localhost:3000/api/login",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        }
    );

    const data = await response.json();

    if (response.ok) {

        localStorage.setItem("name", data.name);

        alert(data.message);

        window.location.href = "project_1.html";

    } else {

        alert(data.message);
    }
}