// ===== CONFIGURATION =====
const INVOICE_PREFIX = "SMPT-"; // Configurable prefix
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxqvas8KRo9oJ4zsdgVUUmOK60YIEDX67DyqUjfDrWWNyGDTl21DebtJ3LivJdPNh7S/exec"; // Replace with your Google Apps Script URL

// Default configuration
const DEFAULT_CONFIG = {
    shopName: "SM PRINT TECHNOLOGY",
    propName: "Sohag Maih",
    mobile: "+8801710-097025",
    address1: "Inathaganj Poschim Bazar",
    address2: "Nabiganj, Habiganj",
    currency: "$"
};

// STAMP IMAGE PATHS - Use ONLINE URLs to avoid CORS issues with PNG export
const STAMP_IMAGES = {
    paid: "https://i.ibb.co.com/0VZn80dp/Paid.png",      // Replace with your online paid stamp URL
    unpaid: "https://i.ibb.co.com/1YGLghmB/Unpaid.png"   // Replace with your online unpaid stamp URL
};

// ✅ RECOMMENDED: Upload your stamp images to free image hosting:
// - ImgBB (https://imgbb.com) - Free, unlimited bandwidth
// - Imgur (https://imgur.com) - Popular, reliable
// - Cloudinary (https://cloudinary.com) - Professional option
// 
// ⚠️ IMPORTANT: Use HTTPS URLs for security
// ⚠️ Make sure images have transparent backgrounds (PNG format)
//
// Example with ImgBB:
// paid: "https://i.ibb.co/abc123/paid-stamp.png"
// unpaid: "https://i.ibb.co/xyz789/unpaid-stamp.png"
//
// ❌ AVOID: Local file paths cause CORS issues with PNG export
// paid: "stamps/paid-stamp.png"  // This will fail PNG export!

// Load configuration from localStorage or use defaults
function loadConfig() {
    const savedConfig = localStorage.getItem('shopConfig');
    if (savedConfig) {
        return JSON.parse(savedConfig);
    }
    return { ...DEFAULT_CONFIG };
}

// Save configuration to localStorage
function saveConfig(config) {
    localStorage.setItem('shopConfig', JSON.stringify(config));
}

let shopConfig = loadConfig();

// ===== STATE MANAGEMENT =====
let invoiceData = {
    invoiceNumber: '',
    date: '',
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    items: [],
    netTotal: 0,
    paidAmount: 0,
    advanceAmount: 0,
    dueAmount: 0,
    paymentStatus: ''
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeInvoice();
    attachEventListeners();
    addInitialItem();
});

// Initialize invoice with auto-generated number and date
function initializeInvoice() {
    // Set invoice number
    const invoiceNumber = generateInvoiceNumber();
    document.getElementById('invoiceNumber').value = invoiceNumber;
    invoiceData.invoiceNumber = invoiceNumber;

    // Set today's date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('invoiceDate').value = today;
    invoiceData.date = today;
}

// Generate auto-incremented invoice number
function generateInvoiceNumber() {
    let counter = localStorage.getItem('invoiceCounter');
    if (!counter) {
        counter = 1;
    } else {
        counter = parseInt(counter);
    }
    
    const invoiceNumber = INVOICE_PREFIX + String(counter).padStart(4, '0');
    return invoiceNumber;
}

// Increment and save invoice counter
function incrementInvoiceCounter() {
    let counter = localStorage.getItem('invoiceCounter');
    if (!counter) {
        counter = 1;
    } else {
        counter = parseInt(counter) + 1;
    }
    localStorage.setItem('invoiceCounter', counter);
}

