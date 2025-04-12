document.addEventListener('DOMContentLoaded', function() {
    // Initialize elements
    const textInput = document.getElementById('textInput');
    const fileInput = document.getElementById('fileInput');
    const imageInput = document.getElementById('imageInput');
    const outputText = document.getElementById('outputText');
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const clearBtn = document.getElementById('clearBtn');
    const fileInfo = document.querySelector('.file-info');
    const imagePreview = document.querySelector('.image-preview');
    const inputTypeButtons = document.querySelectorAll('[data-input-type]');
    const actionButtons = document.querySelectorAll('[data-action]');

    let currentInputType = 'text';
    let currentAction = 'encode';
    let currentFile = null;

    // Initialize input type buttons
    inputTypeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const type = button.getAttribute('data-input-type');
            switchInputType(type);
        });
    });

    // Initialize action buttons
    actionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.getAttribute('data-action');
            switchAction(action);
        });
    });

    // Switch input type
    function switchInputType(type) {
        currentInputType = type;
        
        // Update button states
        inputTypeButtons.forEach(button => {
            button.classList.toggle('active', button.getAttribute('data-input-type') === type);
        });

        // Show/hide input sections
        document.querySelector('.text-input').classList.toggle('d-none', type !== 'text');
        document.querySelector('.file-input').classList.toggle('d-none', type !== 'file');
        document.querySelector('.image-input').classList.toggle('d-none', type !== 'image');

        // Clear inputs and output
        clearInputs();
    }

    // Switch action (encode/decode)
    function switchAction(action) {
        currentAction = action;
        
        // Update button states
        actionButtons.forEach(button => {
            button.classList.toggle('active', button.getAttribute('data-action') === action);
        });

        // Process current input
        processInput();
    }

    // Process input based on current type and action
    function processInput() {
        switch (currentInputType) {
            case 'text':
                processText();
                break;
            case 'file':
                if (currentFile) {
                    processFile();
                }
                break;
            case 'image':
                if (currentFile) {
                    processImage();
                }
                break;
        }
    }

    // Process text input
    function processText() {
        const input = textInput.value.trim();
        if (!input) return;

        try {
            if (currentAction === 'encode') {
                outputText.value = btoa(input);
            } else {
                outputText.value = atob(input);
            }
        } catch (error) {
            showError('Invalid input for ' + currentAction + 'ing');
        }
    }

    // Process file input
    function processFile() {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                if (currentAction === 'encode') {
                    const base64 = e.target.result.split(',')[1];
                    outputText.value = base64;
                } else {
                    const binary = atob(e.target.result.split(',')[1]);
                    const bytes = new Uint8Array(binary.length);
                    for (let i = 0; i < binary.length; i++) {
                        bytes[i] = binary.charCodeAt(i);
                    }
                    const blob = new Blob([bytes], { type: currentFile.type });
                    outputText.value = URL.createObjectURL(blob);
                }
            } catch (error) {
                showError('Error processing file');
            }
        };
        reader.readAsDataURL(currentFile);
    }

    // Process image input
    function processImage() {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                if (currentAction === 'encode') {
                    outputText.value = e.target.result.split(',')[1];
                } else {
                    imagePreview.innerHTML = `<img src="${e.target.result}" alt="Decoded image">`;
                }
            } catch (error) {
                showError('Error processing image');
            }
        };
        reader.readAsDataURL(currentFile);
    }

    // File input change handler
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            currentFile = e.target.files[0];
            fileInfo.textContent = `File: ${currentFile.name} (${formatFileSize(currentFile.size)})`;
            processInput();
        }
    });

    // Image input change handler
    imageInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            currentFile = e.target.files[0];
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            };
            reader.readAsDataURL(currentFile);
            processInput();
        }
    });

    // Text input change handler
    textInput.addEventListener('input', processInput);

    // Copy button click handler
    copyBtn.addEventListener('click', () => {
        if (outputText.value) {
            navigator.clipboard.writeText(outputText.value)
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

    // Download button click handler
    downloadBtn.addEventListener('click', () => {
        if (outputText.value) {
            let blob, filename;
            
            if (currentAction === 'encode') {
                blob = new Blob([outputText.value], { type: 'text/plain' });
                filename = 'encoded.txt';
            } else {
                const binary = atob(outputText.value);
                const bytes = new Uint8Array(binary.length);
                for (let i = 0; i < binary.length; i++) {
                    bytes[i] = binary.charCodeAt(i);
                }
                blob = new Blob([bytes], { type: currentFile?.type || 'application/octet-stream' });
                filename = currentFile?.name || 'decoded.bin';
            }

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    });

    // Clear button click handler
    clearBtn.addEventListener('click', clearInputs);

    // Clear all inputs and output
    function clearInputs() {
        textInput.value = '';
        fileInput.value = '';
        imageInput.value = '';
        outputText.value = '';
        fileInfo.textContent = '';
        imagePreview.innerHTML = '';
        currentFile = null;
    }

    // Show error message
    function showError(message) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-danger';
        alert.textContent = message;
        document.querySelector('.output-content').insertBefore(alert, outputText);
        setTimeout(() => alert.remove(), 3000);
    }

    // Format file size
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}); 