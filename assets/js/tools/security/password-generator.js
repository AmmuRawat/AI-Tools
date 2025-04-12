document.addEventListener('DOMContentLoaded', function() {
    const passwordGeneratorForm = document.getElementById('passwordGeneratorForm');
    const generatedPassword = document.getElementById('generatedPassword');
    const copyPassword = document.getElementById('copyPassword');
    const passwordLength = document.getElementById('passwordLength');
    const lengthValue = document.getElementById('lengthValue');
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');

    // Character sets
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    // Update length value display
    passwordLength.addEventListener('input', function() {
        lengthValue.textContent = this.value;
    });

    // Generate password
    passwordGeneratorForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const length = parseInt(passwordLength.value);
        const includeUppercase = document.getElementById('includeUppercase').checked;
        const includeLowercase = document.getElementById('includeLowercase').checked;
        const includeNumbers = document.getElementById('includeNumbers').checked;
        const includeSymbols = document.getElementById('includeSymbols').checked;

        let chars = '';
        if (includeUppercase) chars += uppercaseChars;
        if (includeLowercase) chars += lowercaseChars;
        if (includeNumbers) chars += numberChars;
        if (includeSymbols) chars += symbolChars;

        if (chars === '') {
            alert('Please select at least one character type');
            return;
        }

        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            password += chars[randomIndex];
        }

        generatedPassword.value = password;
        updatePasswordStrength(password);
    });

    // Copy password to clipboard
    copyPassword.addEventListener('click', function() {
        if (generatedPassword.value) {
            generatedPassword.select();
            document.execCommand('copy');
            
            // Show feedback
            const originalText = copyPassword.innerHTML;
            copyPassword.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                copyPassword.innerHTML = originalText;
            }, 2000);
        }
    });

    // Update password strength
    function updatePasswordStrength(password) {
        let strength = 0;
        let feedback = '';

        // Length check
        if (password.length >= 12) strength += 25;
        else if (password.length >= 8) strength += 15;
        else strength += 5;

        // Character type checks
        if (password.match(/[A-Z]/)) strength += 25;
        if (password.match(/[a-z]/)) strength += 25;
        if (password.match(/[0-9]/)) strength += 25;
        if (password.match(/[^A-Za-z0-9]/)) strength += 25;

        // Update strength bar
        strengthBar.style.width = strength + '%';

        // Update strength text and bar color
        if (strength <= 25) {
            strengthBar.className = 'progress-bar bg-danger';
            feedback = 'Very Weak';
        } else if (strength <= 50) {
            strengthBar.className = 'progress-bar bg-warning';
            feedback = 'Weak';
        } else if (strength <= 75) {
            strengthBar.className = 'progress-bar bg-info';
            feedback = 'Good';
        } else {
            strengthBar.className = 'progress-bar bg-success';
            feedback = 'Strong';
        }

        strengthText.textContent = `Password Strength: ${feedback}`;
    }
}); 