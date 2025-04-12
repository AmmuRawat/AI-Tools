document.addEventListener('DOMContentLoaded', () => {
    const videoForm = document.getElementById('videoForm');
    const resultContainer = document.getElementById('resultContainer');
    const videoGrid = document.getElementById('videoGrid');
    const errorContainer = document.getElementById('errorContainer');
    const errorMessage = document.getElementById('errorMessage');
    const downloadAllBtn = document.getElementById('downloadAllBtn');

    // Define video qualities
    const videoQualities = [
        { name: 'Highest', quality: 'highest' },
        { name: 'High', quality: 'high' },
        { name: 'Medium', quality: 'medium' },
        { name: 'Low', quality: 'low' }
    ];

    // Function to extract video ID from URL
    function extractVideoId(url) {
        const regex = /facebook\.com\/(?:[^\/]+\/)?(?:videos|watch)\/(\d+)/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }

    // Function to generate video URLs
    function generateVideoUrls(videoId) {
        return videoQualities.map(quality => ({
            quality: quality.name,
            url: `https://www.facebook.com/video.php?v=${videoId}`
        }));
    }

    // Function to create video card
    function createVideoCard(video) {
        const card = document.createElement('div');
        card.className = 'col-md-6 col-lg-4 mb-4';
        card.innerHTML = `
            <div class="video-card">
                <video class="video-preview" controls>
                    <source src="${video.url}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
                <div class="video-overlay">
                    <div class="video-quality">${video.quality} Quality</div>
                    <div class="video-duration">${video.duration || 'Duration not available'}</div>
                </div>
                <button class="download-btn" onclick="downloadVideo('${video.url}', '${video.quality}')">
                    <i class="fas fa-download"></i> Download
                </button>
            </div>
        `;
        return card;
    }

    // Function to download video
    function downloadVideo(url, quality) {
        const a = document.createElement('a');
        a.href = url;
        a.download = `facebook-video-${quality}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    // Event listener for download all button
    downloadAllBtn.addEventListener('click', () => {
        const videos = Array.from(videoGrid.getElementsByClassName('video-card'));
        videos.forEach(video => {
            const url = video.querySelector('video source').src;
            const quality = video.querySelector('.video-quality').textContent.split(' ')[0];
            downloadVideo(url, quality);
        });
    });

    // Form submission handler
    videoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const urlInput = document.getElementById('videoUrl');
        const url = urlInput.value.trim();
        
        if (!url) {
            errorMessage.textContent = 'Please enter a Facebook video URL';
            errorContainer.classList.remove('d-none');
            return;
        }

        const videoId = extractVideoId(url);
        if (!videoId) {
            errorMessage.textContent = 'Invalid Facebook video URL';
            errorContainer.classList.remove('d-none');
            return;
        }

        // Show loading state
        resultContainer.innerHTML = `
            <div id="loadingContainer" class="text-center">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">Fetching video information...</p>
            </div>
        `;

        try {
            const videos = generateVideoUrls(videoId);
            videoGrid.innerHTML = '';
            videos.forEach(video => {
                const card = createVideoCard(video);
                videoGrid.appendChild(card);
            });

            resultContainer.classList.remove('d-none');
            errorContainer.classList.add('d-none');
            downloadAllBtn.classList.remove('d-none');
        } catch (error) {
            errorMessage.textContent = 'Error fetching video information. Please try again.';
            errorContainer.classList.remove('d-none');
            resultContainer.classList.add('d-none');
        }
    });
}); 