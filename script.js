// Global variables
let currentExpression = '';
let basicHistory = [];
let materialHistory = [];
let materials = {};
let totalItems = [];
let taxApplied = false;

// Theme Management
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    // Apply saved theme
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    // Add click event listener
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Apply new theme
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    
    // Add animation effect
    document.body.style.transition = 'all 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
}

function updateThemeIcon(theme) {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        const icon = themeToggleBtn.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
            themeToggleBtn.title = 'Switch to Light Mode';
        } else {
            icon.className = 'fas fa-moon';
            themeToggleBtn.title = 'Switch to Dark Mode';
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeMaterials();
    loadHistory();
    setupEventListeners();
});

// Load default materials (matching the Python version)
function initializeMaterials() {
    const defaultMaterials = {
        "Stickers": 320,
        "Chromodeck": 241.5,
        "ABS": 161.0,
        "Correx": 100,
        "UV Pro": 84.0,
        "Laminated": 280.0,
        "3M": 1351,
        "Magnet": 600,
        "Reflective": 600,
        "Banner": 320,
        "Poster": 120
    };

    // Load from localStorage or use defaults
    const savedMaterials = localStorage.getItem('materials');
    if (savedMaterials) {
        materials = JSON.parse(savedMaterials);
    } else {
        materials = defaultMaterials;
        saveMaterials();
    }

    updateMaterialDropdowns();
}

// Save materials to localStorage
function saveMaterials() {
    localStorage.setItem('materials', JSON.stringify(materials));
}

// Load history from localStorage
function loadHistory() {
    const savedBasicHistory = localStorage.getItem('basicHistory');
    const savedMaterialHistory = localStorage.getItem('materialHistory');
    const savedTotalItems = localStorage.getItem('totalItems');
    const savedTaxApplied = localStorage.getItem('taxApplied');
    
    if (savedBasicHistory) {
        basicHistory = JSON.parse(savedBasicHistory);
    }
    
    if (savedMaterialHistory) {
        materialHistory = JSON.parse(savedMaterialHistory);
    }

    if (savedTotalItems) {
        totalItems = JSON.parse(savedTotalItems);
    }

    if (savedTaxApplied) {
        taxApplied = JSON.parse(savedTaxApplied);
    }
}

// Save history to localStorage
function saveHistory() {
    localStorage.setItem('basicHistory', JSON.stringify(basicHistory));
    localStorage.setItem('materialHistory', JSON.stringify(materialHistory));
    localStorage.setItem('totalItems', JSON.stringify(totalItems));
    localStorage.setItem('taxApplied', JSON.stringify(taxApplied));
}

// Setup event listeners
function setupEventListeners() {
    // Basic calculator keyboard support
    document.addEventListener('keydown', function(event) {
        if (document.getElementById('basic-calculator').style.display !== 'none') {
            handleKeyPress(event);
        }
    });

    // Material calculator input events
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    const quantityInput = document.getElementById('quantity');
    const materialSelect = document.getElementById('material-select');

    if (widthInput) widthInput.addEventListener('input', updateMaterialCalculation);
    if (heightInput) heightInput.addEventListener('input', updateMaterialCalculation);
    if (quantityInput) quantityInput.addEventListener('input', updateMaterialCalculation);
    if (materialSelect) materialSelect.addEventListener('change', updateMaterialCalculation);

    // Material management buttons
    const addMaterialBtn = document.getElementById('add-material');
    const removeMaterialBtn = document.getElementById('remove-material');
    const managementActionSelect = document.getElementById('management-action');
    const calculateMaterialBtn = document.getElementById('calculate-material');
    const clearHistoryBtn = document.getElementById('clear-history');
    const clearMaterialHistoryBtn = document.getElementById('clear-material-history');
    const addToTotalBtn = document.getElementById('add-to-total');
    const clearTotalBtn = document.getElementById('clear-total');
    const applyTaxBtn = document.getElementById('apply-tax');
    const removeTaxBtn = document.getElementById('remove-tax');
    const savePdfBtn = document.getElementById('save-pdf');

    if (addMaterialBtn) addMaterialBtn.addEventListener('click', addNewMaterial);
    if (removeMaterialBtn) removeMaterialBtn.addEventListener('click', removeMaterial);
    if (managementActionSelect) managementActionSelect.addEventListener('change', handleManagementAction);
    if (calculateMaterialBtn) calculateMaterialBtn.addEventListener('click', calculateMaterialPrice);
    if (clearHistoryBtn) clearHistoryBtn.addEventListener('click', clearBasicHistory);
    if (clearMaterialHistoryBtn) clearMaterialHistoryBtn.addEventListener('click', clearMaterialHistory);
    if (addToTotalBtn) addToTotalBtn.addEventListener('click', addToTotal);
    if (clearTotalBtn) clearTotalBtn.addEventListener('click', clearTotal);
    if (applyTaxBtn) applyTaxBtn.addEventListener('click', applyTax);
    if (removeTaxBtn) removeTaxBtn.addEventListener('click', removeTax);
    if (savePdfBtn) savePdfBtn.addEventListener('click', saveAsPDF);
}

