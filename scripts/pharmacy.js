let cart = [];
// let favorites = JSON.parse(localStorage.getItem("favorites"));

document.addEventListener('DOMContentLoaded', function () { //Runs the code inside the function when the HTML content is fully loaded
  loadMedicines();
  document.getElementById("buyNow").addEventListener("click", buyNow);
  document.getElementById("addToFavorites").addEventListener("click", addToFavorites);
  document.getElementById("applyFavorites").addEventListener("click", applyFavorites);
});


// => is a shorthand way to write a function

function loadMedicines() { //Defines the function
  fetch('medicines.json') //Sends HTTP request to fetch data from medicines.json
    .then(response => response.json())//Processes the response from the fetch call, and converts it to a json object
    .then(data => { //After its converted to a json object, pass the fetched data to a parameter 'data'
      let container = document.getElementById("medicines"); //iterates over the keys of the first object in the data array (the medicines object)
      Object.keys(data[0]).forEach(category => { //Iterates over the keys of the first object in the data array 
        let section = document.createElement('div'); //Creates a new div element that will hold the medicines for a specific category
        section.innerHTML = `<h3>${category.charAt(0).toUpperCase() + category.slice(1)}</h3>`; //Sets the html content of the section <div> to include an h3 header- the category name is displayed with its first letter capitalised  

        data[0][category].forEach(item => { //Iterates through the array of medicines 
          let medicineDiv = document.createElement('div'); //Creates a div element that will hold the details of a single medicine
          medicineDiv.classList.add('medicine'); //Adds a class named medicine to the medicineDiv for styling with css
          medicineDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <h4>${item.name}</h4>
            <p>Price: LKR ${item.price}</p>
            <input type="number" id="qty-${item.name}" value="1" min="1">
            <button onclick="addToCart('${item.name}', ${item.price})">Add to Cart</button>
          `;
          section.appendChild(medicineDiv);
          //medicineDiv holds the details of each medicine
          //section holds all the medicines for one category
          //appendChild puts the smaller box (medicineDiv) into the larger box (section)
        });

        container.appendChild(section);
        //container is the HTML element with the ID "medicines"-- The main box that will hold everything
        //section contains all the medicine boxes for a single category 
        //appendChild puts the entire section into the container
      });
    })
    .catch(error => {
      console.error('Error fetching medicines:', error);
      //If something goes wrong while fetching the json file or processing the data
      //The error message will be printed on the console
    });
}

function addToCart(name, price) {
  let qty = document.getElementById(`qty-${name}`).value; //finds the qty input field for the selected medicine using its unique ID and retrieves the value entered by the user
  let totalPrice = price * qty;
  let item = { name, price, qty, totalPrice }; //An object 'item' represents the selected medicine and its details

  // Check if the item is already in the cart and update it
  let existingItem = cart.find(cartItem => cartItem.name === name); //
  if (existingItem) {
    existingItem.qty += parseInt(qty);
    existingItem.totalPrice = existingItem.qty * existingItem.price;
  } else {
    cart.push(item);
  }

  updateOrderSummary();
}

function updateOrderSummary() {
  let tableBody = document.querySelector("#orderSummary tbody");
  tableBody.innerHTML = "";
  let totalAmount = 0;

  cart.forEach((item, index) => {
    let row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.name}</td>
      <td>LKR ${item.price}</td>
      <td>${item.qty}</td>
      <td>LKR ${item.totalPrice}</td>
      <td><button onclick="removeFromCart(${index})">Remove</button></td>
    `;
    tableBody.appendChild(row);
    totalAmount += item.totalPrice;
  });

  let totalRow = document.createElement('tr');
  totalRow.innerHTML = `
    <td colspan="3"><strong>Total</strong></td>
    <td><strong>LKR ${totalAmount}</strong></td>
  `;
  tableBody.appendChild(totalRow);
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateOrderSummary();
}

function buyNow() {
  // Implement logic to redirect to checkout.html and pass cart data
  localStorage.setItem('cart', JSON.stringify(cart));
  window.location.href = 'checkout.html';
}

function addToFavorites() {
  if (cart.length > 0) {
    localStorage.setItem("favorites", JSON.stringify(cart));
    alert("Order added to favorites!");
  } else {
    alert("Your cart is empty. Add items before saving to favorites.");
  }
}

function applyFavorites() {
  if (favorites.length > 0) {
    cart = [...favorites];
    updateOrderSummary();
    alert("Favorites applied!");
  } else {
    alert("No favorites found.");
  }
}