// ===== EVENT LISTENERS =====
function attachEventListeners() {
    // Configuration buttons
    document.getElementById('openConfigBtn').addEventListener('click', openConfiguration);
    document.getElementById('saveConfigBtn').addEventListener('click', saveConfiguration);
    document.getElementById('cancelConfigBtn').addEventListener('click', closeConfiguration);

    // Add item button
    document.getElementById('addItemBtn').addEventListener('click', addItem);

    // Generate invoice button
    document.getElementById('generateBtn').addEventListener('click', generateInvoice);

    // Payment status radio buttons
    const paymentRadios = document.querySelectorAll('input[name="paymentStatus"]');
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', handlePaymentStatusChange);
    });

    // Finalize invoice button
    document.getElementById('finalizeBtn').addEventListener('click', finalizeInvoice);

    // Action buttons
    document.getElementById('printBtn').addEventListener('click', printInvoice);
    document.getElementById('saveToSheetBtn').addEventListener('click', saveToGoogleSheet);
    document.getElementById('newInvoiceBtn').addEventListener('click', createNewInvoice);
    
    // Download dropdown
    document.getElementById('downloadAsBtn').addEventListener('click', toggleDownloadOptions);
    document.querySelectorAll('.download-option').forEach(option => {
        option.addEventListener('click', handleDownloadOption);
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
        const dropdown = document.querySelector('.download-dropdown');
        if (dropdown && !dropdown.contains(event.target)) {
            document.getElementById('downloadOptions').classList.remove('show');
        }
    });
}

// ===== DOWNLOAD DROPDOWN =====
function toggleDownloadOptions(event) {
    event.stopPropagation();
    document.getElementById('downloadOptions').classList.toggle('show');
}

function handleDownloadOption(event) {
    const format = event.target.getAttribute('data-format');
    document.getElementById('downloadOptions').classList.remove('show');
    
    if (format === 'pdf') {
        downloadPDF();
    } else if (format === 'png') {
        downloadPNG();
    }
}

// ===== CONFIGURATION MANAGEMENT =====
function openConfiguration() {
    // Populate configuration form with current values
    document.getElementById('configShopName').value = shopConfig.shopName;
    document.getElementById('configPropName').value = shopConfig.propName;
    document.getElementById('configMobile').value = shopConfig.mobile;
    document.getElementById('configAddress1').value = shopConfig.address1;
    document.getElementById('configAddress2').value = shopConfig.address2;
    document.getElementById('configCurrency').value = shopConfig.currency;

    // Show config panel, hide form
    document.getElementById('configPanel').style.display = 'block';
    document.getElementById('invoiceForm').style.display = 'none';
}

function saveConfiguration() {
    // Get values from form
    shopConfig.shopName = document.getElementById('configShopName').value.trim() || DEFAULT_CONFIG.shopName;
    shopConfig.propName = document.getElementById('configPropName').value.trim() || DEFAULT_CONFIG.propName;
    shopConfig.mobile = document.getElementById('configMobile').value.trim() || DEFAULT_CONFIG.mobile;
    shopConfig.address1 = document.getElementById('configAddress1').value.trim() || DEFAULT_CONFIG.address1;
    shopConfig.address2 = document.getElementById('configAddress2').value.trim() || DEFAULT_CONFIG.address2;
    shopConfig.currency = document.getElementById('configCurrency').value.trim() || DEFAULT_CONFIG.currency;

    // Save to localStorage
    saveConfig(shopConfig);

    // Show success message
    alert('Configuration saved successfully!');

    // Close configuration panel
    closeConfiguration();
}

function closeConfiguration() {
    document.getElementById('configPanel').style.display = 'none';
    document.getElementById('invoiceForm').style.display = 'block';
}

// ===== ITEMS MANAGEMENT =====
function addItem() {
    const tableBody = document.getElementById('itemsTableBody');
    const row = document.createElement('tr');
    
    row.innerHTML = `
        <td><input type="text" class="item-description" placeholder="Item description"></td>
        <td><input type="number" class="item-quantity" placeholder="0" min="0" step="1" value="1"></td>
        <td><input type="number" class="item-rate" placeholder="0.00" min="0" step="0.01" value="0"></td>
        <td class="item-amount">৳0.00</td>
        <td><button class="remove-btn" onclick="removeItem(this)">Remove</button></td>
    `;
    
    tableBody.appendChild(row);
    
    // Attach calculation listeners
    const qtyInput = row.querySelector('.item-quantity');
    const rateInput = row.querySelector('.item-rate');
    
    qtyInput.addEventListener('input', calculateRowAmount);
    rateInput.addEventListener('input', calculateRowAmount);
    
    // Prevent negative numbers
    qtyInput.addEventListener('input', preventNegative);
    rateInput.addEventListener('input', preventNegative);
}

