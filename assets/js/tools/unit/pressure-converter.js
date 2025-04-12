// Pressure Converter JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Conversion factors relative to Pascal (Pa)
    const conversionFactors = {
        'pascal': 1,
        'kilopascal': 1000,
        'megapascal': 1000000,
        'bar': 100000,
        'millibar': 100,
        'atmosphere': 101325,
        'torr': 133.322,
        'psi': 6894.76,
        'mmhg': 133.322,
        'inhg': 3386.39
    };

    // Common pressure values
    const commonPressureValues = [
        { value: 1, unit: 'pascal', label: '1 Pascal' },
        { value: 1, unit: 'kilopascal', label: '1 Kilopascal' },
        { value: 1, unit: 'bar', label: '1 Bar' },
        { value: 1, unit: 'atmosphere', label: '1 Atmosphere' },
        { value: 1, unit: 'psi', label: '1 PSI' },
        { value: 760, unit: 'mmhg', label: 'Standard Atmosphere' },
        { value: 29.92, unit: 'inhg', label: 'Standard Atmosphere' }
    ];

    const form = document.getElementById('pressureConverterForm');
    const fromValue = document.getElementById('fromValue');
    const fromUnit = document.getElementById('fromUnit');
    const toValue = document.getElementById('toValue');
    const toUnit = document.getElementById('toUnit');
    const swapButton = document.getElementById('swapUnits');
    const clearHistoryButton = document.getElementById('clearHistory');
    const historyList = document.getElementById('historyList');
    const commonPressureValuesContainer = document.getElementById('commonPressureValues');

    // Load conversion history from localStorage
    let conversionHistory = JSON.parse(localStorage.getItem('pressureConversionHistory')) || [];

    // Function to convert pressure units
    function convertPressure(value, fromUnit, toUnit) {
        const fromFactor = conversionFactors[fromUnit];
        const toFactor = conversionFactors[toUnit];
        return (value * fromFactor) / toFactor;
    }

    // Function to update the result
    function updateResult() {
        const value = parseFloat(fromValue.value);
        if (isNaN(value)) {
            toValue.value = '';
            return;
        }

        const result = convertPressure(value, fromUnit.value, toUnit.value);
        toValue.value = result.toFixed(8);
    }

    // Function to add conversion to history
    function addToHistory(fromValue, fromUnit, toValue, toUnit) {
        const timestamp = new Date().toLocaleString();
        const conversion = {
            from: `${fromValue} ${fromUnit}`,
            to: `${toValue} ${toUnit}`,
            timestamp: timestamp
        };

        conversionHistory.unshift(conversion);
        if (conversionHistory.length > 10) {
            conversionHistory.pop();
        }

        localStorage.setItem('pressureConversionHistory', JSON.stringify(conversionHistory));
        updateHistoryList();
    }

    // Function to update the history list
    function updateHistoryList() {
        historyList.innerHTML = '';
        conversionHistory.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <div class="conversion">${item.from} → ${item.to}</div>
                <div class="timestamp">${item.timestamp}</div>
            `;
            historyList.appendChild(historyItem);
        });
    }

    // Function to load common pressure values
    function loadCommonPressureValues() {
        commonPressureValuesContainer.innerHTML = '';
        commonPressureValues.forEach(item => {
            const valueItem = document.createElement('div');
            valueItem.className = 'col-md-6 col-lg-4';
            valueItem.innerHTML = `
                <div class="common-pressure-item" data-value="${item.value}" data-unit="${item.unit}">
                    <div class="pressure-value">${item.value}</div>
                    <div class="pressure-unit">${item.label}</div>
                </div>
            `;
            commonPressureValuesContainer.appendChild(valueItem);
        });
    }

    // Event Listeners
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        updateResult();
        addToHistory(fromValue.value, fromUnit.options[fromUnit.selectedIndex].text, 
                    toValue.value, toUnit.options[toUnit.selectedIndex].text);
    });

    swapButton.addEventListener('click', function() {
        const tempValue = fromValue.value;
        const tempUnit = fromUnit.value;
        
        fromValue.value = toValue.value;
        fromUnit.value = toUnit.value;
        
        toValue.value = tempValue;
        toUnit.value = tempUnit;
        
        updateResult();
    });

    clearHistoryButton.addEventListener('click', function() {
        conversionHistory = [];
        localStorage.removeItem('pressureConversionHistory');
        updateHistoryList();
    });

    commonPressureValuesContainer.addEventListener('click', function(e) {
        const pressureItem = e.target.closest('.common-pressure-item');
        if (pressureItem) {
            fromValue.value = pressureItem.dataset.value;
            fromUnit.value = pressureItem.dataset.unit;
            updateResult();
        }
    });

    // Initialize
    loadCommonPressureValues();
    updateHistoryList();
}); 