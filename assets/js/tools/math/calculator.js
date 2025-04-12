document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const historyDisplay = document.getElementById('historyDisplay');
    const currentDisplay = document.getElementById('currentDisplay');
    const calculatorButtons = document.querySelectorAll('.calculator-buttons button');
    const modeSelector = document.getElementById('modeSelector');
    const basicMode = document.getElementById('basicMode');
    const scientificMode = document.getElementById('scientificMode');
    const converterMode = document.getElementById('converterMode');
    const historyList = document.getElementById('historyList');
    const clearHistoryBtn = document.getElementById('clearHistory');
    
    // Calculator state
    let currentValue = '0';
    let previousValue = '';
    let operation = '';
    let shouldResetDisplay = false;
    let calculationHistory = [];

    // Initialize calculator
    function init() {
        updateDisplay();
        setupEventListeners();
    }

    // Update display
    function updateDisplay() {
        currentDisplay.textContent = currentValue;
        historyDisplay.textContent = previousValue + ' ' + operation;
    }

    // Setup event listeners
    function setupEventListeners() {
        // Number buttons
        calculatorButtons.forEach(button => {
            button.addEventListener('click', () => {
                const value = button.textContent;
                
                if (button.classList.contains('number')) {
                    handleNumber(value);
                } else if (button.classList.contains('operator')) {
                    handleOperator(value);
                } else if (button.classList.contains('function')) {
                    handleFunction(value);
                } else if (button.id === 'equals') {
                    handleEquals();
                } else if (button.id === 'clear') {
                    handleClear();
                } else if (button.id === 'backspace') {
                    handleBackspace();
                } else if (button.id === 'decimal') {
                    handleDecimal();
                }
                
                updateDisplay();
            });
        });

        // Mode selector
        modeSelector.addEventListener('change', handleModeChange);

        // History clear button
        clearHistoryBtn.addEventListener('click', clearHistory);
    }

    // Handle number input
    function handleNumber(number) {
        if (shouldResetDisplay) {
            currentValue = number;
            shouldResetDisplay = false;
        } else {
            currentValue = currentValue === '0' ? number : currentValue + number;
        }
    }

    // Handle operator input
    function handleOperator(op) {
        if (previousValue && !shouldResetDisplay) {
            handleEquals();
        }
        previousValue = currentValue;
        operation = op;
        shouldResetDisplay = true;
    }

    // Handle function input
    function handleFunction(func) {
        const num = parseFloat(currentValue);
        let result;

        switch (func) {
            case 'sin':
                result = Math.sin(num * Math.PI / 180);
                break;
            case 'cos':
                result = Math.cos(num * Math.PI / 180);
                break;
            case 'tan':
                result = Math.tan(num * Math.PI / 180);
                break;
            case 'log':
                result = Math.log10(num);
                break;
            case 'ln':
                result = Math.log(num);
                break;
            case 'sqrt':
                result = Math.sqrt(num);
                break;
            case 'x²':
                result = Math.pow(num, 2);
                break;
            case 'x^y':
                // This will be handled differently
                break;
            case '1/x':
                result = 1 / num;
                break;
            case '±':
                result = -num;
                break;
            case 'π':
                result = Math.PI;
                break;
            case 'e':
                result = Math.E;
                break;
        }

        if (result !== undefined) {
            currentValue = result.toString();
            addToHistory(`${func}(${num}) = ${currentValue}`);
        }
    }

    // Handle equals
    function handleEquals() {
        if (!previousValue || !operation) return;

        const prev = parseFloat(previousValue);
        const current = parseFloat(currentValue);
        let result;

        switch (operation) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '×':
                result = prev * current;
                break;
            case '÷':
                result = prev / current;
                break;
            case '%':
                result = prev % current;
                break;
        }

        if (result !== undefined) {
            addToHistory(`${previousValue} ${operation} ${currentValue} = ${result}`);
            currentValue = result.toString();
            previousValue = '';
            operation = '';
            shouldResetDisplay = true;
        }
    }

    // Handle clear
    function handleClear() {
        currentValue = '0';
        previousValue = '';
        operation = '';
        shouldResetDisplay = false;
    }

    // Handle backspace
    function handleBackspace() {
        if (currentValue.length > 1) {
            currentValue = currentValue.slice(0, -1);
        } else {
            currentValue = '0';
        }
    }

    // Handle decimal
    function handleDecimal() {
        if (!currentValue.includes('.')) {
            currentValue += '.';
        }
    }

    // Handle mode change
    function handleModeChange() {
        const mode = modeSelector.value;
        
        basicMode.style.display = mode === 'basic' ? 'block' : 'none';
        scientificMode.style.display = mode === 'scientific' ? 'block' : 'none';
        converterMode.style.display = mode === 'converter' ? 'block' : 'none';
        
        handleClear();
    }

    // Add calculation to history
    function addToHistory(calculation) {
        calculationHistory.unshift(calculation);
        updateHistoryDisplay();
    }

    // Update history display
    function updateHistoryDisplay() {
        historyList.innerHTML = '';
        calculationHistory.forEach(calculation => {
            const li = document.createElement('li');
            li.className = 'history-item';
            li.textContent = calculation;
            li.addEventListener('click', () => {
                // When a history item is clicked, use it as the current input
                const parts = calculation.split(' = ');
                if (parts.length === 2) {
                    currentValue = parts[1];
                    updateDisplay();
                }
            });
            historyList.appendChild(li);
        });
    }

    // Clear history
    function clearHistory() {
        calculationHistory = [];
        updateHistoryDisplay();
    }

    // Initialize the calculator
    init();
}); 