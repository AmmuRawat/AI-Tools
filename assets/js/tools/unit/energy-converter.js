// Energy Converter JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Conversion factors relative to Joule (J)
    const conversionFactors = {
        'joule': 1,
        'kilojoule': 1000,
        'calorie': 4.184,
        'kilocalorie': 4184,
        'watt-hour': 3600,
        'kilowatt-hour': 3600000,
        'electronvolt': 1.602176634e-19,
        'british-thermal-unit': 1055.06,
        'foot-pound': 1.355818
    };

    // Common energy values
    const commonEnergyValues = [
        { value: 1, unit: 'joule', label: '1 Joule' },
        { value: 1000, unit: 'joule', label: '1 Kilojoule' },
        { value: 1, unit: 'calorie', label: '1 Calorie' },
        { value: 1, unit: 'kilocalorie', label: '1 Kilocalorie' },
        { value: 1, unit: 'watt-hour', label: '1 Watt-hour' },
        { value: 1, unit: 'kilowatt-hour', label: '1 Kilowatt-hour' },
        { value: 1, unit: 'british-thermal-unit', label: '1 BTU' },
        { value: 1, unit: 'foot-pound', label: '1 Foot-pound' }
    ];

    const form = document.getElementById('energyConverterForm');
    const fromValue = document.getElementById('fromValue');
    const fromUnit = document.getElementById('fromUnit');
    const toValue = document.getElementById('toValue');
    const toUnit = document.getElementById('toUnit');
    const swapButton = document.getElementById('swapUnits');
    const clearHistoryButton = document.getElementById('clearHistory');
    const historyList = document.getElementById('historyList');
    const commonEnergyValuesContainer = document.getElementById('commonEnergyValues');

    // Load conversion history from localStorage
    let conversionHistory = JSON.parse(localStorage.getItem('energyConversionHistory')) || [];

    // Function to convert energy units
    function convertEnergy(value, fromUnit, toUnit) {
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

        const result = convertEnergy(value, fromUnit.value, toUnit.value);
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

        localStorage.setItem('energyConversionHistory', JSON.stringify(conversionHistory));
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

    // Function to load common energy values
    function loadCommonEnergyValues() {
        commonEnergyValuesContainer.innerHTML = '';
        commonEnergyValues.forEach(item => {
            const valueItem = document.createElement('div');
            valueItem.className = 'col-md-6 col-lg-4';
            valueItem.innerHTML = `
                <div class="common-energy-item" data-value="${item.value}" data-unit="${item.unit}">
                    <div class="energy-value">${item.value}</div>
                    <div class="energy-unit">${item.label}</div>
                </div>
            `;
            commonEnergyValuesContainer.appendChild(valueItem);
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
        localStorage.removeItem('energyConversionHistory');
        updateHistoryList();
    });

    commonEnergyValuesContainer.addEventListener('click', function(e) {
        const energyItem = e.target.closest('.common-energy-item');
        if (energyItem) {
            fromValue.value = energyItem.dataset.value;
            fromUnit.value = energyItem.dataset.unit;
            updateResult();
        }
    });

    // Initialize
    loadCommonEnergyValues();
    updateHistoryList();
}); 