function addInitialItem() {
    addItem();
}

function removeItem(button) {
    const row = button.closest('tr');
    const tableBody = document.getElementById('itemsTableBody');
    
    // Keep at least one row
    if (tableBody.children.length > 1) {
        row.remove();
        calculateNetTotal();
    } else {
        alert('At least one item is required.');
    }
}

function preventNegative(event) {
    if (parseFloat(event.target.value) < 0) {
        event.target.value = 0;
    }
}

function calculateRowAmount(event) {
    const row = event.target.closest('tr');
    const qty = parseFloat(row.querySelector('.item-quantity').value) || 0;
    const rate = parseFloat(row.querySelector('.item-rate').value) || 0;
    const amount = qty * rate;
    
    row.querySelector('.item-amount').textContent = shopConfig.currency + amount.toFixed(2);
    
    calculateNetTotal();
}

function calculateNetTotal() {
    const rows = document.querySelectorAll('#itemsTableBody tr');
    let total = 0;
    
    rows.forEach(row => {
        const qty = parseFloat(row.querySelector('.item-quantity').value) || 0;
        const rate = parseFloat(row.querySelector('.item-rate').value) || 0;
        total += qty * rate;
    });
    
    document.getElementById('netTotal').textContent = shopConfig.currency + total.toFixed(2);
    invoiceData.netTotal = total;
}

// ===== VALIDATION =====
function validateForm() {
    let isValid = true;
    
    // Clear previous errors
    document.getElementById('nameError').textContent = '';
    document.getElementById('itemsError').textContent = '';
    
    // Validate customer name
    const customerName = document.getElementById('customerName').value.trim();
    if (!customerName) {
        document.getElementById('nameError').textContent = 'Customer name is required';
        isValid = false;
    }
    
    // Validate items
    const rows = document.querySelectorAll('#itemsTableBody tr');
    let hasValidItem = false;
    
    rows.forEach(row => {
        const description = row.querySelector('.item-description').value.trim();
        const qty = parseFloat(row.querySelector('.item-quantity').value) || 0;
        const rate = parseFloat(row.querySelector('.item-rate').value) || 0;
        
        if (description && qty > 0 && rate > 0) {
            hasValidItem = true;
        }
    });
    
    if (!hasValidItem) {
        document.getElementById('itemsError').textContent = 'At least one valid item is required (with description, quantity > 0, and rate > 0)';
        isValid = false;
    }
    
    return isValid;
}

// ===== GENERATE INVOICE =====
function generateInvoice() {
    if (!validateForm()) {
        return;
    }
    
    // Collect customer data
    invoiceData.customerName = document.getElementById('customerName').value.trim();
    invoiceData.customerPhone = document.getElementById('customerPhone').value.trim();
    invoiceData.customerAddress = document.getElementById('customerAddress').value.trim();
    
    // Collect items data
    invoiceData.items = [];
    const rows = document.querySelectorAll('#itemsTableBody tr');
    
    rows.forEach(row => {
        const description = row.querySelector('.item-description').value.trim();
        const qty = parseFloat(row.querySelector('.item-quantity').value) || 0;
        const rate = parseFloat(row.querySelector('.item-rate').value) || 0;
        
        if (description && qty > 0 && rate > 0) {
            invoiceData.items.push({
                description: description,
                quantity: qty,
                rate: rate,
                amount: qty * rate
            });
        }
    });
    
    // Show payment section
    document.getElementById('paymentSection').style.display = 'block';
    document.getElementById('generateBtn').style.display = 'none';
}

// ===== PAYMENT STATUS HANDLING =====
function handlePaymentStatusChange(event) {
    const status = event.target.value;
    const advanceSection = document.getElementById('advanceSection');
    
    if (status === 'advance') {
        advanceSection.style.display = 'block';
    } else {
        advanceSection.style.display = 'none';
        document.getElementById('advanceAmount').value = '';
    }
}

