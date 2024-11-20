//Attatching an event listener to the submit button 
//to prevent the default reloading page when submit is clicked
let submitbtn = document.getElementById("submitbtn") 

submitbtn.addEventListener("click", function(event){
    event.preventDefault();
})

const prices = {
    aspirin: 10,
    ibuprofen: 12,
    naproxen: 15,
    tylenol: 8,
    morphine: 25,
    codeine: 20,
    amoxicillin: 18,
    penicillin: 16,
    fluoxetine: 22,
    sertraline: 24,
    diphenhydramine: 10,
    loratadine: 8,
    cetirizine: 9,
    amlodipine: 18,
    lisinopril: 20,
    losartan: 22,
};

//Gather form data-- Access the values of the input fields
//Create an array or object to store the selected items and their quantities
const formData = new FormData(event.target);
const selectedItems = {};
for (const [key, value] of formData.entries()) {
  if (value > 0) {
    selectedItems[key] = parseInt(value);
  }
}

// Calculate total cost
let totalCost = 0;
for (const item in selectedItems) {
  totalCost += prices[item] * selectedItems[item];
}

const orderSummary = document.getElementById('orderSummary');

for (const item in selectedItems) {
    const quantity = selectedItems[item];
    const price = prices[item];
    orderSummary.innerHTML += `
        <tr>
          <td>${item}</td>
          <td>${quantity}</td>
          <td>$${price * quantity}</td>
        </tr>
    `;
  }

  orderSummary.innerHTML += `
        <tr>
          <td colspan="2">Total</td>
          <td>$${totalCost}</td>
        </tr>
      </tbody>
    </table>
  `;

