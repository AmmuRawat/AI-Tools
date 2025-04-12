document.addEventListener('DOMContentLoaded', function() {
    // Initialize elements
    const amountInput = document.getElementById('amount');
    const fromCurrency = document.getElementById('fromCurrency');
    const toCurrency = document.getElementById('toCurrency');
    const convertBtn = document.getElementById('convertBtn');
    const resultAmount = document.getElementById('resultAmount');
    const resultRate = document.getElementById('resultRate');
    const resultDate = document.getElementById('resultDate');
    const rateHistory = document.getElementById('rateHistory');
    const historyList = document.getElementById('historyList');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    const popularCurrencies = document.getElementById('popularCurrencies');

    // Popular currencies with their rates (example data)
    const popularRates = {
        'USD': 1.0,
        'EUR': 0.92,
        'GBP': 0.79,
        'JPY': 151.5,
        'AUD': 1.52,
        'CAD': 1.36,
        'CHF': 0.90,
        'CNY': 7.24,
        'INR': 83.3
    };

    // Initialize popular currencies
    function initializePopularCurrencies() {
        Object.entries(popularRates).forEach(([code, rate]) => {
            const item = document.createElement('div');
            item.className = 'popular-currency-item';
            item.innerHTML = `
                <div class="currency-code">${code}</div>
                <div class="currency-rate">1 USD = ${rate} ${code}</div>
            `;
            item.addEventListener('click', () => {
                toCurrency.value = code;
                convertCurrency();
            });
            popularCurrencies.appendChild(item);
        });
    }

    // Convert currency
    function convertCurrency() {
        const amount = parseFloat(amountInput.value);
        const from = fromCurrency.value;
        const to = toCurrency.value;

        if (isNaN(amount) || amount <= 0) {
            showError('Please enter a valid amount');
            return;
        }

        // In a real application, you would fetch rates from an API
        // For this example, we'll use mock data
        const mockRates = {
            'USD': 1.0,
            'EUR': 0.92,
            'GBP': 0.79,
            'JPY': 151.5,
            'AUD': 1.52,
            'CAD': 1.36,
            'CHF': 0.90,
            'CNY': 7.24,
            'INR': 83.3
        };

        const fromRate = mockRates[from] || 1;
        const toRate = mockRates[to] || 1;
        const convertedAmount = (amount * toRate) / fromRate;
        const exchangeRate = toRate / fromRate;

        // Update results
        resultAmount.textContent = convertedAmount.toFixed(2);
        resultRate.textContent = exchangeRate.toFixed(6);
        resultDate.textContent = new Date().toLocaleDateString();

        // Add to history
        addToHistory(amount, from, to, convertedAmount, exchangeRate);
    }

    // Add conversion to history
    function addToHistory(amount, from, to, convertedAmount, rate) {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div class="d-flex justify-content-between">
                <div>
                    ${amount} ${from} → ${convertedAmount.toFixed(2)} ${to}
                </div>
                <div>
                    Rate: ${rate.toFixed(6)}
                </div>
            </div>
            <div class="text-muted small">
                ${new Date().toLocaleString()}
            </div>
        `;

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
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        document.querySelector('.results').insertBefore(alertDiv, document.querySelector('.result-grid'));
    }

    // Event listeners
    convertBtn.addEventListener('click', convertCurrency);
    clearHistoryBtn.addEventListener('click', clearHistory);

    // Initialize
    initializePopularCurrencies();
}); 