function finalizeInvoice() {
    const selectedStatus = document.querySelector('input[name="paymentStatus"]:checked');
    
    if (!selectedStatus) {
        alert('Please select a payment status');
        return;
    }
    
    const status = selectedStatus.value;
    invoiceData.paymentStatus = status;
    
    // Clear advance error
    document.getElementById('advanceError').textContent = '';
    
    // Calculate payment amounts based on status
    if (status === 'paid') {
        invoiceData.paidAmount = invoiceData.netTotal;
        invoiceData.advanceAmount = 0;
        invoiceData.dueAmount = 0;
    } else if (status === 'advance') {
        const advanceAmount = parseFloat(document.getElementById('advanceAmount').value) || 0;
        
        // Validate advance amount
        if (advanceAmount <= 0) {
            document.getElementById('advanceError').textContent = 'Please enter a valid advance amount';
            return;
        }
        
        if (advanceAmount > invoiceData.netTotal) {
            document.getElementById('advanceError').textContent = 'Advance amount cannot exceed net total';
            return;
        }
        
        invoiceData.advanceAmount = advanceAmount;
        invoiceData.paidAmount = advanceAmount;
        invoiceData.dueAmount = invoiceData.netTotal - advanceAmount;
    } else if (status === 'unpaid') {
        invoiceData.paidAmount = 0;
        invoiceData.advanceAmount = 0;
        invoiceData.dueAmount = invoiceData.netTotal;
    }
    
    // Increment invoice counter
    incrementInvoiceCounter();
    
    // Display invoice
    displayInvoice();
}

