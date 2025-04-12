document.addEventListener('DOMContentLoaded', function() {
    const photoForm = document.getElementById('photoForm');
    const resultContainer = document.getElementById('resultContainer');
    const photoGrid = document.getElementById('photoGrid');
    const errorContainer = document.getElementById('errorContainer');
    const errorMessage = document.getElementById('errorMessage');
    const downloadAllBtn = document.getElementById('downloadAll');

    // Instagram photo qualities and their dimensions
    const photoQualities = [
        { name: 'Thumbnail', code: 't', dimensions: '150x150' },
        { name: 'Small', code: 's', dimensions: '320x320' },
        { name: 'Medium', code: 'm', dimensions: '640x640' },
        { name: 'Large', code: 'l', dimensions: '1080x1080' }
    ];

    // Extract post ID from URL
    function extractPostId(url) {
        const regExp = /instagram\.com\/p\/([a-zA-Z0-9_-]+)/;
        const match = url.match(regExp);
        return match ? match[1] : null;
    }

    // Generate photo URLs
    function generatePhotoUrls(postId) {
        return photoQualities.map(quality => ({
            ...quality,
            url: `https://instagram.com/p/${postId}/media/?size=${quality.code}`
        }));
    }

    // Create photo card
    function createPhotoCard(photo) {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-3';
        
        const card = document.createElement('div');
        card.className = 'photo-card';
        
        const img = document.createElement('img');
        img.className = 'photo-image';
        img.src = photo.url;
        img.alt = `${photo.name} photo`;
        img.loading = 'lazy';
        
        const overlay = document.createElement('div');
        overlay.className = 'photo-overlay';
        
        const quality = document.createElement('div');
        quality.className = 'photo-quality';
        quality.textContent = photo.name;
        
        const dimensions = document.createElement('div');
        dimensions.className = 'photo-dimensions';
        dimensions.textContent = photo.dimensions;
        
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'download-btn';
        downloadBtn.innerHTML = '<i class="fas fa-download"></i>';
        downloadBtn.onclick = () => downloadPhoto(photo);
        
        overlay.appendChild(quality);
        overlay.appendChild(dimensions);
        card.appendChild(img);
        card.appendChild(overlay);
        card.appendChild(downloadBtn);
        col.appendChild(card);
        
        return col;
    }

    // Download photo
    function downloadPhoto(photo) {
        const link = document.createElement('a');
        link.href = photo.url;
        link.download = `instagram-photo-${photo.code}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Download all photos
    downloadAllBtn.addEventListener('click', function() {
        const photos = Array.from(photoGrid.getElementsByClassName('photo-card'))
            .map(card => ({
                url: card.querySelector('img').src,
                code: card.querySelector('.photo-quality').textContent.toLowerCase()
            }));
        
        photos.forEach(photo => {
            const link = document.createElement('a');
            link.href = photo.url;
            link.download = `instagram-photo-${photo.code}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    });

    // Handle form submission
    photoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const photoUrl = document.getElementById('photoUrl').value;
        const postId = extractPostId(photoUrl);
        
        if (!postId) {
            errorMessage.textContent = 'Please enter a valid Instagram photo URL';
            errorContainer.style.display = 'block';
            resultContainer.style.display = 'none';
            return;
        }
        
        errorContainer.style.display = 'none';
        photoGrid.innerHTML = '';
        
        const photos = generatePhotoUrls(postId);
        photos.forEach(photo => {
            const card = createPhotoCard(photo);
            photoGrid.appendChild(card);
        });
        
        resultContainer.style.display = 'block';
    });
}); 