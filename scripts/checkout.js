document.addEventListener("DOMContentLoaded", () => {
    const cardDetails = document.getElementById("cardDetails");
    const deliveryAddress = document.getElementById("deliveryAddress");
    const form = document.getElementById("checkoutForm");
    const summaryTable = document.getElementById("summaryTable").querySelector("tbody");
  
    // Load order summary from localStorage
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    let total = 0;
  
    if (cart.length === 0) {
      const emptyMessage = document.createElement("p");
      emptyMessage.textContent = "Your cart is empty.";
      summaryTable.parentElement.replaceWith(emptyMessage);
    } else {
      cart.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${item.name}</td>
          <td>${item.qty}</td>
          <td>LKR ${item.price}</td>
          <td>LKR ${item.totalPrice}</td>
        `;
        summaryTable.appendChild(row);
        total += item.totalPrice;
      });
  
      const totalRow = document.createElement("tr");
      totalRow.innerHTML = `
        <td colspan="3"><strong>Total</strong></td>
        <td><strong>LKR ${total}</strong></td>
      `;
      summaryTable.appendChild(totalRow);
    }
  
    // Toggle card details when payment method changes
    Array.from(form.payment).forEach(input => {
      input.addEventListener("change", () => {
        cardDetails.classList.toggle("hidden", input.value !== "card");
      });
    });
  
    // Toggle delivery address when delivery method changes
    Array.from(form.delivery).forEach(input => {
      input.addEventListener("change", () => {
        deliveryAddress.classList.toggle("hidden", input.value !== "delivery");
      });
    });
  
    // Handle form submission
    form.addEventListener("submit", e => {
      e.preventDefault();
  
      const formData = new FormData(form);
      const details = Object.fromEntries(formData);
      const paymentMethod = details.payment === "card" ? "Card" : "Cash on Delivery";
      const deliveryMethod = details.delivery === "pickup" ? "Pickup" : "Delivery";
  
      // Display confirmation with order summary
      const confirmationDiv = document.createElement("div");
      confirmationDiv.innerHTML = `
        <h2>Payment Confirmation</h2>
        <h3>Personal Details</h3>
        <p><strong>Name:</strong> ${details.name}</p>
        <p><strong>Age:</strong> ${details.age}</p>
        <p><strong>Email:</strong> ${details.email}</p>
        <p><strong>Contact:</strong> ${details.contact}</p>
  
        <h3>Payment Method</h3>
        <p>${paymentMethod}</p>
        ${
          paymentMethod === "Card"
            ? `<p><strong>Card Number:</strong> ${details.cardNumber}</p>
               <p><strong>Expiry Date:</strong> ${details.expiryDate}</p>`
            : ""
        }
  
        <h3>Delivery Method</h3>
        <p>${deliveryMethod}</p>
        ${
          deliveryMethod === "Delivery"
            ? `<p><strong>Address:</strong> ${details.address}</p>`
            : ""
        }
  
        <h3>Order Summary</h3>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${cart
              .map(
                item => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.qty}</td>
                    <td>LKR ${item.price}</td>
                    <td>LKR ${item.totalPrice}</td>
                  </tr>
                `
              )
              .join("")}
            <tr>
              <td colspan="3"><strong>Total</strong></td>
              <td><strong>LKR ${total}</strong></td>
            </tr>
          </tbody>
        </table>
  
        <button id="returnToPharmacy">Return to Pharmacy</button>
      `;
  
      document.body.innerHTML = "";
      document.body.appendChild(confirmationDiv);
  
      // Add event listener to return button
      const returnButton = document.getElementById("returnToPharmacy");
      returnButton.addEventListener("click", () => {
        localStorage.removeItem("cart"); // Clear cart data
        window.location.href = "Pharmacy.html";
      });
    });
  });
  