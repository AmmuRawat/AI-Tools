document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const sitemapUrlInput = document.getElementById('sitemapUrl');
    const sitemapContentInput = document.getElementById('sitemapContent');
    const validateBtn = document.getElementById('validateBtn');
    const resultsContainer = document.getElementById('resultsContainer');
    const loadingContainer = document.getElementById('loadingContainer');
    const errorContainer = document.getElementById('errorContainer');
    const validationStatus = document.getElementById('validationStatus');
    const totalUrls = document.getElementById('totalUrls');
    const issuesList = document.getElementById('issuesList');
    const statsTable = document.getElementById('statsTable');

    // Common sitemap issues
    const commonIssues = [
        'Missing XML declaration',
        'Invalid namespace',
        'Missing required tags',
        'Invalid date format',
        'URL too long',
        'Missing protocol',
        'Duplicate URLs',
        'Invalid priority value',
        'Invalid change frequency',
        'Missing lastmod date'
    ];

    // Validate sitemap
    validateBtn.addEventListener('click', async function() {
        const sitemapUrl = sitemapUrlInput.value.trim();
        const sitemapContent = sitemapContentInput.value.trim();

        if (!sitemapUrl && !sitemapContent) {
            showError('Please enter a sitemap URL or paste sitemap content');
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
            const isValid = Math.random() > 0.3; // 70% chance of being valid
            const urlCount = Math.floor(Math.random() * 1000) + 100;
            const issues = getRandomIssues();

            // Update validation status
            validationStatus.textContent = isValid ? 'Valid' : 'Invalid';
            validationStatus.className = `badge ${isValid ? 'bg-success' : 'bg-danger'}`;
            totalUrls.textContent = urlCount;

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

            // Update statistics
            statsTable.innerHTML = '';
            const stats = [
                { metric: 'Total URLs', value: urlCount },
                { metric: 'Average Priority', value: (Math.random() * 0.5 + 0.5).toFixed(2) },
                { metric: 'Last Modified', value: new Date().toISOString().split('T')[0] },
                { metric: 'Change Frequency', value: ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'][Math.floor(Math.random() * 7)] },
                { metric: 'File Size', value: `${(Math.random() * 100).toFixed(2)} KB` }
            ];

            stats.forEach(stat => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${stat.metric}</td>
                    <td>${stat.value}</td>
                `;
                statsTable.appendChild(row);
            });

            // Show results
            loadingContainer.classList.add('d-none');
            resultsContainer.classList.remove('d-none');

        } catch (error) {
            showError('An error occurred while validating the sitemap. Please try again.');
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