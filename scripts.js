document.addEventListener('DOMContentLoaded', () => {
    loadCustomers();
    loadCustomerNamesForSales();
    loadSales();
    addCustomerEventListeners();
});

function showTab(tabName) {
    let tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.style.display = 'none';
    });
    document.getElementById(tabName).style.display = 'block';
}

function addCustomer() {
    let customers = JSON.parse(localStorage.getItem('customers')) || [];
    let customer = {
        customerNumber: customers.length + 1,
        customerName: document.getElementById('customerName').value,
        category: document.getElementById('category').value,
        contactPerson: document.getElementById('contactPerson').value,
        tinNumber: document.getElementById('tinNumber').value,
        street: document.getElementById('street').value,
        barangay: document.getElementById('barangay').value,
        city: document.getElementById('city').value,
        email: document.getElementById('email').value,
        contactNumber: document.getElementById('contactNumber').value,
        pricePerBottle: document.getElementById('pricePerBottle').value,
        status: document.getElementById('status').value
    };
    customers.push(customer);
    localStorage.setItem('customers', JSON.stringify(customers));
    clearCustomerForm();
    loadCustomers();
    alert('Customer added successfully!');
}

function clearCustomerForm() {
    document.getElementById('customerFormElement').reset();
}

function loadCustomers() {
    let customers = JSON.parse(localStorage.getItem('customers')) || [];
    let customerTableBody = document.querySelector('#customerTable tbody');
    customerTableBody.innerHTML = '';
    customers.forEach(customer => {
        let row = document.createElement('tr');
        row.innerHTML = `
            <td>${customer.customerNumber}</td>
            <td>${customer.customerName}</td>
            <td>${customer.category}</td>
            <td>${customer.contactPerson || ''}</td>
            <td>${customer.tinNumber}</td>
            <td>${customer.street}</td>
            <td>${customer.barangay}</td>
            <td>${customer.city}</td>
            <td>${customer.email}</td>
            <td>${customer.contactNumber}</td>
            <td>${customer.pricePerBottle}</td>
            <td class="${customer.status === 'Non-Active' ? 'non-active' : ''}">${customer.status}</td>
            <td class="no-print">
                <button onclick="deleteCustomer(${customer.customerNumber})">Delete</button>
                <button onclick="showMap('${customer.street}', '${customer.barangay}', '${customer.city}')">Show Map</button>
            </td>
        `;
        customerTableBody.appendChild(row);
    });
}

function deleteCustomer(customerNumber) {
    let customers = JSON.parse(localStorage.getItem('customers')) || [];
    customers = customers.filter(customer => customer.customerNumber !== customerNumber);
    localStorage.setItem('customers', JSON.stringify(customers));
    loadCustomers();
}

function showMap(street, barangay, city) {
    let address = `${street}, ${barangay}, ${city}`;
    let mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(mapUrl, '_blank');
}

function addCustomerEventListeners() {
    document.getElementById('category').addEventListener('change', function() {
        let contactPersonDiv = document.getElementById('contactPersonDiv');
        if (this.value === 'Commercial' || this.value === 'Industrial' || this.value === 'Government') {
            contactPersonDiv.style.display = 'block';
        } else {
            contactPersonDiv.style.display = 'none';
        }
    });
}

function loadCustomerNamesForSales() {
    let customers = JSON.parse(localStorage.getItem('customers')) || [];
    let salesCustomerName = document.getElementById('salesCustomerName');
    salesCustomerName.innerHTML = '<option value="">Select Customer</option>';
    customers.forEach(customer => {
        let option = document.createElement('option');
        option.value = customer.customerName;
        option.textContent = customer.customerName;
        salesCustomerName.appendChild(option);
    });
}

function addSales() {
    let sales = JSON.parse(localStorage.getItem('sales')) || [];
    let sale = {
        date: document.getElementById('salesDate').value,
        orderSlip: document.getElementById('orderSlip').value,
        orNumber: document.getElementById('orNumber').value,
        drNumber: document.getElementById('drNumber').value,
        qrCode: document.getElementById('qrCode').value,
        customerName: document.getElementById('salesCustomerName').value,
        // PricePerBottle
        pricePerBottle: document.getElementById('salesPricePerBottle').value, 
        slim: document.getElementById('slim').value,
        round: document.getElementById('round').value,
        otherItems: document.getElementById('otherItems').value,
        cashSales: document.getElementById('cashSales').value,
        accountReceivable: document.getElementById('accountReceivable').value,
        totalSales: document.getElementById('totalSales').value,
        remarks: document.getElementById('remarks').value
    };
    sales.push(sale);
    localStorage.setItem('sales', JSON.stringify(sales));
    clearSalesForm();
    loadSales();
    alert('Sales added successfully!');
    location.reload(); // Refresh page after adding sales
}