// Navigation functions
function showCalculator(type) {
    document.querySelector('.calculator-selector').style.display = 'none';
    
    if (type === 'basic') {
        document.getElementById('basic-calculator').style.display = 'block';
        document.getElementById('material-calculator').style.display = 'none';
        updateBasicHistory();
    } else if (type === 'material') {
        document.getElementById('basic-calculator').style.display = 'none';
        document.getElementById('material-calculator').style.display = 'block';
        updateMaterialHistory();
        updateTotalDisplay();
        updateAddToTotalButton();
    }
}

function showSelector() {
    document.querySelector('.calculator-selector').style.display = 'grid';
    document.getElementById('basic-calculator').style.display = 'none';
    document.getElementById('material-calculator').style.display = 'none';
}

// Material Management Functions
function handleManagementAction() {
    const action = document.getElementById('management-action').value;
    const addForm = document.getElementById('add-material-form');
    const removeForm = document.getElementById('remove-material-form');
    
    // Hide both forms first
    if (addForm) addForm.style.display = 'none';
    if (removeForm) removeForm.style.display = 'none';
    
    // Show the appropriate form based on selection
    if (action === 'add' && addForm) {
        addForm.style.display = 'block';
    } else if (action === 'remove' && removeForm) {
        removeForm.style.display = 'block';
    }
}

// Basic Calculator Functions
function inputNumber(num) {
    const display = document.getElementById('display');
    if (display.value === '0' || display.value === 'Error') {
        display.value = num;
        currentExpression = num;
    } else {
        display.value += num;
        currentExpression += num;
    }
}

function inputOperator(op) {
    const display = document.getElementById('display');
    if (display.value === 'Error') {
        return;
    }
    
    if (op === '.') {
        if (!display.value.includes('.')) {
            display.value += op;
            currentExpression += op;
        }
    } else {
        display.value += op;
        currentExpression += op;
    }
}

function clearDisplay() {
    document.getElementById('display').value = '0';
    currentExpression = '';
}

function calculate() {
    const display = document.getElementById('display');
    try {
        // Use Function constructor for safer evaluation
        const result = Function('"use strict"; return (' + currentExpression + ')')();
        const resultStr = result.toString();
        
        display.value = resultStr;
        addToBasicHistory(currentExpression + ' = ' + resultStr);
        currentExpression = resultStr;
    } catch (error) {
        display.value = 'Error';
        currentExpression = '';
    }
}

function calculateTax() {
    const display = document.getElementById('display');
    try {
        const current = parseFloat(display.value);
        if (isNaN(current)) {
            display.value = 'Error';
            return;
        }
        
        const taxed = Math.round(current * 1.15 * 1000000000) / 1000000000; // Precise rounding
        const taxedStr = taxed.toString();
        
        display.value = taxedStr;
        addToBasicHistory(current + ' + 15% = ' + taxedStr);
        currentExpression = taxedStr;
    } catch (error) {
        display.value = 'Error';
        currentExpression = '';
    }
}

function handleKeyPress(event) {
    const key = event.key;
    const keyMap = {
        '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
        '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
        '.': '.', '+': '+', '-': '-', '*': '*', '/': '/',
        'Enter': '=', '=': '=', 'Escape': 'C', 'Backspace': 'C',
        'c': 'C', 'C': 'C'
    };

    if (keyMap[key]) {
        event.preventDefault();
        if (keyMap[key] === '=') {
            calculate();
        } else if (keyMap[key] === 'C') {
            clearDisplay();
        } else if ('0123456789.'.includes(keyMap[key])) {
            if (keyMap[key] === '.') {
                inputOperator(keyMap[key]);
            } else {
                inputNumber(keyMap[key]);
            }
        } else {
            inputOperator(keyMap[key]);
        }
    }
}

