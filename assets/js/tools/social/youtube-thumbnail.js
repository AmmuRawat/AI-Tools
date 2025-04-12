document.addEventListener('DOMContentLoaded', function() {
    const thumbnailForm = document.getElementById('thumbnailForm');
    const resultContainer = document.getElementById('resultContainer');
    const thumbnailGrid = document.getElementById('thumbnailGrid');
    const errorContainer = document.getElementById('errorContainer');
    const errorMessage = document.getElementById('errorMessage');
    const downloadAllBtn = document.getElementById('downloadAll');

    // YouTube thumbnail qualities and their dimensions
    const thumbnailQualities = [
        { name: 'Default', code: 'default', dimensions: '120x90' },
        { name: 'Medium Quality', code: 'mqdefault', dimensions: '320x180' },
        { name: 'High Quality', code: 'hqdefault', dimensions: '480x360' },
        { name: 'Standard Definition', code: 'sddefault', dimensions: '640x480' },
        { name: 'Maximum Resolution', code: 'maxresdefault', dimensions: '1280x720' }
    ];

    // Extract video ID from URL
    function extractVideoId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    // Generate thumbnail URLs
    function generateThumbnailUrls(videoId) {
        return thumbnailQualities.map(quality => ({
            ...quality,
            url: `https://img.youtube.com/vi/${videoId}/${quality.code}.jpg`
        }));
    }

    // Create thumbnail card
    function createThumbnailCard(thumbnail) {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4';
        
        const card = document.createElement('div');
        card.className = 'thumbnail-card';
        
        const img = document.createElement('img');
        img.className = 'thumbnail-image';
        img.src = thumbnail.url;
        img.alt = `${thumbnail.name} thumbnail`;
        
        const overlay = document.createElement('div');
        overlay.className = 'thumbnail-overlay';
        
        const quality = document.createElement('div');
        quality.className = 'thumbnail-quality';
        quality.textContent = thumbnail.name;
        
        const dimensions = document.createElement('div');
        dimensions.className = 'thumbnail-dimensions';
        dimensions.textContent = thumbnail.dimensions;
        
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'download-btn';
        downloadBtn.innerHTML = '<i class="fas fa-download"></i>';
        downloadBtn.onclick = () => downloadThumbnail(thumbnail);
        
        overlay.appendChild(quality);
        overlay.appendChild(dimensions);
        card.appendChild(img);
        card.appendChild(overlay);
        card.appendChild(downloadBtn);
        col.appendChild(card);
        
        return col;
    }

    // Download thumbnail
    function downloadThumbnail(thumbnail) {
        const link = document.createElement('a');
        link.href = thumbnail.url;
        link.download = `youtube-thumbnail-${thumbnail.code}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Download all thumbnails
    downloadAllBtn.addEventListener('click', function() {
        const thumbnails = Array.from(thumbnailGrid.getElementsByClassName('thumbnail-card'))
            .map(card => ({
                url: card.querySelector('img').src,
                code: card.querySelector('.thumbnail-quality').textContent.toLowerCase().replace(/\s+/g, '-')
            }));
        
        thumbnails.forEach(thumbnail => {
            const link = document.createElement('a');
            link.href = thumbnail.url;
            link.download = `youtube-thumbnail-${thumbnail.code}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    });

    // Handle form submission
    thumbnailForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const videoUrl = document.getElementById('videoUrl').value;
        const videoId = extractVideoId(videoUrl);
        
        if (!videoId) {
            errorMessage.textContent = 'Please enter a valid YouTube video URL';
            errorContainer.style.display = 'block';
            resultContainer.style.display = 'none';
            return;
        }
        
        errorContainer.style.display = 'none';
        thumbnailGrid.innerHTML = '';
        
        const thumbnails = generateThumbnailUrls(videoId);
        thumbnails.forEach(thumbnail => {
            const card = createThumbnailCard(thumbnail);
            thumbnailGrid.appendChild(card);
        });
        
        resultContainer.style.display = 'block';
    });
}); 