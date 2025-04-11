document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const caseType = document.getElementById('caseType');
    const convertBtn = document.getElementById('convertBtn');
    const copyBtn = document.getElementById('copyBtn');
    const clearBtn = document.getElementById('clearBtn');

    // Case conversion functions
    const caseConverters = {
        'uppercase': text => text.toUpperCase(),
        'lowercase': text => text.toLowerCase(),
        'titlecase': text => text.toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),
        'sentencecase': text => text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase()),
        'camelcase': text => text.toLowerCase().replace(/\s+(.)/g, (_, c) => c.toUpperCase()),
        'pascalcase': text => text.toLowerCase().replace(/\b\w/g, l => l.toUpperCase()).replace(/\s+/g, ''),
        'snakecase': text => text.toLowerCase().replace(/\s+/g, '_'),
        'kebabcase': text => text.toLowerCase().replace(/\s+/g, '-'),
        'invertcase': text => text.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join(''),
        'alternatingcase': text => text.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('')
    };

    // Convert text
    convertBtn.addEventListener('click', function() {
        const text = inputText.value;
        const selectedCase = caseType.value;
        
        if (text.trim() === '') {
            showError('Please enter some text to convert');
            return;
        }

        try {
            const convertedText = caseConverters[selectedCase](text);
            outputText.value = convertedText;
        } catch (error) {
            showError('An error occurred while converting the text');
            console.error('Error:', error);
        }
    });

    // Copy to clipboard
    copyBtn.addEventListener('click', function() {
        if (outputText.value.trim() === '') {
            showError('No text to copy');
            return;
        }

        outputText.select();
        document.execCommand('copy');
        
        // Show success message
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
        }, 2000);
    });

    // Clear text
    clearBtn.addEventListener('click', function() {
        inputText.value = '';
        outputText.value = '';
    });

    // Auto-convert on input change
    inputText.addEventListener('input', function() {
        if (inputText.value.trim() !== '') {
            convertBtn.click();
        } else {
            outputText.value = '';
        }
    });

    // Auto-convert on case type change
    caseType.addEventListener('change', function() {
        if (inputText.value.trim() !== '') {
            convertBtn.click();
        }
    });

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