function addToBasicHistory(entry) {
    basicHistory.push(entry);
    if (basicHistory.length > 10) {
        basicHistory = basicHistory.slice(-10);
    }
    updateBasicHistory();
    saveHistory();
}

function updateBasicHistory() {
    const historyBox = document.getElementById('history');
    if (historyBox) {
        historyBox.innerHTML = basicHistory.join('<br>');
        historyBox.scrollTop = historyBox.scrollHeight;
    }
}

function clearBasicHistory() {
    basicHistory = [];
    updateBasicHistory();
    saveHistory();
}

// Material Calculator Functions
function updateMaterialDropdowns() {
    const materialSelect = document.getElementById('material-select');
    const removeMaterialSelect = document.getElementById('remove-material-select');
    
    if (materialSelect) {
        materialSelect.innerHTML = '<option value="">Select a material...</option>';
        Object.keys(materials).forEach(material => {
            const option = document.createElement('option');
            option.value = material;
            option.textContent = material;
            materialSelect.appendChild(option);
        });
    }
    
    if (removeMaterialSelect) {
        removeMaterialSelect.innerHTML = '<option value="">Select material to remove...</option>';
        Object.keys(materials).forEach(material => {
            const option = document.createElement('option');
            option.value = material;
            option.textContent = material;
            removeMaterialSelect.appendChild(option);
        });
    }
}

function updateMaterialCalculation() {
    const widthMM = parseFloat(document.getElementById('width').value) || 0;
    const heightMM = parseFloat(document.getElementById('height').value) || 0;
    const quantity = parseInt(document.getElementById('quantity').value) || 1;
    const selectedMaterial = document.getElementById('material-select').value;
    
    // Calculate area in mm² per piece
    const areaMM2 = widthMM * heightMM;
    document.getElementById('area-result').textContent = areaMM2.toLocaleString();
    document.getElementById('quantity-result').textContent = quantity;
    
    if (selectedMaterial && materials[selectedMaterial]) {
        const pricePerSqm = materials[selectedMaterial];
        // Convert mm² to m² for price calculation (1 m² = 1,000,000 mm²)
        const areaM2 = areaMM2 / 1000000;
        const unitPrice = areaM2 * pricePerSqm;
        const totalPrice = unitPrice * quantity;
        
        document.getElementById('price-per-sqm').textContent = `R ${pricePerSqm.toFixed(2)}`;
        document.getElementById('unit-price').textContent = `R ${unitPrice.toFixed(2)}`;
        document.getElementById('total-price').textContent = `R ${totalPrice.toFixed(2)}`;
    } else {
        document.getElementById('price-per-sqm').textContent = 'R 0.00';
        document.getElementById('unit-price').textContent = 'R 0.00';
        document.getElementById('total-price').textContent = 'R 0.00';
    }
    
    // Update add to total button state
    updateAddToTotalButton();
}

function calculateMaterialPrice() {
    const widthMM = parseFloat(document.getElementById('width').value);
    const heightMM = parseFloat(document.getElementById('height').value);
    const quantity = parseInt(document.getElementById('quantity').value) || 1;
    const selectedMaterial = document.getElementById('material-select').value;
    
    if (!widthMM || !heightMM || !selectedMaterial) {
        alert('Please enter width, height, and select a material.');
        return;
    }
    
    if (widthMM <= 0 || heightMM <= 0) {
        alert('Width and height must be greater than zero.');
        return;
    }
    
    if (quantity <= 0) {
        alert('Quantity must be greater than zero.');
        return;
    }
    
    // Calculate area in mm² per piece
    const areaMM2 = widthMM * heightMM;
    // Convert to m² for price calculation
    const areaM2 = areaMM2 / 1000000;
    const pricePerSqm = materials[selectedMaterial];
    const unitPrice = areaM2 * pricePerSqm;
    const totalPrice = unitPrice * quantity;
    
    const timestamp = new Date().toLocaleString();
    const calculation = {
        timestamp: timestamp,
        material: selectedMaterial,
        widthMM: widthMM,
        heightMM: heightMM,
        quantity: quantity,
        areaMM2: areaMM2,
        areaM2: areaM2,
        pricePerSqm: pricePerSqm,
        unitPrice: unitPrice,
        totalPrice: totalPrice
    };
    
    addToMaterialHistory(calculation);
    
    // Animate the result
    const totalPriceElement = document.getElementById('total-price');
    totalPriceElement.style.transform = 'scale(1.2)';
    totalPriceElement.style.color = '#4CAF50';
    setTimeout(() => {
        totalPriceElement.style.transform = 'scale(1)';
        totalPriceElement.style.color = '#FFD700';
    }, 300);
}

