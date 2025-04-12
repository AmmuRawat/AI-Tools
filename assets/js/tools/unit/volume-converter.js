document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const form = document.getElementById('volumeConverterForm');
    const fromValue = document.getElementById('fromValue');
    const fromUnit = document.getElementById('fromUnit');
    const toValue = document.getElementById('toValue');
    const toUnit = document.getElementById('toUnit');
    const swapButton = document.getElementById('swapUnits');
    const commonVolumes = document.getElementById('commonVolumes');
    const historyList = document.getElementById('historyList');
    const clearHistory = document.getElementById('clearHistory');

    // Conversion factors to milliliters (base unit)
    const conversionFactors = {
        ml: 1,
        l: 1000,
        m3: 1000000,
        gal: 3785.41,
        qt: 946.353,
        pt: 473.176,
        cup: 236.588,
        floz: 29.5735,
        tbsp: 14.7868,
        tsp: 4.92892
    };

    // Common volumes for quick reference
    const commonVols = [
        { value: 250, unit: 'ml', label: 'Standard Cup' },
        { value: 500, unit: 'ml', label: 'Standard Water Bottle' },
        { value: 1, unit: 'l', label: 'Standard Water Bottle' },
        { value: 3.785, unit: 'l', label: 'Gallon' },
        { value: 1, unit: 'm3', label: 'Cubic Meter' }
    ];

    // Initialize common volumes
    function initializeCommonVolumes() {
        commonVols.forEach(vol => {
            const item = document.createElement('div');
            item.className = 'col-md-6 col-lg-4';
            item.innerHTML = `
                <div class="common-volume-item">
                    <div class="volume-value">${vol.value} ${getUnitSymbol(vol.unit)}</div>
                    <div class="volume-unit">${vol.label}</div>
                </div>
            `;
            item.addEventListener('click', () => {
                fromValue.value = vol.value;
                fromUnit.value = vol.unit;
                convertVolume();
            });
            commonVolumes.appendChild(item);
        });
    }

    // Convert volume between units
    function convertVolume() {
        const value = parseFloat(fromValue.value);
        if (isNaN(value)) {
            toValue.value = '';
            return;
        }

        const from = fromUnit.value;
        const to = toUnit.value;

        // Convert to milliliters first
        const milliliters = value * conversionFactors[from];
        
        // Convert from milliliters to target unit
        const convertedValue = milliliters / conversionFactors[to];
        
        // Format result
        toValue.value = convertedValue.toFixed(6);

        // Add to history
        addToHistory(value, from, convertedValue, to);
    }

    // Get unit symbol
    function getUnitSymbol(unit) {
        switch (unit) {
            case 'ml': return 'mL';
            case 'l': return 'L';
            case 'm3': return 'm³';
            case 'gal': return 'gal';
            case 'qt': return 'qt';
            case 'pt': return 'pt';
            case 'cup': return 'cup';
            case 'floz': return 'fl oz';
            case 'tbsp': return 'tbsp';
            case 'tsp': return 'tsp';
            default: return '';
        }
    }

    // Add conversion to history
    function addToHistory(value, from, convertedValue, to) {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        const timestamp = new Date().toLocaleTimeString();
        historyItem.innerHTML = `
            <div class="conversion">${value} ${getUnitSymbol(from)} = ${convertedValue.toFixed(6)} ${getUnitSymbol(to)}</div>
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
        convertVolume();
    });

    swapButton.addEventListener('click', function() {
        const temp = fromUnit.value;
        fromUnit.value = toUnit.value;
        toUnit.value = temp;
        convertVolume();
    });

    fromValue.addEventListener('input', convertVolume);
    fromUnit.addEventListener('change', convertVolume);
    toUnit.addEventListener('change', convertVolume);
    clearHistory.addEventListener('click', clearConversionHistory);

    // Initialize
    initializeCommonVolumes();
}); 