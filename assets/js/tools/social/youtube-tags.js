document.addEventListener('DOMContentLoaded', () => {
    const tagsForm = document.getElementById('tagsForm');
    const resultContainer = document.getElementById('resultContainer');
    const errorContainer = document.getElementById('errorContainer');
    const errorMessage = document.getElementById('errorMessage');
    const tagsList = document.getElementById('tagsList');
    const copyTagsBtn = document.getElementById('copyTagsBtn');
    const copyCommaBtn = document.getElementById('copyCommaBtn');
    const thumbnail = document.getElementById('thumbnail');
    const videoTitle = document.getElementById('videoTitle');
    const videoDescription = document.getElementById('videoDescription');

    // Function to extract video ID from URL
    function extractVideoId(url) {
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }

    // Function to create tag element
    function createTagElement(tag) {
        const tagElement = document.createElement('span');
        tagElement.className = 'tag';
        tagElement.textContent = tag;
        tagElement.addEventListener('click', () => copyToClipboard(tag));
        return tagElement;
    }

    // Function to copy text to clipboard
    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            showToast('Copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    }

    // Function to show toast notification
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    }

    // Event listener for copy all tags button
    copyTagsBtn.addEventListener('click', () => {
        const tags = Array.from(tagsList.getElementsByClassName('tag'))
            .map(tag => tag.textContent)
            .join('\n');
        copyToClipboard(tags);
    });

    // Event listener for copy comma-separated tags button
    copyCommaBtn.addEventListener('click', () => {
        const tags = Array.from(tagsList.getElementsByClassName('tag'))
            .map(tag => tag.textContent)
            .join(', ');
        copyToClipboard(tags);
    });

    // Form submission handler
    tagsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const urlInput = document.getElementById('videoUrl');
        const url = urlInput.value.trim();
        
        if (!url) {
            errorMessage.textContent = 'Please enter a YouTube video URL';
            errorContainer.classList.remove('d-none');
            return;
        }

        const videoId = extractVideoId(url);
        if (!videoId) {
            errorMessage.textContent = 'Invalid YouTube video URL';
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
            // In a real implementation, you would need to use the YouTube Data API
            // For demonstration purposes, we'll use mock data
            const mockData = {
                title: 'Sample Video Title',
                description: 'This is a sample video description.',
                thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5']
            };

            // Update video information
            thumbnail.src = mockData.thumbnail;
            videoTitle.textContent = mockData.title;
            videoDescription.textContent = mockData.description;

            // Clear and update tags list
            tagsList.innerHTML = '';
            mockData.tags.forEach(tag => {
                const tagElement = createTagElement(tag);
                tagsList.appendChild(tagElement);
            });

            resultContainer.classList.remove('d-none');
            errorContainer.classList.add('d-none');
        } catch (error) {
            errorMessage.textContent = 'Error fetching video information. Please try again.';
            errorContainer.classList.remove('d-none');
            resultContainer.classList.add('d-none');
        }
    });
}); 