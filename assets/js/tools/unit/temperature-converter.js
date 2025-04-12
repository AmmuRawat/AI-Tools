document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const form = document.getElementById('temperatureConverterForm');
    const inputValue = document.getElementById('inputValue');
    const fromUnit = document.getElementById('fromUnit');
    const toUnit = document.getElementById('toUnit');
    const swapButton = document.getElementById('swapUnits');
    const result = document.getElementById('result');
    const commonTemperatures = document.getElementById('commonTemperatures');
    const historyList = document.getElementById('historyList');
    const clearHistory = document.getElementById('clearHistory');

    // Common temperatures for quick reference
    const commonTemps = [
        { value: -40, label: 'Extremely Cold' },
        { value: 0, label: 'Freezing Point of Water' },
        { value: 20, label: 'Room Temperature' },
        { value: 37, label: 'Human Body Temperature' },
        { value: 100, label: 'Boiling Point of Water' }
    ];

    // Initialize common temperatures
    function initializeCommonTemperatures() {
        commonTemps.forEach(temp => {
            const item = document.createElement('div');
            item.className = 'common-temperature-item';
            item.innerHTML = `
                <div class="temperature-value">${temp.value}°C</div>
                <div class="temperature-unit">${temp.label}</div>
            `;
            item.addEventListener('click', () => {
                inputValue.value = temp.value;
                fromUnit.value = 'celsius';
                convertTemperature();
            });
            commonTemperatures.appendChild(item);
        });
    }

    // Convert temperature between units
    function convertTemperature() {
        const value = parseFloat(inputValue.value);
        if (isNaN(value)) {
            result.textContent = 'Please enter a valid number';
            return;
        }

        const from = fromUnit.value;
        const to = toUnit.value;
        let convertedValue;

        // Convert to Celsius first
        let celsius;
        switch (from) {
            case 'celsius':
                celsius = value;
                break;
            case 'fahrenheit':
                celsius = (value - 32) * 5/9;
                break;
            case 'kelvin':
                celsius = value - 273.15;
                break;
            case 'rankine':
                celsius = (value - 491.67) * 5/9;
                break;
        }

        // Convert from Celsius to target unit
        switch (to) {
            case 'celsius':
                convertedValue = celsius;
                break;
            case 'fahrenheit':
                convertedValue = (celsius * 9/5) + 32;
                break;
            case 'kelvin':
                convertedValue = celsius + 273.15;
                break;
            case 'rankine':
                convertedValue = (celsius + 273.15) * 9/5;
                break;
        }

        // Format result
        const formattedResult = convertedValue.toFixed(2);
        result.textContent = `${formattedResult} ${getUnitSymbol(to)}`;

        // Add to history
        addToHistory(value, from, convertedValue, to);
    }

    // Get unit symbol
    function getUnitSymbol(unit) {
        switch (unit) {
            case 'celsius': return '°C';
            case 'fahrenheit': return '°F';
            case 'kelvin': return 'K';
            case 'rankine': return '°R';
            default: return '';
        }
    }

    // Add conversion to history
    function addToHistory(value, from, convertedValue, to) {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        const timestamp = new Date().toLocaleTimeString();
        historyItem.innerHTML = `
            <div class="conversion">${value} ${getUnitSymbol(from)} = ${convertedValue.toFixed(2)} ${getUnitSymbol(to)}</div>
            <div class="timestamp">${timestamp}</div>
        `;
        historyList.insertBefore(historyItem, historyList.firstChild);
    }

    // Clear history
    function clearConversionHistory() {
        historyList.innerHTML = '';
    }

    // Event Listeners
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        convertTemperature();
    });

    swapButton.addEventListener('click', function() {
        const temp = fromUnit.value;
        fromUnit.value = toUnit.value;
        toUnit.value = temp;
        convertTemperature();
    });

    inputValue.addEventListener('input', convertTemperature);
    fromUnit.addEventListener('change', convertTemperature);
    toUnit.addEventListener('change', convertTemperature);
    clearHistory.addEventListener('click', clearConversionHistory);

    // Initialize
    initializeCommonTemperatures();
}); 