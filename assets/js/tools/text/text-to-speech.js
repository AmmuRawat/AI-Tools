document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const inputText = document.getElementById('inputText');
    const voiceSelect = document.getElementById('voiceSelect');
    const rateSelect = document.getElementById('rateSelect');
    const pitchSelect = document.getElementById('pitchSelect');
    const volumeSelect = document.getElementById('volumeSelect');
    const speakBtn = document.getElementById('speakBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resumeBtn = document.getElementById('resumeBtn');
    const stopBtn = document.getElementById('stopBtn');
    const downloadBtn = document.getElementById('downloadBtn');

    // Initialize speech synthesis
    const synth = window.speechSynthesis;
    let utterance = null;
    let isPaused = false;

    // Check if speech synthesis is supported
    if (!synth) {
        showError('Speech synthesis is not supported in your browser');
        disableControls();
        return;
    }

    // Load available voices
    function loadVoices() {
        const voices = synth.getVoices();
        voiceSelect.innerHTML = '';
        
        voices.forEach(voice => {
            const option = document.createElement('option');
            option.value = voice.lang;
            option.textContent = `${voice.name} (${voice.lang})`;
            voiceSelect.appendChild(option);
        });
    }

    // Load voices when they become available
    if (synth.getVoices().length > 0) {
        loadVoices();
    } else {
        synth.addEventListener('voiceschanged', loadVoices);
    }

    // Speak text
    speakBtn.addEventListener('click', function() {
        const text = inputText.value.trim();
        if (!text) {
            showError('Please enter some text to speak');
            return;
        }

        // Cancel any ongoing speech
        synth.cancel();

        // Create new utterance
        utterance = new SpeechSynthesisUtterance(text);
        
        // Set voice
        const selectedVoice = synth.getVoices().find(voice => voice.lang === voiceSelect.value);
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        // Set speech parameters
        utterance.rate = parseFloat(rateSelect.value);
        utterance.pitch = parseFloat(pitchSelect.value);
        utterance.volume = parseFloat(volumeSelect.value);

        // Enable controls
        pauseBtn.disabled = false;
        resumeBtn.disabled = true;
        stopBtn.disabled = false;
        downloadBtn.disabled = false;

        // Handle speech events
        utterance.onend = function() {
            resetControls();
        };

        utterance.onpause = function() {
            isPaused = true;
            pauseBtn.disabled = true;
            resumeBtn.disabled = false;
        };

        utterance.onresume = function() {
            isPaused = false;
            pauseBtn.disabled = false;
            resumeBtn.disabled = true;
        };

        // Start speaking
        synth.speak(utterance);
    });

    // Pause speech
    pauseBtn.addEventListener('click', function() {
        if (synth.speaking && !isPaused) {
            synth.pause();
        }
    });

    // Resume speech
    resumeBtn.addEventListener('click', function() {
        if (synth.paused) {
            synth.resume();
        }
    });

    // Stop speech
    stopBtn.addEventListener('click', function() {
        synth.cancel();
        resetControls();
    });

    // Download audio
    downloadBtn.addEventListener('click', function() {
        showError('Audio download is not supported in this browser. Please use a modern browser that supports the Web Speech API.');
    });

    // Reset controls
    function resetControls() {
        pauseBtn.disabled = true;
        resumeBtn.disabled = true;
        stopBtn.disabled = true;
        isPaused = false;
    }

    // Disable controls
    function disableControls() {
        speakBtn.disabled = true;
        pauseBtn.disabled = true;
        resumeBtn.disabled = true;
        stopBtn.disabled = true;
        downloadBtn.disabled = true;
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