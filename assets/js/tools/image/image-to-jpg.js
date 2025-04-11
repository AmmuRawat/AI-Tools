document.addEventListener('DOMContentLoaded', function() {
    const imageInput = document.getElementById('imageInput');
    const qualityInput = document.getElementById('qualityInput');
    const qualityValue = document.getElementById('qualityValue');
    const imagePreview = document.getElementById('imagePreview');
    const resultImage = document.getElementById('resultImage');
    const downloadBtn = document.getElementById('downloadBtn');
    const copyBtn = document.getElementById('copyBtn');
    let convertedImage = null;

    // Update quality value display
    qualityInput.addEventListener('input', function() {
        qualityValue.textContent = `${this.value}%`;
        if (convertedImage) {
            convertToJPG(imagePreview.src, this.value);
        }
    });

    // Handle image upload
    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                imagePreview.classList.remove('d-none');
                
                // Convert to JPG with current quality
                convertToJPG(e.target.result, qualityInput.value);
            };
            
            reader.readAsDataURL(file);
        }
    });

    // Convert image to JPG
    function convertToJPG(imageData, quality) {
        const img = new Image();
        
        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            
            // Convert to JPG with specified quality
            convertedImage = canvas.toDataURL('image/jpeg', quality / 100);
            
            // Display result
            resultImage.src = convertedImage;
            resultImage.classList.remove('d-none');
            downloadBtn.disabled = false;
            copyBtn.disabled = false;
        };
        
        img.src = imageData;
    }

    // Handle download
    downloadBtn.addEventListener('click', function() {
        if (convertedImage) {
            const link = document.createElement('a');
            link.href = convertedImage;
            link.download = 'converted-image.jpg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    });

    // Handle copy Base64
    copyBtn.addEventListener('click', function() {
        if (convertedImage) {
            // Remove the data URL prefix
            const base64Data = convertedImage.split(',')[1];
            
            // Create temporary textarea
            const textarea = document.createElement('textarea');
            textarea.value = base64Data;
            document.body.appendChild(textarea);
            
            // Copy and remove
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            
            // Show success message
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check me-2"></i>Copied!';
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
            }, 2000);
        }
    });
}); 