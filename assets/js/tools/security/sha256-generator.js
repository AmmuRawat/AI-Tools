document.addEventListener('DOMContentLoaded', function() {
    const sha256HashForm = document.getElementById('sha256HashForm');
    const hashResult = document.getElementById('hashResult');
    const copyHash = document.getElementById('copyHash');
    const fileInput = document.getElementById('fileInput');
    const inputText = document.getElementById('inputText');

    // Handle form submission
    sha256HashForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const file = fileInput.files[0];
        if (file) {
            // Handle file input
            const reader = new FileReader();
            reader.onload = function(e) {
                const hash = CryptoJS.SHA256(CryptoJS.enc.Latin1.parse(e.target.result)).toString();
                hashResult.value = hash;
            };
            reader.readAsBinaryString(file);
        } else {
            // Handle text input
            const text = inputText.value.trim();
            if (text) {
                const hash = CryptoJS.SHA256(text).toString();
                hashResult.value = hash;
            }
        }
    });

    // Copy hash to clipboard
    copyHash.addEventListener('click', function() {
        if (hashResult.value) {
            hashResult.select();
            document.execCommand('copy');
            
            // Show feedback
            const originalText = copyHash.innerHTML;
            copyHash.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                copyHash.innerHTML = originalText;
            }, 2000);
        }
    });

    // Clear form
    document.getElementById('clearForm').addEventListener('click', function() {
        sha256HashForm.reset();
        hashResult.value = '';
    });
}); 