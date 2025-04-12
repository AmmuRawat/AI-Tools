document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const ageCalculatorForm = document.getElementById('ageCalculatorForm');
    const birthDateInput = document.getElementById('birthDate');
    const compareDateInput = document.getElementById('compareDate');
    const historyList = document.getElementById('historyList');
    const clearHistoryBtn = document.getElementById('clearHistory');
    
    // Result elements
    const resultElements = {
        years: document.getElementById('years'),
        months: document.getElementById('months'),
        days: document.getElementById('days'),
        weeks: document.getElementById('weeks'),
        hours: document.getElementById('hours'),
        minutes: document.getElementById('minutes'),
        nextBirthday: document.getElementById('nextBirthday'),
        daysUntilBirthday: document.getElementById('daysUntilBirthday'),
        zodiacSign: document.getElementById('zodiacSign'),
        chineseZodiac: document.getElementById('chineseZodiac')
    };
    
    // Calculator state
    let calculationHistory = [];

    // Initialize calculator
    function init() {
        setupEventListeners();
        updateHistoryDisplay();
        setDefaultDates();
    }

    // Setup event listeners
    function setupEventListeners() {
        ageCalculatorForm.addEventListener('submit', handleSubmit);
        clearHistoryBtn.addEventListener('click', clearHistory);
    }

    // Set default dates
    function setDefaultDates() {
        const today = new Date();
        const maxDate = today.toISOString().split('T')[0];
        
        // Set max date to today
        birthDateInput.max = maxDate;
        compareDateInput.max = maxDate;
        
        // Set default compare date to today
        compareDateInput.value = maxDate;
    }

    // Handle form submission
    function handleSubmit(event) {
        event.preventDefault();
        
        const birthDate = new Date(birthDateInput.value);
        const compareDate = compareDateInput.value ? new Date(compareDateInput.value) : new Date();
        
        if (birthDate > compareDate) {
            alert('Birth date cannot be in the future!');
            return;
        }
        
        calculateAge(birthDate, compareDate);
    }

    // Calculate age
    function calculateAge(birthDate, compareDate) {
        // Calculate time difference in milliseconds
        const timeDiff = compareDate - birthDate;
        
        // Calculate different time units
        const years = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 365.25));
        const months = Math.floor((timeDiff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));
        const days = Math.floor((timeDiff % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));
        const weeks = Math.floor(days / 7);
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor(timeDiff / (1000 * 60));
        
        // Update result displays
        resultElements.years.textContent = years;
        resultElements.months.textContent = months;
        resultElements.days.textContent = days;
        resultElements.weeks.textContent = weeks;
        resultElements.hours.textContent = hours;
        resultElements.minutes.textContent = minutes;
        
        // Calculate next birthday
        const nextBirthday = calculateNextBirthday(birthDate, compareDate);
        resultElements.nextBirthday.textContent = nextBirthday.toLocaleDateString();
        
        // Calculate days until next birthday
        const daysUntilBirthday = Math.ceil((nextBirthday - compareDate) / (1000 * 60 * 60 * 24));
        resultElements.daysUntilBirthday.textContent = daysUntilBirthday;
        
        // Calculate zodiac signs
        resultElements.zodiacSign.textContent = getZodiacSign(birthDate);
        resultElements.chineseZodiac.textContent = getChineseZodiac(birthDate.getFullYear());
        
        // Add to history
        addToHistory(birthDate, compareDate, years, months, days);
    }

    // Calculate next birthday
    function calculateNextBirthday(birthDate, compareDate) {
        const nextBirthday = new Date(birthDate);
        nextBirthday.setFullYear(compareDate.getFullYear());
        
        if (nextBirthday < compareDate) {
            nextBirthday.setFullYear(compareDate.getFullYear() + 1);
        }
        
        return nextBirthday;
    }

    // Get zodiac sign
    function getZodiacSign(date) {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        
        if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
        if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
        if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
        if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
        if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
        if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
        if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
        if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
        if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
        if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
        if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
        if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'Pisces';
    }

    // Get Chinese zodiac
    function getChineseZodiac(year) {
        const zodiacs = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
        return zodiacs[(year - 4) % 12];
    }

    // Add calculation to history
    function addToHistory(birthDate, compareDate, years, months, days) {
        const historyEntry = {
            birthDate: birthDate.toLocaleDateString(),
            compareDate: compareDate.toLocaleDateString(),
            age: `${years} years, ${months} months, ${days} days`
        };
        
        calculationHistory.unshift(historyEntry);
        updateHistoryDisplay();
    }

    // Update history display
    function updateHistoryDisplay() {
        historyList.innerHTML = '';
        calculationHistory.forEach(entry => {
            const li = document.createElement('li');
            li.className = 'history-item';
            li.innerHTML = `
                <div class="history-date">${entry.birthDate}</div>
                <div class="history-compare">vs ${entry.compareDate}</div>
                <div class="history-age">${entry.age}</div>
            `;
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