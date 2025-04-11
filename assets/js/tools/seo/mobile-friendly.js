document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const websiteUrlInput = document.getElementById('websiteUrl');
    const checkBtn = document.getElementById('checkBtn');
    const resultsContainer = document.getElementById('resultsContainer');
    const loadingContainer = document.getElementById('loadingContainer');
    const errorContainer = document.getElementById('errorContainer');
    const mobileStatus = document.getElementById('mobileStatus');
    const loadTime = document.getElementById('loadTime');
    const issuesList = document.getElementById('issuesList');
    const mobilePreview = document.getElementById('mobilePreview');

    // Common mobile-friendly issues
    const commonIssues = [
        'Text too small to read',
        'Clickable elements too close together',
        'Content wider than screen',
        'Viewport not set',
        'Flash content',
        'Fixed-width viewport',
        'Plugins incompatible with mobile',
        'Interstitial pop-ups',
        'Slow page load time',
        'Unplayable content'
    ];

    // Check mobile-friendliness
    checkBtn.addEventListener('click', async function() {
        const websiteUrl = websiteUrlInput.value.trim();
        if (!websiteUrl) {
            showError('Please enter a valid website URL');
            return;
        }

        try {
            // Show loading state
            loadingContainer.classList.remove('d-none');
            resultsContainer.classList.add('d-none');
            errorContainer.classList.add('d-none');

            // Simulate API call (replace with actual API call)
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Generate sample data
            const isMobileFriendly = Math.random() > 0.3; // 70% chance of being mobile-friendly
            const pageLoadTime = (Math.random() * 3 + 1).toFixed(2);
            const issues = getRandomIssues();

            // Update mobile status
            mobileStatus.textContent = isMobileFriendly ? 'Mobile-Friendly' : 'Not Mobile-Friendly';
            mobileStatus.className = `badge ${isMobileFriendly ? 'bg-success' : 'bg-danger'}`;
            loadTime.textContent = `${pageLoadTime}s`;

            // Update issues list
            issuesList.innerHTML = '';
            issues.forEach(issue => {
                const item = document.createElement('div');
                item.className = 'list-group-item list-group-item-danger';
                item.innerHTML = `
                    <div class="d-flex w-100 justify-content-between">
                        <h6 class="mb-1">${issue}</h6>
                        <small>Error</small>
                    </div>
                    <p class="mb-1">Click to learn how to fix this issue.</p>
                `;
                issuesList.appendChild(item);
            });

            // Update mobile preview
            mobilePreview.innerHTML = `
                <div class="mobile-device">
                    <div class="mobile-screen">
                        <iframe src="${websiteUrl}" frameborder="0"></iframe>
                    </div>
                </div>
            `;

            // Show results
            loadingContainer.classList.add('d-none');
            resultsContainer.classList.remove('d-none');

        } catch (error) {
            showError('An error occurred while checking mobile-friendliness. Please try again.');
            console.error('Error:', error);
        }
    });

    // Get random issues
    function getRandomIssues() {
        const count = Math.floor(Math.random() * 5); // 0-4 issues
        const shuffled = [...commonIssues].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    // Show error message
    function showError(message) {
        errorContainer.textContent = message;
        errorContainer.classList.remove('d-none');
        loadingContainer.classList.add('d-none');
        resultsContainer.classList.add('d-none');
    }
}); 