function addNewMaterial() {
    const name = document.getElementById('new-material-name').value.trim();
    const price = parseFloat(document.getElementById('material-price').value);
    const multiplier = parseFloat(document.getElementById('material-multiplier').value) || 1;
    
    if (!name) {
        alert('Please enter a material name.');
        return;
    }
    
    if (!price || price <= 0) {
        alert('Please enter a valid price.');
        return;
    }
    
    if (materials[name]) {
        if (!confirm(`Material "${name}" already exists. Do you want to update it?`)) {
            return;
        }
    }
    
    materials[name] = price * multiplier;
    saveMaterials();
    updateMaterialDropdowns();
    
    // Clear inputs
    document.getElementById('new-material-name').value = '';
    document.getElementById('material-price').value = '';
    document.getElementById('material-multiplier').value = '';
    
    alert(`Material "${name}" added successfully!`);
}

function removeMaterial() {
    const selectedMaterial = document.getElementById('remove-material-select').value;
    
    if (!selectedMaterial) {
        alert('Please select a material to remove.');
        return;
    }
    
    if (confirm(`Are you sure you want to remove "${selectedMaterial}"?`)) {
        delete materials[selectedMaterial];
        saveMaterials();
        updateMaterialDropdowns();
        
        // Clear material selection if it was the removed one
        const materialSelect = document.getElementById('material-select');
        if (materialSelect.value === selectedMaterial) {
            materialSelect.value = '';
            updateMaterialCalculation();
        }
        
        alert(`Material "${selectedMaterial}" removed successfully!`);
    }
}

function addToMaterialHistory(calculation) {
    materialHistory.unshift(calculation);
    if (materialHistory.length > 20) {
        materialHistory = materialHistory.slice(0, 20);
    }
    updateMaterialHistory();
    saveHistory();
}

function updateMaterialHistory() {
    const historyList = document.getElementById('material-history');
    if (historyList) {
        historyList.innerHTML = '';
        
        materialHistory.forEach(calc => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            // Check if quantity exists (for backward compatibility)
            const quantityText = calc.quantity ? `${calc.quantity}x ` : '';
            const unitPriceText = calc.unitPrice ? ` (R${calc.unitPrice.toFixed(2)} each)` : '';
            
            historyItem.innerHTML = `
                <div class="history-timestamp">${calc.timestamp}</div>
                <div class="history-calculation">
                    ${quantityText}${calc.material}: ${calc.widthMM}mm × ${calc.heightMM}mm = ${calc.areaMM2.toLocaleString()}mm² (${calc.areaM2.toFixed(4)}m²) × R${calc.pricePerSqm.toFixed(2)}${unitPriceText} = <strong>R${calc.totalPrice.toFixed(2)}</strong>
                </div>
            `;
            historyList.appendChild(historyItem);
        });
    }
}

function clearMaterialHistory() {
    if (confirm('Are you sure you want to clear the calculation history?')) {
        materialHistory = [];
        updateMaterialHistory();
        saveHistory();
    }
}

