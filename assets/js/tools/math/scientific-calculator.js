document.addEventListener('DOMContentLoaded', function() {
    // Initialize calculator elements
    const historyDisplay = document.getElementById('historyDisplay');
    const currentDisplay = document.getElementById('currentDisplay');
    const historyList = document.getElementById('historyList');
    const clearHistoryBtn = document.getElementById('clearHistory');
    const buttons = document.querySelectorAll('.calculator-controls button');

    // Calculator state
    let currentInput = '0';
    let previousInput = '';
    let operation = null;
    let shouldResetDisplay = false;
    let isNewCalculation = true;

    // Update display
    function updateDisplay() {
        currentDisplay.textContent = currentInput;
        historyDisplay.textContent = previousInput;
    }

    // Handle number input
    function handleNumber(number) {
        if (shouldResetDisplay) {
            currentInput = '0';
            shouldResetDisplay = false;
        }
        if (currentInput === '0' && number !== '.') {
            currentInput = number;
        } else if (number === '.' && !currentInput.includes('.')) {
            currentInput += number;
        } else if (number !== '.') {
            currentInput += number;
        }
        updateDisplay();
    }

    // Handle operation
    function handleOperation(op) {
        if (currentInput === '0' && previousInput === '') return;

        if (operation && !shouldResetDisplay) {
            calculate();
        }

        operation = op;
        previousInput = `${currentInput} ${op}`;
        shouldResetDisplay = true;
        updateDisplay();
    }

    // Handle function
    function handleFunction(func) {
        let result;
        const num = parseFloat(currentInput);

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
            case 'fact':
                result = factorial(num);
                break;
            case 'pi':
                result = Math.PI;
                break;
            case 'e':
                result = Math.E;
                break;
        }

        if (result !== undefined) {
            currentInput = result.toString();
            updateDisplay();
            saveToHistory(`${func}(${num}) = ${result}`);
        }
    }

    // Calculate factorial
    function factorial(n) {
        if (n < 0) return NaN;
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    // Calculate result
    function calculate() {
        if (!operation || shouldResetDisplay) return;

        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);
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
            case 'pow':
                result = Math.pow(prev, current);
                break;
        }

        if (result !== undefined) {
            currentInput = result.toString();
            previousInput = '';
            operation = null;
            shouldResetDisplay = true;
            updateDisplay();
            saveToHistory(`${prev} ${operation} ${current} = ${result}`);
        }
    }

    // Clear calculator
    function clearCalculator() {
        currentInput = '0';
        previousInput = '';
        operation = null;
        shouldResetDisplay = false;
        updateDisplay();
    }

    // Handle backspace
    function handleBackspace() {
        if (currentInput.length > 1) {
            currentInput = currentInput.slice(0, -1);
        } else {
            currentInput = '0';
        }
        updateDisplay();
    }

    // Save to history
    function saveToHistory(calculation) {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.textContent = calculation;

        historyItem.addEventListener('click', function() {
            const parts = calculation.split(' = ');
            if (parts.length === 2) {
                currentInput = parts[1];
                updateDisplay();
            }
        });

        historyList.insertBefore(historyItem, historyList.firstChild);
    }

    // Clear history
    function clearHistory() {
        historyList.innerHTML = '';
    }

    // Add event listeners to buttons
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.dataset.action;
            const number = this.dataset.number;

            if (number) {
                handleNumber(number);
            } else if (action) {
                switch (action) {
                    case 'clear':
                        clearCalculator();
                        break;
                    case 'backspace':
                        handleBackspace();
                        break;
                    case 'equals':
                        calculate();
                        break;
                    case 'parentheses':
                        // Handle parentheses (to be implemented)
                        break;
                    default:
                        if (['sin', 'cos', 'tan', 'log', 'ln', 'sqrt', 'fact', 'pi', 'e'].includes(action)) {
                            handleFunction(action);
                        } else {
                            handleOperation(action);
                        }
                }
            }
        });
    });

    // Add event listener to clear history button
    clearHistoryBtn.addEventListener('click', clearHistory);

    // Initialize display
    updateDisplay();
}); 