document.addEventListener('DOMContentLoaded', function() {
    // Initialize form elements
    const discountCalculatorForm = document.getElementById('discountCalculatorForm');
    const originalPriceInput = document.getElementById('originalPrice');
    const discountPercentageInput = document.getElementById('discountPercentage');
    const taxRateInput = document.getElementById('taxRate');
    const currencySelect = document.getElementById('currency');
    const discountAmount = document.getElementById('discountAmount');
    const finalPrice = document.getElementById('finalPrice');
    const savings = document.getElementById('savings');
    const priceBreakdown = document.getElementById('priceBreakdown');
    const historyList = document.getElementById('historyList');
    const clearHistoryBtn = document.getElementById('clearHistory');

    // Currency symbols
    const currencySymbols = {
        'USD': '$',
        'EUR': '€',
        'GBP': '£',
        'JPY': '¥',
        'CAD': 'C$',
        'AUD': 'A$'
    };

    // Calculate discount
    function calculateDiscount() {
        const originalPrice = parseFloat(originalPriceInput.value);
        const discountPercentage = parseFloat(discountPercentageInput.value);
        const taxRate = parseFloat(taxRateInput.value) || 0;
        const currency = currencySelect.value;
        const symbol = currencySymbols[currency];

        if (isNaN(originalPrice) || isNaN(discountPercentage)) {
            showError('Please enter valid numbers for price and discount');
            return;
        }

        // Calculate discount amount
        const discountAmountValue = originalPrice * (discountPercentage / 100);
        
        // Calculate price after discount
        const priceAfterDiscount = originalPrice - discountAmountValue;
        
        // Calculate tax amount
        const taxAmount = priceAfterDiscount * (taxRate / 100);
        
        // Calculate final price
        const finalPriceValue = priceAfterDiscount + taxAmount;

        // Update results
        discountAmount.textContent = formatCurrency(discountAmountValue, symbol);
        finalPrice.textContent = formatCurrency(finalPriceValue, symbol);
        savings.textContent = formatCurrency(discountAmountValue, symbol);

        // Update price breakdown
        updatePriceBreakdown(originalPrice, discountAmountValue, taxAmount, finalPriceValue, symbol);

        // Save to history
        saveToHistory(originalPrice, discountPercentage, taxRate, finalPriceValue, symbol);
    }

    // Update price breakdown
    function updatePriceBreakdown(originalPrice, discountAmount, taxAmount, finalPrice, symbol) {
        const breakdownHTML = `
            <tr>
                <td>Original Price</td>
                <td>${formatCurrency(originalPrice, symbol)}</td>
            </tr>
            <tr>
                <td>Discount Amount</td>
                <td class="text-danger">-${formatCurrency(discountAmount, symbol)}</td>
            </tr>
            ${taxAmount > 0 ? `
                <tr>
                    <td>Tax Amount</td>
                    <td class="text-primary">+${formatCurrency(taxAmount, symbol)}</td>
                </tr>
            ` : ''}
            <tr class="table-active">
                <td><strong>Final Price</strong></td>
                <td><strong>${formatCurrency(finalPrice, symbol)}</strong></td>
            </tr>
        `;

        priceBreakdown.innerHTML = breakdownHTML;
    }

    // Format currency
    function formatCurrency(amount, symbol) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            currencyDisplay: 'symbol',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount).replace('$', symbol);
    }

    // Save to history
    function saveToHistory(originalPrice, discountPercentage, taxRate, finalPrice, symbol) {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div class="d-flex justify-content-between">
                <div>
                    <strong>${formatCurrency(originalPrice, symbol)}</strong> - ${discountPercentage}%
                    ${taxRate > 0 ? ` + ${taxRate}% tax` : ''}
                </div>
                <div>
                    <strong>${formatCurrency(finalPrice, symbol)}</strong>
                </div>
            </div>
        `;

        historyItem.addEventListener('click', function() {
            originalPriceInput.value = originalPrice;
            discountPercentageInput.value = discountPercentage;
            taxRateInput.value = taxRate;
            calculateDiscount();
        });

        historyList.insertBefore(historyItem, historyList.firstChild);
    }

    // Clear history
    function clearHistory() {
        historyList.innerHTML = '';
    }

    // Show error message
    function showError(message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-danger alert-dismissible fade show';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.querySelector('.discount-calculator').insertBefore(alertDiv, document.querySelector('.card'));
        setTimeout(() => alertDiv.remove(), 5000);
    }

    // Event listeners
    discountCalculatorForm.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateDiscount();
    });

    clearHistoryBtn.addEventListener('click', clearHistory);

    // Initialize currency symbol
    function updateCurrencySymbol() {
        const symbol = currencySymbols[currencySelect.value];
        document.querySelectorAll('.input-group-text').forEach(el => {
            if (el.textContent === '$') {
                el.textContent = symbol;
            }
        });
    }

    currencySelect.addEventListener('change', updateCurrencySymbol);
    updateCurrencySymbol();
}); 