document.addEventListener('DOMContentLoaded', function() {
    const imageInput = document.getElementById('imageInput');
    const imagePreview = document.getElementById('imagePreview');
    const resultImage = document.getElementById('resultImage');
    const downloadBtn = document.getElementById('downloadBtn');
    let convertedImage = null;

    // Handle image upload
    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                imagePreview.classList.remove('d-none');
                
                // Convert to PNG
                convertToPNG(e.target.result);
            };
            
            reader.readAsDataURL(file);
        }
    });

    // Convert image to PNG
    function convertToPNG(imageData) {
        const img = new Image();
        
        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            
            // Convert to PNG
            convertedImage = canvas.toDataURL('image/png');
            
            // Display result
            resultImage.src = convertedImage;
            resultImage.classList.remove('d-none');
            downloadBtn.disabled = false;
        };
        
        img.src = imageData;
    }

    // Handle download
    downloadBtn.addEventListener('click', function() {
        if (convertedImage) {
            const link = document.createElement('a');
            link.href = convertedImage;
            link.download = 'converted-image.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    });
}); 