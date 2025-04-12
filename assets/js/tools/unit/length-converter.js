document.addEventListener('DOMContentLoaded', function() {
    // Initialize elements
    const fromValue = document.getElementById('fromValue');
    const fromUnit = document.getElementById('fromUnit');
    const toValue = document.getElementById('toValue');
    const toUnit = document.getElementById('toUnit');
    const swapUnits = document.getElementById('swapUnits');
    const lengthConverterForm = document.getElementById('lengthConverterForm');
    const commonLengths = document.getElementById('commonLengths');
    const historyList = document.getElementById('historyList');
    const clearHistoryBtn = document.getElementById('clearHistory');

    // Conversion factors (to meters)
    const conversionFactors = {
        'mm': 0.001,
        'cm': 0.01,
        'm': 1,
        'km': 1000,
        'in': 0.0254,
        'ft': 0.3048,
        'yd': 0.9144,
        'mi': 1609.344
    };

    // Common lengths
    const commonLengthsList = [
        { value: 1, unit: 'm', label: '1 Meter' },
        { value: 100, unit: 'cm', label: '1 Meter' },
        { value: 1000, unit: 'mm', label: '1 Meter' },
        { value: 0.001, unit: 'km', label: '1 Meter' },
        { value: 39.37, unit: 'in', label: '1 Meter' },
        { value: 3.281, unit: 'ft', label: '1 Meter' },
        { value: 1.094, unit: 'yd', label: '1 Meter' },
        { value: 0.000621, unit: 'mi', label: '1 Meter' }
    ];

    // Initialize common lengths
    function initializeCommonLengths() {
        commonLengthsList.forEach(item => {
            const lengthItem = document.createElement('div');
            lengthItem.className = 'col-md-6 col-lg-4';
            lengthItem.innerHTML = `
                <div class="common-length-item">
                    <div class="length-value">${item.value}</div>
                    <div class="length-unit">${item.unit} (${item.label})</div>
                </div>
            `;
            lengthItem.addEventListener('click', () => {
                fromValue.value = item.value;
                fromUnit.value = item.unit;
                convertLength();
            });
            commonLengths.appendChild(lengthItem);
        });
    }

    // Convert length
    function convertLength() {
        const value = parseFloat(fromValue.value);
        const from = fromUnit.value;
        const to = toUnit.value;

        if (isNaN(value)) {
            showError('Please enter a valid number');
            return;
        }

        // Convert to meters first
        const meters = value * conversionFactors[from];
        // Convert from meters to target unit
        const result = meters / conversionFactors[to];

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
        document.querySelector('.length-converter').insertBefore(alertDiv, document.querySelector('.card'));
    }

    // Swap units
    function swapUnits() {
        const tempValue = fromValue.value;
        const tempUnit = fromUnit.value;
        
        fromValue.value = toValue.value;
        fromUnit.value = toUnit.value;
        
        toValue.value = tempValue;
        toUnit.value = tempUnit;
        
        convertLength();
    }

    // Event listeners
    lengthConverterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        convertLength();
    });

    fromValue.addEventListener('input', convertLength);
    fromUnit.addEventListener('change', convertLength);
    toUnit.addEventListener('change', convertLength);
    swapUnits.addEventListener('click', swapUnits);
    clearHistoryBtn.addEventListener('click', clearHistory);

    // Initialize
    initializeCommonLengths();
}); 