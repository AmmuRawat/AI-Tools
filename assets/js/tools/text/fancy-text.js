document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const styleButtons = document.getElementById('styleButtons');
    const copyBtn = document.getElementById('copyBtn');
    const clearBtn = document.getElementById('clearBtn');

    // Define text styles
    const styles = [
        {
            name: 'Bold',
            icon: 'fas fa-bold',
            convert: text => text.split('').map(char => char + '\u{FE00}').join('')
        },
        {
            name: 'Italic',
            icon: 'fas fa-italic',
            convert: text => text.split('').map(char => char + '\u{FE01}').join('')
        },
        {
            name: 'Bold Italic',
            icon: 'fas fa-bold',
            convert: text => text.split('').map(char => char + '\u{FE02}').join('')
        },
        {
            name: 'Sans Serif',
            icon: 'fas fa-font',
            convert: text => text.split('').map(char => char + '\u{FE03}').join('')
        },
        {
            name: 'Monospace',
            icon: 'fas fa-code',
            convert: text => text.split('').map(char => char + '\u{FE04}').join('')
        },
        {
            name: 'Double Struck',
            icon: 'fas fa-square',
            convert: text => text.split('').map(char => char + '\u{FE05}').join('')
        },
        {
            name: 'Script',
            icon: 'fas fa-pen-fancy',
            convert: text => text.split('').map(char => char + '\u{FE06}').join('')
        },
        {
            name: 'Fraktur',
            icon: 'fas fa-pen-nib',
            convert: text => text.split('').map(char => char + '\u{FE07}').join('')
        },
        {
            name: 'Bubble',
            icon: 'fas fa-circle',
            convert: text => text.split('').map(char => char + '\u{FE08}').join('')
        },
        {
            name: 'Square',
            icon: 'fas fa-square-full',
            convert: text => text.split('').map(char => char + '\u{FE09}').join('')
        },
        {
            name: 'Circle',
            icon: 'fas fa-circle',
            convert: text => text.split('').map(char => char + '\u{FE0A}').join('')
        },
        {
            name: 'Black Square',
            icon: 'fas fa-square',
            convert: text => text.split('').map(char => char + '\u{FE0B}').join('')
        },
        {
            name: 'Black Circle',
            icon: 'fas fa-circle',
            convert: text => text.split('').map(char => char + '\u{FE0C}').join('')
        },
        {
            name: 'Parenthesized',
            icon: 'fas fa-parentheses',
            convert: text => text.split('').map(char => char + '\u{FE0D}').join('')
        },
        {
            name: 'Circled',
            icon: 'fas fa-circle',
            convert: text => text.split('').map(char => char + '\u{FE0E}').join('')
        }
    ];

    // Create style buttons
    styles.forEach(style => {
        const button = document.createElement('button');
        button.className = 'btn btn-outline-primary col-6 col-md-4';
        button.innerHTML = `<i class="${style.icon}"></i> ${style.name}`;
        button.addEventListener('click', () => {
            const text = inputText.value.trim();
            if (!text) {
                showError('Please enter some text first');
                return;
            }
            outputText.value = style.convert(text);
            showSuccess('Text style applied');
        });
        styleButtons.appendChild(button);
    });

    // Copy text
    copyBtn.addEventListener('click', function() {
        if (!outputText.value) {
            showError('No text to copy');
            return;
        }

        try {
            outputText.select();
            document.execCommand('copy');
            showSuccess('Text copied to clipboard');
        } catch (error) {
            showError('Error copying text: ' + error.message);
        }
    });

    // Clear text
    clearBtn.addEventListener('click', function() {
        inputText.value = '';
        outputText.value = '';
        showSuccess('Text cleared');
    });

    // Show success message
    function showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'alert alert-success alert-dismissible fade show';
        successDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        const container = document.querySelector('.container');
        container.insertBefore(successDiv, container.firstChild);
        
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }

    // Show error message
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger alert-dismissible fade show';
        errorDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        const container = document.querySelector('.container');
        container.insertBefore(errorDiv, container.firstChild);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }
}); 