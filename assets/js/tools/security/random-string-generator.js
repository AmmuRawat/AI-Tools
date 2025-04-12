document.addEventListener('DOMContentLoaded', function() {
    const randomStringForm = document.getElementById('randomStringForm');
    const generatedString = document.getElementById('generatedString');
    const copyString = document.getElementById('copyString');
    const stringLength = document.getElementById('stringLength');
    const lengthValue = document.getElementById('lengthValue');

    // Character sets
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    // Similar and ambiguous characters
    const similarChars = 'il1Lo0O';
    const ambiguousChars = '{}[]()/\\\'"`~,;:.<>';

    // Update length value display
    stringLength.addEventListener('input', function() {
        lengthValue.textContent = this.value;
    });

    // Generate random string
    randomStringForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const length = parseInt(stringLength.value);
        const includeUppercase = document.getElementById('includeUppercase').checked;
        const includeLowercase = document.getElementById('includeLowercase').checked;
        const includeNumbers = document.getElementById('includeNumbers').checked;
        const includeSymbols = document.getElementById('includeSymbols').checked;
        const excludeSimilar = document.getElementById('excludeSimilar').checked;
        const excludeAmbiguous = document.getElementById('excludeAmbiguous').checked;

        let chars = '';
        if (includeUppercase) chars += uppercaseChars;
        if (includeLowercase) chars += lowercaseChars;
        if (includeNumbers) chars += numberChars;
        if (includeSymbols) chars += symbolChars;

        if (chars === '') {
            alert('Please select at least one character type');
            return;
        }

        // Remove excluded characters if needed
        if (excludeSimilar) {
            chars = chars.split('').filter(char => !similarChars.includes(char)).join('');
        }
        if (excludeAmbiguous) {
            chars = chars.split('').filter(char => !ambiguousChars.includes(char)).join('');
        }

        let result = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            result += chars[randomIndex];
        }

        generatedString.value = result;
    });

    // Copy string to clipboard
    copyString.addEventListener('click', function() {
        if (generatedString.value) {
            generatedString.select();
            document.execCommand('copy');
            
            // Show feedback
            const originalText = copyString.innerHTML;
            copyString.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                copyString.innerHTML = originalText;
            }, 2000);
        }
    });
}); 