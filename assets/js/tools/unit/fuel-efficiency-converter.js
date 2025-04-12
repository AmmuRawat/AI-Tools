// Fuel Efficiency Converter JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Conversion factors relative to Miles per Gallon (mpg)
    const conversionFactors = {
        'mpg': 1,
        'kmpl': 0.425144,
        'l100km': 235.215,
        'mpg-uk': 1.20095,
        'mpg-us': 1
    };

    // Common fuel efficiency values
    const commonFuelEfficiencyValues = [
        { value: 20, unit: 'mpg', label: '20 mpg' },
        { value: 30, unit: 'mpg', label: '30 mpg' },
        { value: 40, unit: 'mpg', label: '40 mpg' },
        { value: 10, unit: 'kmpl', label: '10 km/L' },
        { value: 15, unit: 'kmpl', label: '15 km/L' },
        { value: 5, unit: 'l100km', label: '5 L/100km' },
        { value: 10, unit: 'l100km', label: '10 L/100km' }
    ];

    const form = document.getElementById('fuelEfficiencyConverterForm');
    const fromValue = document.getElementById('fromValue');
    const fromUnit = document.getElementById('fromUnit');
    const toValue = document.getElementById('toValue');
    const toUnit = document.getElementById('toUnit');
    const swapButton = document.getElementById('swapUnits');
    const clearHistoryButton = document.getElementById('clearHistory');
    const historyList = document.getElementById('historyList');
    const commonFuelEfficiencyValuesContainer = document.getElementById('commonFuelEfficiencyValues');

    // Load conversion history from localStorage
    let conversionHistory = JSON.parse(localStorage.getItem('fuelEfficiencyConversionHistory')) || [];

    // Function to convert fuel efficiency units
    function convertFuelEfficiency(value, fromUnit, toUnit) {
        // Convert to mpg first
        let mpgValue;
        if (fromUnit === 'l100km') {
            mpgValue = conversionFactors['l100km'] / value;
        } else {
            mpgValue = value / conversionFactors[fromUnit];
        }

        // Convert from mpg to target unit
        if (toUnit === 'l100km') {
            return conversionFactors['l100km'] / mpgValue;
        } else {
            return mpgValue * conversionFactors[toUnit];
        }
    }

    // Function to update the result
    function updateResult() {
        const value = parseFloat(fromValue.value);
        if (isNaN(value)) {
            toValue.value = '';
            return;
        }

        const result = convertFuelEfficiency(value, fromUnit.value, toUnit.value);
        toValue.value = result.toFixed(2);
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

        localStorage.setItem('fuelEfficiencyConversionHistory', JSON.stringify(conversionHistory));
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

    // Function to load common fuel efficiency values
    function loadCommonFuelEfficiencyValues() {
        commonFuelEfficiencyValuesContainer.innerHTML = '';
        commonFuelEfficiencyValues.forEach(item => {
            const valueItem = document.createElement('div');
            valueItem.className = 'col-md-6 col-lg-4';
            valueItem.innerHTML = `
                <div class="common-fuel-efficiency-item" data-value="${item.value}" data-unit="${item.unit}">
                    <div class="fuel-efficiency-value">${item.value}</div>
                    <div class="fuel-efficiency-unit">${item.label}</div>
                </div>
            `;
            commonFuelEfficiencyValuesContainer.appendChild(valueItem);
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
        localStorage.removeItem('fuelEfficiencyConversionHistory');
        updateHistoryList();
    });

    commonFuelEfficiencyValuesContainer.addEventListener('click', function(e) {
        const fuelEfficiencyItem = e.target.closest('.common-fuel-efficiency-item');
        if (fuelEfficiencyItem) {
            fromValue.value = fuelEfficiencyItem.dataset.value;
            fromUnit.value = fuelEfficiencyItem.dataset.unit;
            updateResult();
        }
    });

    // Initialize
    loadCommonFuelEfficiencyValues();
    updateHistoryList();
}); 