// ===== DISPLAY INVOICE =====
function displayInvoice() {
    // Hide form, show invoice
    document.getElementById('invoiceForm').style.display = 'none';
    document.getElementById('invoiceView').style.display = 'block';
    
    // Populate shop details
    document.getElementById('displayShopName').textContent = shopConfig.shopName;
    document.getElementById('displayPropName').textContent = shopConfig.propName;
    document.getElementById('displayMobile').textContent = shopConfig.mobile;
    document.getElementById('displayAddress1').textContent = shopConfig.address1;
    if (shopConfig.address2) {
        document.getElementById('displayAddress2').textContent = shopConfig.address2;
        document.getElementById('displayAddress2').style.display = 'block';
    } else {
        document.getElementById('displayAddress2').style.display = 'none';
    }
    
    // Populate invoice details
    document.getElementById('displayInvoiceNo').textContent = invoiceData.invoiceNumber;
    document.getElementById('displayDate').textContent = formatDateShort(invoiceData.date);
    
    // Customer details
    document.getElementById('displayCustomerName').textContent = invoiceData.customerName;
    document.getElementById('displayCustomerPhone').textContent = invoiceData.customerPhone;
    
    // Items table
    const itemsBody = document.getElementById('displayItemsBody');
    itemsBody.innerHTML = '';
    
    invoiceData.items.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}.</td>
            <td>${item.description}</td>
            <td>${shopConfig.currency}${item.rate.toFixed(0)}</td>
            <td>${item.quantity}</td>
            <td>${shopConfig.currency}${item.amount.toFixed(0)}</td>
        `;
        itemsBody.appendChild(row);
    });
    
    // Totals section - CORRECTED LOGIC
    document.getElementById('displaySubtotal').textContent = shopConfig.currency + invoiceData.netTotal.toFixed(2);
    
    const paymentStampImage = document.getElementById('paymentStampImage');
    const advanceLine = document.getElementById('displayAdvanceLine');
    const dueLine = document.getElementById('displayDueLine');
    
    // Reset stamp
    paymentStampImage.className = 'payment-stamp-image';
    paymentStampImage.style.display = 'none';
    
    if (invoiceData.paymentStatus === 'paid') {
        // PAID: Show stamp image, hide advance and due, total = subtotal
        paymentStampImage.src = STAMP_IMAGES.paid;
        paymentStampImage.className = 'payment-stamp-image visible';
        paymentStampImage.style.display = 'block';
        advanceLine.style.display = 'none';
        dueLine.style.display = 'none';
        document.getElementById('displayTotalAmount').textContent = shopConfig.currency + invoiceData.netTotal.toFixed(2);
    } else if (invoiceData.paymentStatus === 'advance') {
        // ADVANCE: Show advance and due, no stamp, total = due amount
        advanceLine.style.display = 'grid';
        dueLine.style.display = 'grid';
        document.getElementById('displayAdvanceAmount').textContent = shopConfig.currency + invoiceData.advanceAmount.toFixed(2);
        document.getElementById('displayDueAmount').textContent = shopConfig.currency + invoiceData.dueAmount.toFixed(2);
        document.getElementById('displayTotalAmount').textContent = shopConfig.currency + invoiceData.dueAmount.toFixed(2);
    } else if (invoiceData.paymentStatus === 'unpaid') {
        // UNPAID: Show stamp image, hide advance, show due, total = subtotal
        paymentStampImage.src = STAMP_IMAGES.unpaid;
        paymentStampImage.className = 'payment-stamp-image visible';
        paymentStampImage.style.display = 'block';
        advanceLine.style.display = 'none';
        dueLine.style.display = 'grid';
        document.getElementById('displayDueAmount').textContent = shopConfig.currency + invoiceData.netTotal.toFixed(2);
        document.getElementById('displayTotalAmount').textContent = shopConfig.currency + invoiceData.netTotal.toFixed(2);
    }
    
    // Footer text
    document.getElementById('displayFooterText').textContent = `Thanks for choosing ${shopConfig.shopName}`;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function formatDateShort(dateString) {
    const date = new Date(dateString);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const month = months[date.getMonth()];
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
}

// ===== PRINT INVOICE =====
function printInvoice() {
    window.print();
}

// ===== DOWNLOAD PDF =====
function downloadPDF() {
    // Check if jsPDF is loaded
    if (typeof window.jspdf === 'undefined') {
        alert('PDF library not loaded. Please check your internet connection or use the print option.');
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });
    
    let yPos = 20;
    
    // Header - Two Column Layout
    // Left side - Shop details
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(255, 107, 53);
    doc.text(shopConfig.shopName, 20, yPos);
    
    yPos += 7;
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'normal');
    doc.text('Prop: ' + shopConfig.propName, 20, yPos);
    
    yPos += 5;
    doc.text('Mob: ' + shopConfig.mobile, 20, yPos);
    
    yPos += 5;
    doc.text(shopConfig.address1, 20, yPos);
    
    if (shopConfig.address2) {
        yPos += 5;
        doc.text(shopConfig.address2, 20, yPos);
    }
    
    // Right side - Invoice title
    doc.setFontSize(32);
    doc.setFont(undefined, 'italic');
    doc.text('Invoice', 190, 25, { align: 'right' });
    
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.text('No:', 145, 35);
    doc.setFont(undefined, 'normal');
    doc.text(invoiceData.invoiceNumber, 155, 35);
    
    doc.setFont(undefined, 'bold');
    doc.text('Date:', 145, 40);
    doc.setFont(undefined, 'normal');
    doc.text(formatDateShort(invoiceData.date), 155, 40);
    
    yPos = 50;
    
    // Top divider
    doc.setDrawColor(255, 107, 53);
    doc.setLineWidth(0.5);
    doc.line(20, yPos, 190, yPos);
    
    yPos += 8;
    
    // Customer details
    doc.setFontSize(10);
    doc.setTextColor(229, 57, 53);
    doc.setFont(undefined, 'bold');
    doc.text('Bill To: ', 20, yPos);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'normal');
    doc.text(invoiceData.customerName, 38, yPos);
    
    yPos += 6;
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.text('Mob: ', 20, yPos);
    doc.setFont(undefined, 'normal');
    doc.text(invoiceData.customerPhone, 32, yPos);
    
    yPos += 8;
    
    // Middle divider
    doc.setDrawColor(221, 221, 221);
    doc.setLineWidth(0.3);
    doc.line(20, yPos, 190, yPos);
    
    yPos += 8;
    
    // Items table header
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('No', 20, yPos);
    doc.text('Description', 35, yPos);
    doc.text('Rate', 120, yPos);
    doc.text('Qty', 145, yPos);
    doc.text('Total', 170, yPos);
    
    yPos += 2;
    doc.setDrawColor(0, 188, 212);
    doc.setLineWidth(0.5);
    doc.line(20, yPos, 190, yPos);
    
    yPos += 7;
    
    // Items
    doc.setFont(undefined, 'normal');
    doc.setFontSize(9);
    invoiceData.items.forEach((item, index) => {
        doc.text(String(index + 1) + '.', 20, yPos);
        doc.text(item.description, 35, yPos);
        // Fix: Use proper string formatting for currency to avoid spacing issues
        const rateText = shopConfig.currency + String(item.rate.toFixed(0));
        const amountText = shopConfig.currency + String(item.amount.toFixed(0));
        doc.text(rateText, 120, yPos);
        doc.text(String(item.quantity), 145, yPos);
        doc.text(amountText, 170, yPos);
        yPos += 6;
    });
    
    yPos += 3;
    
    // Bottom divider
    doc.setDrawColor(255, 107, 53);
    doc.setLineWidth(0.3);
    doc.line(20, yPos, 190, yPos);
    
    yPos += 10;
    
    // Totals - CORRECTED LOGIC
    const totalsX = 130;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    
    doc.text('SUBTOTAL', totalsX, yPos);
    doc.text(':', totalsX + 25, yPos);
    const subtotalText = shopConfig.currency + String(invoiceData.netTotal.toFixed(2));
    doc.text(subtotalText, 190, yPos, { align: 'right' });
    
    yPos += 7;
    
    if (invoiceData.paymentStatus === 'paid') {
        // PAID: No advance or due shown, just total = subtotal
        // Add PAID stamp text or note
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text('[PAID]', totalsX, yPos);
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        yPos += 7;
    } else if (invoiceData.paymentStatus === 'advance') {
        // ADVANCE: Show advance and due
        doc.text('ADVANCE', totalsX, yPos);
        doc.text(':', totalsX + 25, yPos);
        const advanceText = shopConfig.currency + String(invoiceData.advanceAmount.toFixed(2));
        doc.text(advanceText, 190, yPos, { align: 'right' });
        yPos += 7;
        
        doc.text('DUE', totalsX, yPos);
        doc.text(':', totalsX + 25, yPos);
        const dueText = shopConfig.currency + String(invoiceData.dueAmount.toFixed(2));
        doc.text(dueText, 190, yPos, { align: 'right' });
        yPos += 7;
    } else if (invoiceData.paymentStatus === 'unpaid') {
        // UNPAID: Show due, add note
        doc.text('DUE', totalsX, yPos);
        doc.text(':', totalsX + 25, yPos);
        const dueText = shopConfig.currency + String(invoiceData.netTotal.toFixed(2));
        doc.text(dueText, 190, yPos, { align: 'right' });
        yPos += 7;
        
        // Add UNPAID note
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text('[UNPAID]', totalsX, yPos);
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        yPos += 7;
    }
    
    yPos += 2;
    doc.setLineWidth(0.5);
    doc.line(totalsX, yPos, 190, yPos);
    
    yPos += 7;
    doc.setFont(undefined, 'bold');
    doc.text('TOTAL', totalsX, yPos);
    doc.text(':', totalsX + 25, yPos);
    
    // Total amount logic
    let totalAmount;
    if (invoiceData.paymentStatus === 'paid') {
        totalAmount = invoiceData.netTotal;
    } else if (invoiceData.paymentStatus === 'advance') {
        totalAmount = invoiceData.dueAmount;
    } else {
        totalAmount = invoiceData.netTotal;
    }
    const totalText = shopConfig.currency + String(totalAmount.toFixed(2));
    doc.text(totalText, 190, yPos, { align: 'right' });
    
    yPos += 8;
    
    // Final divider
    doc.setDrawColor(0, 188, 212);
    doc.setLineWidth(0.5);
    doc.line(20, yPos, 190, yPos);
    
    yPos += 10;
    
    // Footer
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    doc.text(`Thanks for choosing ${shopConfig.shopName}`, 105, yPos, { align: 'center' });
    
    // Save PDF
    doc.save(invoiceData.invoiceNumber + '.pdf');
}

// ===== DOWNLOAD PNG =====
async function downloadPNG() {
    // Check if html2canvas is loaded
    if (typeof html2canvas === 'undefined') {
        alert('PNG export library not loaded. Please check your internet connection or use the PDF option.');
        return;
    }
    
    const invoiceContent = document.getElementById('invoiceContent');
    const downloadBtn = document.getElementById('downloadAsBtn');
    
    // Temporarily disable button
    downloadBtn.textContent = 'Generating PNG...';
    downloadBtn.disabled = true;
    
    try {
        // Use html2canvas to capture the invoice
        // With online image URLs, CORS should work fine
        const canvas = await html2canvas(invoiceContent, {
            scale: 2, // Higher quality
            useCORS: true, // Allow cross-origin images
            allowTaint: false,
            backgroundColor: '#ffffff',
            logging: false,
            imageTimeout: 15000 // Wait up to 15 seconds for images to load
        });
        
        // Convert canvas to blob
        canvas.toBlob(function(blob) {
            // Create download link
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = invoiceData.invoiceNumber + '.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            // Re-enable button
            downloadBtn.textContent = '📄 Download As ▼';
            downloadBtn.disabled = false;
        }, 'image/png');
        
    } catch (error) {
        console.error('Error generating PNG:', error);
        alert('Error generating PNG. Make sure stamp images are hosted online with CORS enabled, or use the PDF option.');
        downloadBtn.textContent = '📄 Download As ▼';
        downloadBtn.disabled = false;
    }
}

// ===== SAVE TO GOOGLE SHEET =====
async function saveToGoogleSheet() {
    if (GOOGLE_SCRIPT_URL === "PASTE_YOUR_WEBAPP_URL_HERE") {
        alert('Please configure your Google Apps Script URL in the script.js file (GOOGLE_SCRIPT_URL variable)');
        return;
    }
    
    const saveBtn = document.getElementById('saveToSheetBtn');
    saveBtn.textContent = 'Saving...';
    saveBtn.disabled = true;
    
    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(invoiceData)
        });
        
        // Note: With no-cors mode, we can't read the response
        // Assume success if no error is thrown
        alert('Invoice saved to database successfully!');
        saveBtn.textContent = '✓ Saved';
        
    } catch (error) {
        console.error('Error saving to Google Sheet:', error);
        alert('Error saving to database. Please try again.');
        saveBtn.textContent = '💾 Save to Database';
        saveBtn.disabled = false;
    }
}

// ===== NEW INVOICE =====
function createNewInvoice() {
    // Reset form
    document.getElementById('invoiceForm').style.display = 'block';
    document.getElementById('invoiceView').style.display = 'none';
    document.getElementById('paymentSection').style.display = 'none';
    document.getElementById('generateBtn').style.display = 'block';
    
    // Clear form fields
    document.getElementById('customerName').value = '';
    document.getElementById('customerPhone').value = '';
    document.getElementById('customerAddress').value = '';
    
    // Clear items table
    document.getElementById('itemsTableBody').innerHTML = '';
    addInitialItem();
    
    // Reset payment options
    const paymentRadios = document.querySelectorAll('input[name="paymentStatus"]');
    paymentRadios.forEach(radio => radio.checked = false);
    document.getElementById('advanceSection').style.display = 'none';
    document.getElementById('advanceAmount').value = '';
    
    // Clear errors
    document.getElementById('nameError').textContent = '';
    document.getElementById('itemsError').textContent = '';
    document.getElementById('advanceError').textContent = '';
    
    // Reset totals
    calculateNetTotal();
    
    // Initialize new invoice
    initializeInvoice();
    
    // Scroll to top
    window.scrollTo(0, 0);
}
