document.addEventListener("DOMContentLoaded", () => {
  const cardDetails = document.getElementById("cardDetails");
  const deliveryAddress = document.getElementById("deliveryAddress");
  const form = document.getElementById("checkoutForm");
  if (!form) {
    console.error("Form element not found");
    return;
  }

  const cardNumberInput = document.getElementById("cardNumber");
  const expiryDateInput = document.getElementById("expiryDate");
  const cvvInput = document.getElementById("cvv")

  const houseNumInput = document.getElementById("houseNum");
  const streetNameInput = document.getElementById("streetName");
  const cityInput = document.getElementById("city");
  const postCodeInput = document.getElementById("postCode");

  const paymentRadios = Array.from(form.payment);
  const deliveryRadios = Array.from(form.delivery);

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

  // Toggle card details visibility and required attributes
  paymentRadios.forEach(input => {
    input.addEventListener("change", () => {
      if (input.value === "card") {
        cardDetails.classList.remove("hidden");
        cardNumberInput.required = true;
        expiryDateInput.required = true;
        cvvInput.required = true;
      } else {
        cardDetails.classList.add("hidden");
        cardNumberInput.required = false;
        expiryDateInput.required = false;
        cvvInput.required = false; 
      }
    })
  })

  //Toggle delivery address visibility and required attributes
  deliveryRadios.forEach(input => {
    input.addEventListener("change", () => {
      if (input.value === "delivery") {
        deliveryAddress.classList.remove("hidden");
        houseNumInput.required = true;
        streetNameInput.required = true;
        cityInput.required = true;
        postCodeInput.required = true;
      } else {
        deliveryAddress.classList.add("hidden");
        houseNumInput.required = false;
        streetNameInput.required = false;
        cityInput.required = false;
        postCodeInput.required = false;
      }
    })
  })

  // Validate post code format
  postCodeInput.addEventListener("input", () => {
    postCodeInput.value = postCodeInput.value.slice(0, 5);
  });

    // Validate Card Number format (16 digits)
  cardNumberInput.addEventListener("input", () => {
    cardNumberInput.value = cardNumberInput.value.slice(0, 16);
  });

  // Validate CVV Length (3 digits)
  cvvInput.addEventListener("input", () => {
    cvvInput.value = cvvInput.value.slice(0, 3);
  });

  // Form Submission Validation
  form.addEventListener("submit", e => {
    e.preventDefault();
    console.log("Form Submitted")

    // Validate card details if "card" is selected
    const paymentMethod = form.payment.value;
    if (paymentMethod === "card") {
      if (cardNumberInput.value.length !== 16 || !/^\d+$/.test(cardNumberInput.value)) {
        alert("Please enter a valid 16-digit card number.");
        return;
    }
      if (cvvInput.value.length !== 3 || !/^\d+$/.test(cvvInput.value)) {
        alert("Please enter a valid 3-digit CVV.");
        return;
      }
      if (!expiryDateInput.value) {
        alert("Please select an expiry date.");
        return;
      }
    }

    // Validate delivery address id "Delivery" is selected
    const deliveryMethod = form.delivery.value;
    if (deliveryMethod === "delivery") {
      if (!houseNumInput.value.trim() || !streetNameInput.value.trim() || !cityInput.value.trim()) {
        alert("Please fill in all the address fields.");
        return;
      }
      if (!/^\d{5}$/.test(postCodeInput.value)) {
        alert("Please enter a valid 5-digit postal code.");
        return;
      }
    }

  displayConfirmation(paymentMethod, deliveryMethod)


  function displayConfirmation(paymentMethod, deliveryMethod) {
    const formData = new FormData(form);
    const details = Object.fromEntries(formData);
  
    // Display confirmation with order summary
    const confirmationDiv = document.createElement("div");
    confirmationDiv.innerHTML = `
    <div class="payment-confirmation">
        <h2>Payment Confirmation</h2>
        
        <h3>Personal Details</h3>
        <table>
            <tr><th>Name</th><td>${details.name}</td></tr>
            <tr><th>Age</th><td>${details.age}</td></tr>
            <tr><th>Email</th><td>${details.email}</td></tr>
            <tr><th>Contact</th><td>${details.contact}</td></tr>
        </table>
        
        <h3>Payment Method</h3>
        <table>
            <tr><th>Method</th><td>${paymentMethod === "card" ? "Card" : "Cash on Delivery"}</td></tr>
            ${
              paymentMethod === "card"
                ? `<tr><th>Card Number</th><td>${details.cardNumber}</td></tr>
                   <tr><th>Expiry Date</th><td>${details.expiryDate}</td></tr>`
                : ""
            }
        </table>
        
        ${
          deliveryMethod === "delivery"
            ? `<h3>Delivery Address</h3>
               <table>
                 <tr><th>House Number</th><td>${details.houseNum}</td></tr>
                 <tr><th>Street Name</th><td>${details.streetName}</td></tr>
                 <tr><th>City</th><td>${details.city}</td></tr>
                 <tr><th>Postal Code</th><td>${details.postCode}</td></tr>
               </table>`
            : `<h3>Pickup</h3><p>Pickup your order from our store.</p>`
        }
        
        <h3>Order Summary</h3>
        <table class="summary-table">
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
                      </tr>`
                  )
                  .join("")}
                <tr>
                    <td colspan="3"><strong>Total</strong></td>
                    <td><strong>LKR ${total}</strong></td>
                </tr>
            </tbody>
        </table>
  
        <p class="message">Thank you for purchasing from EKA's Online Pharmacy. Your order will be delivered within the next 24 hours!</p>
        
        <button id="returnToPharmacy">Return to Pharmacy</button>
    </div>
  `;
  
    document.body.innerHTML = ""; // Clear the current content
    document.body.appendChild(confirmationDiv);
  
    // Add event listener to return button
    const returnButton = document.getElementById("returnToPharmacy");
    returnButton.addEventListener("click", () => {
      localStorage.removeItem("cart"); // Clear cart data
      window.location.href = "Pharmacy.html";
    });
  }
})  
})
