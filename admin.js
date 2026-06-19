async function addBook() {

    const book = {
    title: document.getElementById("title").value,
    author: document.getElementById("author").value,
    price: Number(document.getElementById("price").value),
    category: document.getElementById("category").value,
    image: document.getElementById("image").value
};

    const response = await fetch(
        "http://localhost:3000/api/books",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(book)
        }
    );

    const data = await response.json();

    alert(data.message);
}