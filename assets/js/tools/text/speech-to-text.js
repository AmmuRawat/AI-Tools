document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const languageSelect = document.getElementById('languageSelect');
    const outputText = document.getElementById('outputText');
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const statusMessage = document.getElementById('statusMessage');
    const statusText = document.getElementById('statusText');

    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = null;
    let isRecording = false;
    let finalTranscript = '';

    // Check if speech recognition is supported
    if (!SpeechRecognition) {
        showError('Speech recognition is not supported in your browser');
        disableControls();
        return;
    }

    // Initialize recognition
    function initRecognition() {
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = languageSelect.value;

        recognition.onstart = function() {
            isRecording = true;
            updateStatus('Recording...', 'info');
            startBtn.disabled = true;
            stopBtn.disabled = false;
        };

        recognition.onend = function() {
            isRecording = false;
            updateStatus('Recording stopped', 'info');
            startBtn.disabled = false;
            stopBtn.disabled = true;
        };

        recognition.onresult = function(event) {
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    // Add space between final transcriptions
                    finalTranscript += (finalTranscript ? ' ' : '') + transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            // Update output text with final transcript and any interim results
            outputText.value = finalTranscript + (interimTranscript ? ' ' + interimTranscript : '');
        };

        recognition.onerror = function(event) {
            showError('Error occurred: ' + event.error);
            stopRecording();
        };
    }

    // Start recording
    startBtn.addEventListener('click', function() {
        try {
            initRecognition();
            recognition.start();
        } catch (error) {
            showError('Failed to start recording: ' + error.message);
        }
    });

    // Stop recording
    stopBtn.addEventListener('click', stopRecording);

    // Clear text
    clearBtn.addEventListener('click', function() {
        outputText.value = '';
        finalTranscript = ''; // Reset the final transcript
        updateStatus('Text cleared', 'info');
    });

    // Copy text
    copyBtn.addEventListener('click', function() {
        outputText.select();
        document.execCommand('copy');
        updateStatus('Text copied to clipboard', 'success');
    });

    // Stop recording
    function stopRecording() {
        if (recognition && isRecording) {
            recognition.stop();
        }
    }

    // Update status message
    function updateStatus(message, type) {
        statusMessage.style.display = 'block';
        statusMessage.className = `alert alert-${type}`;
        statusText.textContent = message;
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

    // Disable controls
    function disableControls() {
        startBtn.disabled = true;
        stopBtn.disabled = true;
        clearBtn.disabled = true;
        copyBtn.disabled = true;
    }

    // Handle language change
    languageSelect.addEventListener('change', function() {
        if (recognition) {
            recognition.lang = this.value;
        }
    });
}); 