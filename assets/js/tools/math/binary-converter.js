document.addEventListener('DOMContentLoaded', function() {
    // Initialize elements
    const inputType = document.getElementById('inputType');
    const inputValue = document.getElementById('inputValue');
    const binaryResult = document.getElementById('binaryResult');
    const decimalResult = document.getElementById('decimalResult');
    const hexResult = document.getElementById('hexResult');
    const octalResult = document.getElementById('octalResult');
    const bitOperation = document.getElementById('bitOperation');
    const secondOperand = document.getElementById('secondOperand');
    const bitOperationResult = document.getElementById('bitOperationResult');
    const historyList = document.getElementById('historyList');
    const clearHistoryBtn = document.getElementById('clearHistory');
    const commonValues = document.getElementById('commonValues');

    // Common values
    const commonValuesList = [
        { label: 'Zero', value: '0' },
        { label: 'One', value: '1' },
        { label: 'Two', value: '10' },
        { label: 'Four', value: '100' },
        { label: 'Eight', value: '1000' },
        { label: 'Sixteen', value: '10000' },
        { label: 'Thirty-Two', value: '100000' },
        { label: 'Sixty-Four', value: '1000000' },
        { label: 'One Hundred Twenty-Eight', value: '10000000' },
        { label: 'Two Hundred Fifty-Six', value: '100000000' }
    ];

    // Initialize common values
    function initializeCommonValues() {
        commonValuesList.forEach(item => {
            const valueItem = document.createElement('div');
            valueItem.className = 'common-value-item';
            valueItem.innerHTML = `
                <div class="value-label">${item.label}</div>
                <div class="value-binary">${item.value}</div>
            `;
            valueItem.addEventListener('click', () => {
                inputType.value = 'binary';
                inputValue.value = item.value;
                convertNumber();
            });
            commonValues.appendChild(valueItem);
        });
    }

    // Convert number
    function convertNumber() {
        const type = inputType.value;
        const value = inputValue.value.trim();

        if (!value) {
            showError('Please enter a value');
            return;
        }

        let decimal;
        try {
            switch (type) {
                case 'binary':
                    if (!/^[01]+$/.test(value)) {
                        throw new Error('Invalid binary number');
                    }
                    decimal = parseInt(value, 2);
                    break;
                case 'decimal':
                    if (!/^\d+$/.test(value)) {
                        throw new Error('Invalid decimal number');
                    }
                    decimal = parseInt(value, 10);
                    break;
                case 'hexadecimal':
                    const hexValue = value.startsWith('0x') ? value.slice(2) : value;
                    if (!/^[0-9A-Fa-f]+$/.test(hexValue)) {
                        throw new Error('Invalid hexadecimal number');
                    }
                    decimal = parseInt(hexValue, 16);
                    break;
                case 'octal':
                    if (!/^[0-7]+$/.test(value)) {
                        throw new Error('Invalid octal number');
                    }
                    decimal = parseInt(value, 8);
                    break;
                default:
                    throw new Error('Invalid input type');
            }

            // Update results
            binaryResult.textContent = decimal.toString(2);
            decimalResult.textContent = decimal.toString(10);
            hexResult.textContent = '0x' + decimal.toString(16).toUpperCase();
            octalResult.textContent = decimal.toString(8);

            // Add to history
            addToHistory(type, value, decimal);

        } catch (error) {
            showError(error.message);
        }
    }

    // Perform bit operation
    function performBitOperation() {
        const operation = bitOperation.value;
        const value1 = parseInt(inputValue.value, getBaseFromType(inputType.value));
        const value2 = parseInt(secondOperand.value, getBaseFromType(inputType.value));

        if (isNaN(value1) || isNaN(value2)) {
            showError('Please enter valid numbers');
            return;
        }

        let result;
        switch (operation) {
            case 'and':
                result = value1 & value2;
                break;
            case 'or':
                result = value1 | value2;
                break;
            case 'xor':
                result = value1 ^ value2;
                break;
            case 'not':
                result = ~value1;
                break;
            case 'shiftLeft':
                result = value1 << value2;
                break;
            case 'shiftRight':
                result = value1 >> value2;
                break;
            default:
                showError('Invalid operation');
                return;
        }

        bitOperationResult.textContent = result.toString(2);
    }

    // Get base from type
    function getBaseFromType(type) {
        switch (type) {
            case 'binary': return 2;
            case 'decimal': return 10;
            case 'hexadecimal': return 16;
            case 'octal': return 8;
            default: return 10;
        }
    }

    // Add conversion to history
    function addToHistory(type, value, decimal) {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div class="d-flex justify-content-between">
                <div>
                    ${type}: ${value} → Decimal: ${decimal}
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
    document.getElementById('binaryConverterForm').addEventListener('submit', function(e) {
        e.preventDefault();
        convertNumber();
    });

    document.getElementById('performBitOperation').addEventListener('click', performBitOperation);
    clearHistoryBtn.addEventListener('click', clearHistory);

    // Initialize
    initializeCommonValues();
}); 