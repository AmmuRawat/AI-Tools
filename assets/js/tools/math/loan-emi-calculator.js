document.addEventListener('DOMContentLoaded', function() {
    // Initialize form elements
    const loanAmountInput = document.getElementById('loanAmount');
    const interestRateInput = document.getElementById('interestRate');
    const loanTermInput = document.getElementById('loanTerm');
    const startDateInput = document.getElementById('startDate');
    const calculateBtn = document.getElementById('calculateBtn');
    const clearBtn = document.getElementById('clearBtn');
    const resultSection = document.getElementById('resultSection');
    const emiAmount = document.getElementById('emiAmount');
    const totalInterest = document.getElementById('totalInterest');
    const totalPayment = document.getElementById('totalPayment');
    const paymentSchedule = document.getElementById('paymentSchedule');
    const historyList = document.getElementById('historyList');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');

    // Initialize Chart.js
    let emiChart = null;

    // Calculate EMI
    function calculateEMI() {
        const loanAmount = parseFloat(loanAmountInput.value);
        const interestRate = parseFloat(interestRateInput.value) / 100 / 12; // Monthly interest rate
        const loanTerm = parseInt(loanTermInput.value);
        const startDate = new Date(startDateInput.value);

        if (isNaN(loanAmount) || isNaN(interestRate) || isNaN(loanTerm) || !startDateInput.value) {
            showError('Please fill in all fields with valid values');
            return;
        }

        // Calculate EMI using the formula
        const emi = loanAmount * interestRate * Math.pow(1 + interestRate, loanTerm) / (Math.pow(1 + interestRate, loanTerm) - 1);
        const totalPaymentAmount = emi * loanTerm;
        const totalInterestAmount = totalPaymentAmount - loanAmount;

        // Update results
        emiAmount.textContent = formatCurrency(emi);
        totalInterest.textContent = formatCurrency(totalInterestAmount);
        totalPayment.textContent = formatCurrency(totalPaymentAmount);

        // Generate payment schedule
        generatePaymentSchedule(loanAmount, interestRate, loanTerm, startDate, emi);

        // Update chart
        updateChart(loanAmount, totalInterestAmount);

        // Save to history
        saveToHistory(loanAmount, interestRate * 12 * 100, loanTerm, emi);

        // Show results
        resultSection.classList.remove('d-none');
    }

    // Generate payment schedule
    function generatePaymentSchedule(loanAmount, interestRate, loanTerm, startDate, emi) {
        let balance = loanAmount;
        let scheduleHTML = '';

        for (let i = 1; i <= loanTerm; i++) {
            const interest = balance * interestRate;
            const principal = emi - interest;
            balance -= principal;

            const paymentDate = new Date(startDate);
            paymentDate.setMonth(paymentDate.getMonth() + i);

            scheduleHTML += `
                <tr>
                    <td>${i}</td>
                    <td>${paymentDate.toLocaleDateString()}</td>
                    <td>${formatCurrency(emi)}</td>
                    <td>${formatCurrency(principal)}</td>
                    <td>${formatCurrency(interest)}</td>
                    <td>${formatCurrency(balance)}</td>
                </tr>
            `;
        }

        paymentSchedule.innerHTML = scheduleHTML;
    }

    // Update chart
    function updateChart(loanAmount, totalInterest) {
        const ctx = document.getElementById('emiChart').getContext('2d');

        if (emiChart) {
            emiChart.destroy();
        }

        emiChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Principal Amount', 'Total Interest'],
                datasets: [{
                    data: [loanAmount, totalInterest],
                    backgroundColor: ['#007bff', '#dc3545']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Save calculation to history
    function saveToHistory(loanAmount, interestRate, loanTerm, emi) {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div class="d-flex justify-content-between">
                <div>
                    <strong>${formatCurrency(loanAmount)}</strong> at ${interestRate.toFixed(2)}% for ${loanTerm} months
                </div>
                <div>
                    <strong>${formatCurrency(emi)}</strong> EMI
                </div>
            </div>
        `;

        historyItem.addEventListener('click', function() {
            loanAmountInput.value = loanAmount;
            interestRateInput.value = interestRate;
            loanTermInput.value = loanTerm;
            calculateEMI();
        });

        historyList.insertBefore(historyItem, historyList.firstChild);
    }

    // Format currency
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    // Show error message
    function showError(message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-danger alert-dismissible fade show';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.querySelector('.loan-emi-tool').insertBefore(alertDiv, document.querySelector('.card'));
        setTimeout(() => alertDiv.remove(), 5000);
    }

    // Event listeners
    calculateBtn.addEventListener('click', calculateEMI);

    clearBtn.addEventListener('click', function() {
        loanAmountInput.value = '';
        interestRateInput.value = '';
        loanTermInput.value = '';
        startDateInput.value = '';
        resultSection.classList.add('d-none');
    });

    clearHistoryBtn.addEventListener('click', function() {
        historyList.innerHTML = '';
    });

    // Initialize date input with today's date
    startDateInput.value = new Date().toISOString().split('T')[0];
}); 