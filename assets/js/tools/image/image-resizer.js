document.addEventListener('DOMContentLoaded', function() {
    const imageInput = document.getElementById('imageInput');
    const widthInput = document.getElementById('widthInput');
    const heightInput = document.getElementById('heightInput');
    const maintainAspect = document.getElementById('maintainAspect');
    const imagePreview = document.getElementById('imagePreview');
    const resultImage = document.getElementById('resultImage');
    const downloadBtn = document.getElementById('downloadBtn');
    const copyBtn = document.getElementById('copyBtn');
    let originalImage = null;
    let originalAspectRatio = 1;

    // Handle image upload
    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                originalImage = new Image();
                originalImage.onload = function() {
                    // Set original dimensions
                    widthInput.value = originalImage.width;
                    heightInput.value = originalImage.height;
                    originalAspectRatio = originalImage.width / originalImage.height;
                    
                    // Show preview
                    imagePreview.src = e.target.result;
                    imagePreview.classList.remove('d-none');
                    
                    // Resize image
                    resizeImage();
                };
                originalImage.src = e.target.result;
            };
            
            reader.readAsDataURL(file);
        }
    });

    // Handle dimension changes
    widthInput.addEventListener('input', function() {
        if (maintainAspect.checked && originalImage) {
            heightInput.value = Math.round(this.value / originalAspectRatio);
        }
        resizeImage();
    });

    heightInput.addEventListener('input', function() {
        if (maintainAspect.checked && originalImage) {
            widthInput.value = Math.round(this.value * originalAspectRatio);
        }
        resizeImage();
    });

    // Handle aspect ratio toggle
    maintainAspect.addEventListener('change', function() {
        if (this.checked && originalImage) {
            heightInput.value = Math.round(widthInput.value / originalAspectRatio);
            resizeImage();
        }
    });

    // Resize image function
    function resizeImage() {
        if (!originalImage) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas dimensions
        canvas.width = parseInt(widthInput.value);
        canvas.height = parseInt(heightInput.value);
        
        // Draw and resize image
        ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
        
        // Update result image
        resultImage.src = canvas.toDataURL('image/jpeg', 0.9);
        resultImage.classList.remove('d-none');
        downloadBtn.disabled = false;
        copyBtn.disabled = false;
    }

    // Handle download
    downloadBtn.addEventListener('click', function() {
        if (resultImage.src) {
            const link = document.createElement('a');
            link.href = resultImage.src;
            link.download = 'resized-image.jpg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    });

    // Handle copy Base64
    copyBtn.addEventListener('click', function() {
        if (resultImage.src) {
            // Remove the data URL prefix
            const base64Data = resultImage.src.split(',')[1];
            
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