// Total Management Functions
function addToTotal() {
    const widthMM = parseFloat(document.getElementById('width').value);
    const heightMM = parseFloat(document.getElementById('height').value);
    const quantity = parseInt(document.getElementById('quantity').value) || 1;
    const selectedMaterial = document.getElementById('material-select').value;
    
    if (!widthMM || !heightMM || !selectedMaterial) {
        alert('Please enter width, height, and select a material before adding to total.');
        return;
    }
    
    if (widthMM <= 0 || heightMM <= 0) {
        alert('Width and height must be greater than zero.');
        return;
    }
    
    if (quantity <= 0) {
        alert('Quantity must be greater than zero.');
        return;
    }
    
    const areaMM2 = widthMM * heightMM;
    const areaM2 = areaMM2 / 1000000;
    const pricePerSqm = materials[selectedMaterial];
    const unitPrice = areaM2 * pricePerSqm;
    const totalPrice = unitPrice * quantity;
    
    const item = {
        id: Date.now(), // Simple unique ID
        material: selectedMaterial,
        widthMM: widthMM,
        heightMM: heightMM,
        quantity: quantity,
        areaMM2: areaMM2,
        areaM2: areaM2,
        pricePerSqm: pricePerSqm,
        unitPrice: unitPrice,
        totalPrice: totalPrice,
        timestamp: new Date().toLocaleString()
    };
    
    totalItems.push(item);
    updateTotalDisplay();
    updateAddToTotalButton();
    saveHistory();
    
    // Show success animation
    const addBtn = document.getElementById('add-to-total');
    addBtn.style.background = '#4CAF50';
    addBtn.innerHTML = '<i class="fas fa-check"></i> Added!';
    setTimeout(() => {
        addBtn.style.background = '#4CAF50';
        addBtn.innerHTML = '<i class="fas fa-plus"></i> Add to Total';
    }, 1500);
}

function removeFromTotal(itemId) {
    totalItems = totalItems.filter(item => item.id !== itemId);
    updateTotalDisplay();
    updateAddToTotalButton();
    saveHistory();
}

function clearTotal() {
    if (totalItems.length === 0) {
        alert('Total is already empty.');
        return;
    }
    
    if (confirm('Are you sure you want to clear all items from the total?')) {
        totalItems = [];
        taxApplied = false;
        updateTotalDisplay();
        updateAddToTotalButton();
        saveHistory();
    }
}

function updateTotalDisplay() {
    const totalItemsList = document.getElementById('total-items-list');
    const subtotalElement = document.getElementById('subtotal');
    const taxAmountElement = document.getElementById('tax-amount');
    const grandTotalElement = document.getElementById('grand-total');
    
    // Clear and populate items list
    if (totalItemsList) {
        if (totalItems.length === 0) {
            totalItemsList.innerHTML = '<div style="text-align: center; color: #888; padding: 20px;">No items added to total</div>';
        } else {
            totalItemsList.innerHTML = '';
            totalItems.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'total-item';
                itemDiv.innerHTML = `
                    <div class="total-item-details">
                        ${item.quantity}x ${item.material}: ${item.widthMM}mm × ${item.heightMM}mm
                        <small style="color: #888;">(R${item.unitPrice.toFixed(2)} each)</small>
                    </div>
                    <div class="total-item-price">R${item.totalPrice.toFixed(2)}</div>
                    <button class="total-item-remove" onclick="removeFromTotal(${item.id})">>
                        <i class="fas fa-times"></i>
                    </button>
                `;
                totalItemsList.appendChild(itemDiv);
            });
        }
    }
    
    // Calculate totals
    const subtotal = totalItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const taxAmount = taxApplied ? subtotal * 0.15 : 0;
    const grandTotal = subtotal + taxAmount;
    
    // Update display
    if (subtotalElement) subtotalElement.textContent = `R ${subtotal.toFixed(2)}`;
    if (taxAmountElement) taxAmountElement.textContent = `R ${taxAmount.toFixed(2)}`;
    if (grandTotalElement) grandTotalElement.textContent = `R ${grandTotal.toFixed(2)}`;
}

function updateAddToTotalButton() {
    const addBtn = document.getElementById('add-to-total');
    const widthMM = parseFloat(document.getElementById('width').value) || 0;
    const heightMM = parseFloat(document.getElementById('height').value) || 0;
    const selectedMaterial = document.getElementById('material-select').value;
    
    if (addBtn) {
        if (widthMM > 0 && heightMM > 0 && selectedMaterial) {
            addBtn.disabled = false;
            addBtn.style.opacity = '1';
        } else {
            addBtn.disabled = true;
            addBtn.style.opacity = '0.6';
        }
    }
}

function applyTax() {
    if (totalItems.length === 0) {
        alert('Please add items to the total before applying tax.');
        return;
    }
    taxApplied = true;
    updateTotalDisplay();
    saveHistory();
    
    // Show success message
    const taxBtn = document.getElementById('apply-tax');
    const originalText = taxBtn.innerHTML;
    taxBtn.innerHTML = '<i class="fas fa-check"></i> Tax Applied';
    taxBtn.style.background = '#4CAF50';
    setTimeout(() => {
        taxBtn.innerHTML = originalText;
        taxBtn.style.background = '#FF9800';
    }, 2000);
}

