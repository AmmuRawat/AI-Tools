document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const calculatorTypeButtons = document.querySelectorAll('.calculator-type button');
    const calculatorSections = document.querySelectorAll('.calculator-section');
    const historyList = document.getElementById('historyList');
    const clearHistoryBtn = document.getElementById('clearHistory');
    
    // Input fields
    const basicInputs = {
        number: document.getElementById('number'),
        percentage: document.getElementById('percentage')
    };
    
    const changeInputs = {
        oldValue: document.getElementById('oldValue'),
        newValue: document.getElementById('newValue')
    };
    
    const differenceInputs = {
        value1: document.getElementById('value1'),
        value2: document.getElementById('value2')
    };
    
    // Result displays
    const basicResult = document.getElementById('basicResult');
    const changeResult = document.getElementById('changeResult');
    const differenceResult = document.getElementById('differenceResult');
    
    // Calculator state
    let calculationHistory = [];
    let currentCalculatorType = 'basic';

    // Initialize calculator
    function init() {
        setupEventListeners();
        updateHistoryDisplay();
    }

    // Setup event listeners
    function setupEventListeners() {
        // Calculator type buttons
        calculatorTypeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const type = button.dataset.type;
                switchCalculatorType(type);
            });
        });

        // Input fields
        Object.values(basicInputs).forEach(input => {
            input.addEventListener('input', calculateBasic);
        });

        Object.values(changeInputs).forEach(input => {
            input.addEventListener('input', calculateChange);
        });

        Object.values(differenceInputs).forEach(input => {
            input.addEventListener('input', calculateDifference);
        });

        // Clear history button
        clearHistoryBtn.addEventListener('click', clearHistory);
    }

    // Switch calculator type
    function switchCalculatorType(type) {
        currentCalculatorType = type;
        
        // Update active button
        calculatorTypeButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.type === type);
        });
        
        // Show/hide calculator sections
        calculatorSections.forEach(section => {
            section.classList.toggle('d-none', !section.classList.contains(`${type}-calculator`));
        });
    }

    // Calculate basic percentage
    function calculateBasic() {
        const number = parseFloat(basicInputs.number.value) || 0;
        const percentage = parseFloat(basicInputs.percentage.value) || 0;
        
        const result = (number * percentage) / 100;
        basicResult.textContent = result.toFixed(2);
        
        if (number && percentage) {
            addToHistory(`What is ${percentage}% of ${number}? = ${result.toFixed(2)}`);
        }
    }

    // Calculate percentage change
    function calculateChange() {
        const oldValue = parseFloat(changeInputs.oldValue.value) || 0;
        const newValue = parseFloat(changeInputs.newValue.value) || 0;
        
        if (oldValue === 0) {
            changeResult.textContent = '0%';
            return;
        }
        
        const result = ((newValue - oldValue) / oldValue) * 100;
        changeResult.textContent = `${result.toFixed(2)}%`;
        
        if (oldValue && newValue) {
            addToHistory(`Change from ${oldValue} to ${newValue} = ${result.toFixed(2)}%`);
        }
    }

    // Calculate percentage difference
    function calculateDifference() {
        const value1 = parseFloat(differenceInputs.value1.value) || 0;
        const value2 = parseFloat(differenceInputs.value2.value) || 0;
        
        const average = (value1 + value2) / 2;
        if (average === 0) {
            differenceResult.textContent = '0%';
            return;
        }
        
        const result = (Math.abs(value1 - value2) / average) * 100;
        differenceResult.textContent = `${result.toFixed(2)}%`;
        
        if (value1 && value2) {
            addToHistory(`Difference between ${value1} and ${value2} = ${result.toFixed(2)}%`);
        }
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