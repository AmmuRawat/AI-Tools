// Angle Converter JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Conversion factors relative to degrees
    const conversionFactors = {
        'degrees': 1,
        'radians': Math.PI / 180,
        'gradians': 10/9,
        'arcminutes': 60,
        'arcseconds': 3600
    };

    // Common angle values
    const commonAngleValues = [
        { value: 0, unit: 'degrees', label: '0°' },
        { value: 30, unit: 'degrees', label: '30°' },
        { value: 45, unit: 'degrees', label: '45°' },
        { value: 60, unit: 'degrees', label: '60°' },
        { value: 90, unit: 'degrees', label: '90°' },
        { value: 180, unit: 'degrees', label: '180°' },
        { value: 270, unit: 'degrees', label: '270°' },
        { value: 360, unit: 'degrees', label: '360°' }
    ];

    const form = document.getElementById('angleConverterForm');
    const fromValue = document.getElementById('fromValue');
    const fromUnit = document.getElementById('fromUnit');
    const toValue = document.getElementById('toValue');
    const toUnit = document.getElementById('toUnit');
    const swapButton = document.getElementById('swapUnits');
    const clearHistoryButton = document.getElementById('clearHistory');
    const historyList = document.getElementById('historyList');
    const commonAngleValuesContainer = document.getElementById('commonAngleValues');

    // Load conversion history from localStorage
    let conversionHistory = JSON.parse(localStorage.getItem('angleConversionHistory')) || [];

    // Function to convert angle units
    function convertAngle(value, fromUnit, toUnit) {
        // Convert to degrees first
        let degreesValue;
        if (fromUnit === 'degrees') {
            degreesValue = value;
        } else if (fromUnit === 'radians') {
            degreesValue = value * (180 / Math.PI);
        } else if (fromUnit === 'gradians') {
            degreesValue = value * 0.9;
        } else if (fromUnit === 'arcminutes') {
            degreesValue = value / 60;
        } else if (fromUnit === 'arcseconds') {
            degreesValue = value / 3600;
        }

        // Convert from degrees to target unit
        if (toUnit === 'degrees') {
            return degreesValue;
        } else if (toUnit === 'radians') {
            return degreesValue * (Math.PI / 180);
        } else if (toUnit === 'gradians') {
            return degreesValue * (10/9);
        } else if (toUnit === 'arcminutes') {
            return degreesValue * 60;
        } else if (toUnit === 'arcseconds') {
            return degreesValue * 3600;
        }
    }

    // Function to update the result
    function updateResult() {
        const value = parseFloat(fromValue.value);
        if (isNaN(value)) {
            toValue.value = '';
            return;
        }

        const result = convertAngle(value, fromUnit.value, toUnit.value);
        toValue.value = result.toFixed(6);
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

        localStorage.setItem('angleConversionHistory', JSON.stringify(conversionHistory));
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

    // Function to load common angle values
    function loadCommonAngleValues() {
        commonAngleValuesContainer.innerHTML = '';
        commonAngleValues.forEach(item => {
            const valueItem = document.createElement('div');
            valueItem.className = 'col-md-6 col-lg-4';
            valueItem.innerHTML = `
                <div class="common-angle-item" data-value="${item.value}" data-unit="${item.unit}">
                    <div class="angle-value">${item.value}</div>
                    <div class="angle-unit">${item.label}</div>
                </div>
            `;
            commonAngleValuesContainer.appendChild(valueItem);
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
        localStorage.removeItem('angleConversionHistory');
        updateHistoryList();
    });

    commonAngleValuesContainer.addEventListener('click', function(e) {
        const angleItem = e.target.closest('.common-angle-item');
        if (angleItem) {
            fromValue.value = angleItem.dataset.value;
            fromUnit.value = angleItem.dataset.unit;
            updateResult();
        }
    });

    // Initialize
    loadCommonAngleValues();
    updateHistoryList();
}); 