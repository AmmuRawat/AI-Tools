document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const websiteUrlInput = document.getElementById('websiteUrl');
    const checkTypeSelect = document.getElementById('checkType');
    const specificUrlContainer = document.getElementById('specificUrlContainer');
    const specificUrlInput = document.getElementById('specificUrl');
    const checkBtn = document.getElementById('checkBtn');
    const resultsContainer = document.getElementById('resultsContainer');
    const loadingContainer = document.getElementById('loadingContainer');
    const errorContainer = document.getElementById('errorContainer');
    const indexStatus = document.getElementById('indexStatus');
    const lastChecked = document.getElementById('lastChecked');
    const indexedPages = document.getElementById('indexedPages');
    const indexProgress = document.getElementById('indexProgress');
    const searchResults = document.getElementById('searchResults');

    // Show/hide specific URL input based on check type
    checkTypeSelect.addEventListener('change', function() {
        specificUrlContainer.style.display = this.value === 'url' ? 'block' : 'none';
    });

    // Check index status
    checkBtn.addEventListener('click', async function() {
        const websiteUrl = websiteUrlInput.value.trim();
        if (!websiteUrl) {
            showError('Please enter a valid website URL');
            return;
        }

        const checkType = checkTypeSelect.value;
        if (checkType === 'url' && !specificUrlInput.value.trim()) {
            showError('Please enter a specific URL to check');
            return;
        }

        try {
            // Show loading state
            loadingContainer.classList.remove('d-none');
            resultsContainer.classList.add('d-none');
            errorContainer.classList.add('d-none');

            // Simulate API call (replace with actual API call)
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Update results
            const isIndexed = Math.random() > 0.5; // Simulate random result
            const pagesCount = Math.floor(Math.random() * 1000); // Simulate random page count

            indexStatus.textContent = isIndexed ? 'Indexed' : 'Not Indexed';
            indexStatus.className = `badge ${isIndexed ? 'bg-success' : 'bg-danger'}`;
            lastChecked.textContent = new Date().toLocaleString();
            indexedPages.textContent = pagesCount;
            indexProgress.style.width = `${Math.min(100, pagesCount / 10)}%`;

            // Clear previous results
            searchResults.innerHTML = '';

            // Add sample search results
            for (let i = 0; i < 5; i++) {
                const result = document.createElement('a');
                result.href = '#';
                result.className = 'list-group-item list-group-item-action';
                result.innerHTML = `
                    <div class="d-flex w-100 justify-content-between">
                        <h6 class="mb-1">Sample Search Result ${i + 1}</h6>
                        <small>${new Date().toLocaleDateString()}</small>
                    </div>
                    <p class="mb-1">This is a sample search result description...</p>
                    <small class="text-muted">${websiteUrl}/sample-page-${i + 1}</small>
                `;
                searchResults.appendChild(result);
            }

            // Show results
            loadingContainer.classList.add('d-none');
            resultsContainer.classList.remove('d-none');

        } catch (error) {
            showError('An error occurred while checking the index status. Please try again.');
            console.error('Error:', error);
        }
    });

    // Show error message
    function showError(message) {
        errorContainer.textContent = message;
        errorContainer.classList.remove('d-none');
        loadingContainer.classList.add('d-none');
        resultsContainer.classList.add('d-none');
    }
}); 