// calculate sales

function calculateSales() {
    let pricePerBottleText = document.getElementById('salesPricePerBottle').value;
    let pricePerBottle = (pricePerBottleText === "30/100") ? 100 : parseFloat(pricePerBottleText);
    let slim = parseFloat(document.getElementById('slim').value) || 0;
    let round = parseFloat(document.getElementById('round').value) || 0;
    let otherItems = parseFloat(document.getElementById('otherItems').value) || 0;
    
    let totalBottles = slim + round + otherItems;
    let cashSales;
    
    if (pricePerBottleText === "30/100") {
        cashSales = Math.floor(totalBottles / 3) * 100 + (totalBottles % 3) * (pricePerBottle / 3);
    } else {
        cashSales = pricePerBottle * totalBottles;
    }
    
    document.getElementById('cashSales').value = cashSales.toFixed(2);
    let accountReceivable = parseFloat(document.getElementById('accountReceivable').value) || 0;
    document.getElementById('totalSales').value = (cashSales + accountReceivable).toFixed(2);
}

// calculate sales fin


function clearSalesForm() {
    document.getElementById('salesFormElement').reset();
}

// new load sales
function loadSales() {
    let sales = JSON.parse(localStorage.getItem('sales')) || [];
    
    // Sort sales in descending order by date
    sales.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    let salesTableBody = document.querySelector('#salesTable tbody');
    salesTableBody.innerHTML = '';
    
    sales.forEach(sale => {
        let row = document.createElement('tr');
        row.innerHTML = `
            <td>${sale.date}</td>
            <td>${sale.orderSlip}</td>
            <td>${sale.orNumber}</td>
            <td>${sale.drNumber}</td>
            <td>${sale.qrCode}</td>
            <td>${sale.customerName}</td>
            <td>${sale.pricePerBottle}</td>
            <td>${sale.slim}</td>
            <td>${sale.round}</td>
            <td>${sale.otherItems}</td>
            <td>${sale.cashSales}</td>
            <td>${sale.accountReceivable}</td>
            <td>${sale.totalSales}</td>
            <td>${sale.remarks}</td>
            <td class="no-print">
                <button onclick="deleteSales('${sale.date}', '${sale.customerName}')">Delete</button>
            </td>
        `;
        salesTableBody.appendChild(row);
    });
}


function deleteSales(date, customerName) {
    let sales = JSON.parse(localStorage.getItem('sales')) || [];
    sales = sales.filter(sale => sale.date !== date || sale.customerName !== customerName);
    localStorage.setItem('sales', JSON.stringify(sales));
    loadSales();
}

function printCustomerReport() {
    window.print();
}

function printSalesReport() {
    window.print();
}

// add costumer 
document.getElementById('salesCustomerName').addEventListener('change', (event) => {
    let customerName = event.target.value;
    let customers = JSON.parse(localStorage.getItem('customers')) || [];
    let customer = customers.find(c => c.customerName === customerName);
    document.getElementById('salesPricePerBottle').value = customer.pricePerBottle;
    calculateSales(); // Recalculate sales when customer changes
});

['slim', 'round', 'otherItems', 'accountReceivable'].forEach(id => {
    document.getElementById(id).addEventListener('input', calculateSales);
});

// qrcode
document.getElementById('startScan').addEventListener('click', function() {
    const qrCodeReader = new Html5Qrcode("qr-reader");

    qrCodeReader.start(
        { facingMode: "environment" }, // Use the back camera
        {
            fps: 10, // Frames per second
            qrbox: 250 // QR scanning box
        },
        (decodedText, decodedResult) => {
            // Handle the scanned QR code data
            document.getElementById('qrCode').value = decodedText;
            qrCodeReader.stop(); // Stop scanning after successful read
        },
        (errorMessage) => {
            // Handle errors
            console.warn(errorMessage);
        }
    ).catch((err) => {
        console.error(err);
    });
});
