document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const encodeBtn = document.getElementById('encodeBtn');
    const decodeBtn = document.getElementById('decodeBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');

    // Encode text
    encodeBtn.addEventListener('click', function() {
        const text = inputText.value.trim();
        if (!text) {
            showError('Please enter some text to encode');
            return;
        }

        try {
            // Encode the text
            const encodedText = encodeURIComponent(text);
            outputText.value = encodedText;
            showSuccess('Text encoded successfully');
        } catch (error) {
            showError('Error encoding text: ' + error.message);
        }
    });

    // Decode text
    decodeBtn.addEventListener('click', function() {
        const text = inputText.value.trim();
        if (!text) {
            showError('Please enter some text to decode');
            return;
        }

        try {
            // Decode the text
            const decodedText = decodeURIComponent(text);
            outputText.value = decodedText;
            showSuccess('Text decoded successfully');
        } catch (error) {
            showError('Error decoding text: ' + error.message);
        }
    });

    // Clear text
    clearBtn.addEventListener('click', function() {
        inputText.value = '';
        outputText.value = '';
        showSuccess('Text cleared');
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