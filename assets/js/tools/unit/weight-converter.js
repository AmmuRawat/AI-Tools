document.addEventListener('DOMContentLoaded', function() {
    // Initialize elements
    const fromValue = document.getElementById('fromValue');
    const fromUnit = document.getElementById('fromUnit');
    const toValue = document.getElementById('toValue');
    const toUnit = document.getElementById('toUnit');
    const swapUnits = document.getElementById('swapUnits');
    const weightConverterForm = document.getElementById('weightConverterForm');
    const commonWeights = document.getElementById('commonWeights');
    const historyList = document.getElementById('historyList');
    const clearHistoryBtn = document.getElementById('clearHistory');

    // Conversion factors (to grams)
    const conversionFactors = {
        'mg': 0.001,
        'g': 1,
        'kg': 1000,
        't': 1000000,
        'oz': 28.3495,
        'lb': 453.592,
        'st': 6350.29,
        'ton': 907185
    };

    // Common weights
    const commonWeightsList = [
        { value: 1, unit: 'kg', label: '1 Kilogram' },
        { value: 1000, unit: 'g', label: '1 Kilogram' },
        { value: 1000000, unit: 'mg', label: '1 Kilogram' },
        { value: 0.001, unit: 't', label: '1 Kilogram' },
        { value: 35.274, unit: 'oz', label: '1 Kilogram' },
        { value: 2.205, unit: 'lb', label: '1 Kilogram' },
        { value: 0.157, unit: 'st', label: '1 Kilogram' },
        { value: 0.001102, unit: 'ton', label: '1 Kilogram' }
    ];

    // Initialize common weights
    function initializeCommonWeights() {
        commonWeightsList.forEach(item => {
            const weightItem = document.createElement('div');
            weightItem.className = 'col-md-6 col-lg-4';
            weightItem.innerHTML = `
                <div class="common-weight-item">
                    <div class="weight-value">${item.value}</div>
                    <div class="weight-unit">${item.unit} (${item.label})</div>
                </div>
            `;
            weightItem.addEventListener('click', () => {
                fromValue.value = item.value;
                fromUnit.value = item.unit;
                convertWeight();
            });
            commonWeights.appendChild(weightItem);
        });
    }

    // Convert weight
    function convertWeight() {
        const value = parseFloat(fromValue.value);
        const from = fromUnit.value;
        const to = toUnit.value;

        if (isNaN(value)) {
            showError('Please enter a valid number');
            return;
        }

        // Convert to grams first
        const grams = value * conversionFactors[from];
        // Convert from grams to target unit
        const result = grams / conversionFactors[to];

        // Update result
        toValue.value = result.toFixed(6);

        // Add to history
        addToHistory(value, from, result, to);
    }

    // Add conversion to history
    function addToHistory(value, from, result, to) {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div class="conversion">
                ${value} ${from} → ${result.toFixed(6)} ${to}
            </div>
            <div class="timestamp">
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
        document.querySelector('.weight-converter').insertBefore(alertDiv, document.querySelector('.card'));
    }

    // Swap units
    function swapUnits() {
        const tempValue = fromValue.value;
        const tempUnit = fromUnit.value;
        
        fromValue.value = toValue.value;
        fromUnit.value = toUnit.value;
        
        toValue.value = tempValue;
        toUnit.value = tempUnit;
        
        convertWeight();
    }

    // Event listeners
    weightConverterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        convertWeight();
    });

    fromValue.addEventListener('input', convertWeight);
    fromUnit.addEventListener('change', convertWeight);
    toUnit.addEventListener('change', convertWeight);
    swapUnits.addEventListener('click', swapUnits);
    clearHistoryBtn.addEventListener('click', clearHistory);

    // Initialize
    initializeCommonWeights();
}); 