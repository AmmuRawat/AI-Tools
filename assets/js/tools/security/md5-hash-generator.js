document.addEventListener('DOMContentLoaded', function() {
    const md5HashForm = document.getElementById('md5HashForm');
    const hashResult = document.getElementById('hashResult');
    const copyHash = document.getElementById('copyHash');
    const fileInput = document.getElementById('fileInput');
    const inputType = document.getElementById('inputType');
    const textInput = document.getElementById('textInput');
    const fileInputContainer = document.getElementById('fileInputContainer');

    // Show/hide file input based on selection
    inputType.addEventListener('change', function() {
        if (this.value === 'file') {
            textInput.style.display = 'none';
            fileInputContainer.style.display = 'block';
        } else {
            textInput.style.display = 'block';
            fileInputContainer.style.display = 'none';
        }
    });

    // Handle form submission
    md5HashForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (inputType.value === 'text') {
            const text = textInput.value.trim();
            if (text) {
                const hash = CryptoJS.MD5(text).toString();
                hashResult.value = hash;
            }
        } else if (inputType.value === 'file') {
            const file = fileInput.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const hash = CryptoJS.MD5(CryptoJS.enc.Latin1.parse(e.target.result)).toString();
                    hashResult.value = hash;
                };
                reader.readAsBinaryString(file);
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
        md5HashForm.reset();
        hashResult.value = '';
        textInput.style.display = 'block';
        fileInputContainer.style.display = 'none';
    });
}); 