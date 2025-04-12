document.addEventListener('DOMContentLoaded', function() {
    // Initialize elements
    const fromValue = document.getElementById('fromValue');
    const fromUnit = document.getElementById('fromUnit');
    const toValue = document.getElementById('toValue');
    const toUnit = document.getElementById('toUnit');
    const swapUnits = document.getElementById('swapUnits');
    const speedConverterForm = document.getElementById('speedConverterForm');
    const commonSpeeds = document.getElementById('commonSpeeds');
    const historyList = document.getElementById('historyList');
    const clearHistoryBtn = document.getElementById('clearHistory');

    // Conversion factors (to meters per second)
    const conversionFactors = {
        'mps': 1,           // meters per second
        'kph': 0.277778,    // kilometers per hour
        'mph': 0.44704,     // miles per hour
        'knot': 0.514444,   // knots
        'fps': 0.3048,      // feet per second
        'mach': 343         // mach (speed of sound at sea level)
    };

    // Common speeds
    const commonSpeedsList = [
        { value: 1, unit: 'mps', label: 'Walking Speed' },
        { value: 5, unit: 'mps', label: 'Running Speed' },
        { value: 20, unit: 'mps', label: 'Car Speed' },
        { value: 50, unit: 'mps', label: 'Highway Speed' },
        { value: 100, unit: 'mps', label: 'Train Speed' },
        { value: 250, unit: 'mps', label: 'Airplane Speed' },
        { value: 343, unit: 'mps', label: 'Speed of Sound' },
        { value: 1000, unit: 'mps', label: 'Supersonic Speed' }
    ];

    // Initialize common speeds
    function initializeCommonSpeeds() {
        commonSpeedsList.forEach(item => {
            const speedItem = document.createElement('div');
            speedItem.className = 'col-md-6 col-lg-4';
            speedItem.innerHTML = `
                <div class="common-speed-item">
                    <div class="speed-value">${item.value}</div>
                    <div class="speed-unit">${item.unit} (${item.label})</div>
                </div>
            `;
            speedItem.addEventListener('click', () => {
                fromValue.value = item.value;
                fromUnit.value = item.unit;
                convertSpeed();
            });
            commonSpeeds.appendChild(speedItem);
        });
    }

    // Convert speed
    function convertSpeed() {
        const value = parseFloat(fromValue.value);
        const from = fromUnit.value;
        const to = toUnit.value;

        if (isNaN(value)) {
            showError('Please enter a valid number');
            return;
        }

        // Convert to meters per second first
        const mps = value * conversionFactors[from];
        // Convert from meters per second to target unit
        const result = mps / conversionFactors[to];

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
        document.querySelector('.speed-converter').insertBefore(alertDiv, document.querySelector('.card'));
    }

    // Swap units
    function swapUnits() {
        const tempValue = fromValue.value;
        const tempUnit = fromUnit.value;
        
        fromValue.value = toValue.value;
        fromUnit.value = toUnit.value;
        
        toValue.value = tempValue;
        toUnit.value = tempUnit;
        
        convertSpeed();
    }

    // Event listeners
    speedConverterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        convertSpeed();
    });

    fromValue.addEventListener('input', convertSpeed);
    fromUnit.addEventListener('change', convertSpeed);
    toUnit.addEventListener('change', convertSpeed);
    swapUnits.addEventListener('click', swapUnits);
    clearHistoryBtn.addEventListener('click', clearHistory);

    // Initialize
    initializeCommonSpeeds();
}); 