function removeTax() {
    taxApplied = false;
    updateTotalDisplay();
    saveHistory();
    
    // Show success message
    const removeTaxBtn = document.getElementById('remove-tax');
    const originalText = removeTaxBtn.innerHTML;
    removeTaxBtn.innerHTML = '<i class="fas fa-check"></i> Tax Removed';
    removeTaxBtn.style.background = '#4CAF50';
    setTimeout(() => {
        removeTaxBtn.innerHTML = originalText;
        removeTaxBtn.style.background = '#9C27B0';
    }, 2000);
}

function saveAsPDF() {
    if (totalItems.length === 0) {
        alert('Please add items to the total before saving as PDF.');
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text('Material Price Calculator - Quote', 20, 30);
    
    // Date
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 45);
    doc.text(`Time: ${new Date().toLocaleTimeString()}`, 20, 55);
    
    // Items header
    doc.setFontSize(14);
    doc.text('Items:', 20, 75);
    
    // Items list
    doc.setFontSize(10);
    let yPosition = 90;
    
    totalItems.forEach((item, index) => {
        const itemText = `${index + 1}. ${item.material}: ${item.widthMM}mm × ${item.heightMM}mm = ${item.areaMM2.toLocaleString()}mm² (${item.areaM2.toFixed(4)}m²)`;
        const priceText = `R${item.pricePerSqm.toFixed(2)}/m² = R${item.totalPrice.toFixed(2)}`;
        
        doc.text(itemText, 25, yPosition);
        doc.text(priceText, 25, yPosition + 7);
        yPosition += 20;
        
        // Add new page if needed
        if (yPosition > 250) {
            doc.addPage();
            yPosition = 30;
        }
    });
    
    // Totals
    yPosition += 10;
    doc.setFontSize(12);
    
    const subtotal = totalItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const taxAmount = taxApplied ? subtotal * 0.15 : 0;
    const grandTotal = subtotal + taxAmount;
    
    doc.text(`Subtotal: R${subtotal.toFixed(2)}`, 25, yPosition);
    yPosition += 10;
    
    if (taxApplied) {
        doc.text(`Tax (15%): R${taxAmount.toFixed(2)}`, 25, yPosition);
        yPosition += 10;
    }
    
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(`Total: R${grandTotal.toFixed(2)}`, 25, yPosition);
    
    // Footer
    doc.setFontSize(8);
    doc.setFont(undefined, 'normal');
    doc.text('Generated by Web Calculator Suite', 20, 280);
    
    // Save the PDF
    const filename = `Material_Quote_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
    
    // Show success message
    const pdfBtn = document.getElementById('save-pdf');
    const originalText = pdfBtn.innerHTML;
    pdfBtn.innerHTML = '<i class="fas fa-check"></i> PDF Saved';
    pdfBtn.style.background = '#4CAF50';
    setTimeout(() => {
        pdfBtn.innerHTML = originalText;
        pdfBtn.style.background = '#2196F3';
    }, 3000);
}

// Utility functions
function formatCurrency(amount) {
    return `R ${amount.toFixed(2)}`;
}

function formatNumber(num, decimals = 2) {
    return parseFloat(num).toFixed(decimals);
}

// Export/Import functions (for future enhancement)
function exportMaterials() {
    const dataStr = JSON.stringify(materials, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'materials.json';
    link.click();
    URL.revokeObjectURL(url);
}

function importMaterials(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedMaterials = JSON.parse(e.target.result);
                if (confirm('This will replace all current materials. Continue?')) {
                    materials = importedMaterials;
                    saveMaterials();
                    updateMaterialDropdowns();
                    alert('Materials imported successfully!');
                }
            } catch (error) {
                alert('Invalid file format. Please select a valid JSON file.');
            }
        };
        reader.readAsText(file);
    }
}

// Initialize tooltips and other UI enhancements
function initializeUI() {
    // Add hover effects and animations
    const buttons = document.querySelectorAll('.btn, .calculate-btn, .add-btn, .remove-btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Call UI initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeUI);
