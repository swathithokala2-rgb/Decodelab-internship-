async function resetPassword() {

    const data = {
        email: document.getElementById("email").value,
        password: document.getElementById("newPassword").value
    };

    const response = await fetch(
        "http://localhost:3000/api/forgot-password",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
    );

    const result = await response.json();

    alert(result.message);

    if(response.ok){
        window.location.href = "login.html";
    }
}