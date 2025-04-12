document.addEventListener('DOMContentLoaded', function() {
    const jsonInput = document.getElementById('jsonInput');
    const jsonOutput = document.getElementById('jsonOutput');
    const validationResult = document.getElementById('validationResult');
    const formatBtn = document.getElementById('formatBtn');
    const minifyBtn = document.getElementById('minifyBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');

    function validateAndFormat(json, indent = 2) {
        try {
            // First parse to validate
            const parsed = JSON.parse(json);
            // Then stringify with formatting
            return {
                valid: true,
                formatted: JSON.stringify(parsed, null, indent)
            };
        } catch (e) {
            return {
                valid: false,
                error: e.message
            };
        }
    }

    function showValidationResult(isValid, message = '') {
        validationResult.innerHTML = isValid 
            ? '<div class="alert alert-success">Valid JSON</div>'
            : `<div class="alert alert-danger">Invalid JSON: ${message}</div>`;
    }

    function formatJSON() {
        const result = validateAndFormat(jsonInput.value);
        if (result.valid) {
            jsonOutput.textContent = result.formatted;
            showValidationResult(true);
        } else {
            showValidationResult(false, result.error);
            jsonOutput.textContent = '';
        }
    }

    function minifyJSON() {
        const result = validateAndFormat(jsonInput.value, 0);
        if (result.valid) {
            jsonOutput.textContent = result.formatted;
            showValidationResult(true);
        } else {
            showValidationResult(false, result.error);
            jsonOutput.textContent = '';
        }
    }

    formatBtn.addEventListener('click', formatJSON);
    
    minifyBtn.addEventListener('click', minifyJSON);

    clearBtn.addEventListener('click', () => {
        jsonInput.value = '';
        jsonOutput.textContent = '';
        validationResult.innerHTML = '';
    });

    copyBtn.addEventListener('click', () => {
        if (jsonOutput.textContent) {
            navigator.clipboard.writeText(jsonOutput.textContent)
                .then(() => {
                    const originalText = copyBtn.innerHTML;
                    copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    setTimeout(() => {
                        copyBtn.innerHTML = originalText;
                    }, 2000);
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                });
        }
    });

    // Add input event listener for real-time validation
    jsonInput.addEventListener('input', () => {
        if (jsonInput.value.trim() === '') {
            validationResult.innerHTML = '';
            jsonOutput.textContent = '';
            return;
        }
        const result = validateAndFormat(jsonInput.value);
        showValidationResult(result.valid, result.valid ? '' : result.error);
    });
}); 