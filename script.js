
document.getElementById("add_item").addEventListener('click', function(){
    const newItem = document.createElement("div");
    const itemDiv = document.getElementById("items");
    newItem.classList.add("item");  // Add the "item" class
    newItem.innerHTML = `
        <input type="text" placeholder="item name" class="Item_name" required>
        <input type="number" placeholder="quantity" class="quan" required>
        <input type="number" placeholder="price" class="price" required>
    `;
    itemDiv.appendChild(newItem); // Append the new item
});

document.getElementById('invoiceform').addEventListener("submit", function(event){
    event.preventDefault();
    console.log("form submitted")

    const customer_name = document.getElementById("cus_name").value;
    const invoice_date = document.getElementById("invoice_date").value; // Fix the selector here

    const items = document.querySelectorAll(".item");
    let total_amount = 0; // Initialize total amount correctly

    const invoicetableBody = document.querySelector("#invoicetable tbody");
    invoicetableBody.innerHTML = ""; // Clear previous table content

    items.forEach(function(item){
        const item_name = item.querySelector(".Item_name").value; // Fix class name here
        const quantity = item.querySelector(".quan").value;
        const price = item.querySelector(".price").value; 
        const delete_btn = document.getElementById('deleteBtn');
        const item_total = quantity * price;

        const row = `
            <tr>
                <td>${item_name}</td>
                <td>${quantity}</td>
                <td>${price}</td>
                <td class="item_total">${item_total}</td>
                 <td><button class="deleteBtn">Delete</button></td>
            </tr>
        `;
        invoicetableBody.innerHTML += row;
        total_amount += item_total;
    });

    document.getElementById("Customer").innerText = `Customer: ${customer_name}`;
    document.getElementById("inv_date").innerText = `Date: ${invoice_date}`;
    
    document.getElementById("invoice_output").style.display = "block"; // Display the invoice
    
    document.querySelectorAll('.deleteBtn').forEach(function(button) {
        button.addEventListener('click', function() {
            const row = this.closest('tr');  // Get the closest table row
            const item_total = parseFloat(row.querySelector('.item_total').textContent);  // Get the total for the row
            total_amount -= item_total;  // Subtract the row's total from the overall total
            row.remove();  // Remove the row
            document.getElementById("totalAmount").innerText = total_amount.toFixed(2);  // Update total amount display
        });
    });
    document.getElementById("totalAmount").innerText = total_amount.toFixed(2);
});


// generate invoice pdf 
document.getElementById('generate_pdf').addEventListener('click', function () {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const customer_name = document.getElementById("cus_name").value;
    const invoice_date = document.getElementById("invoice_date").value;
    const items = document.querySelectorAll("#invoicetable tbody tr");
    let total_amount = document.getElementById("totalAmount").innerText;

    // Add invoice header
    doc.setFontSize(16);
    doc.text('Invoice', 105, 20, null, null, 'center');
    doc.setFontSize(12);
    doc.text(`Customer: ${customer_name}`, 20, 30);
    doc.text(`Date: ${invoice_date}`, 20, 40);

    // Add table headers
    doc.text('Item', 20, 60);
    doc.text('Quantity', 70, 60);
    doc.text('Price', 120, 60);
    doc.text('Total', 170, 60);

    let y = 70;
    items.forEach(function (item) {
        const item_name = item.querySelector('td:nth-child(1)').textContent;
        const quantity = item.querySelector('td:nth-child(2)').textContent;
        const price = item.querySelector('td:nth-child(3)').textContent;
        const item_total = item.querySelector('td:nth-child(4)').textContent;

        // Add item details to PDF
        doc.text(item_name, 20, y);
        doc.text(quantity, 70, y);
        doc.text(price, 120, y);
        doc.text(item_total, 170, y);
        y += 10;  // Move to the next row
    });

    // Add total amount
    doc.text(`Total Amount: ${total_amount}`, 20, y + 10);

    // Save the PDF
    doc.save('invoice.pdf');
});
