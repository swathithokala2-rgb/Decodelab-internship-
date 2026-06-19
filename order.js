async function loadOrders() {

    const response =
        await fetch("http://localhost:3000/api/orders");

    const orders =
        await response.json();

    const ordersDiv =
        document.getElementById("orders");

    ordersDiv.innerHTML = "";

    orders.forEach(order => {

        ordersDiv.innerHTML += `
            <div class="book-card">
                <h3>${order.title}</h3>
                <p>Quantity: ${order.quantity}</p>
                <p>Total: ₹${order.total}</p>
                 <a href="http://localhost:3000/api/invoice/${order._id}">
            Download Invoice
        </a>
            </div>
        `;
    });
}

loadOrders();