document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const websiteUrlInput = document.getElementById('websiteUrl');
    const checkTypeSelect = document.getElementById('checkType');
    const minAuthorityInput = document.getElementById('minAuthority');
    const checkBtn = document.getElementById('checkBtn');
    const resultsContainer = document.getElementById('resultsContainer');
    const loadingContainer = document.getElementById('loadingContainer');
    const errorContainer = document.getElementById('errorContainer');
    const totalBacklinksSpan = document.getElementById('totalBacklinks');
    const uniqueDomainsSpan = document.getElementById('uniqueDomains');
    const resultsTable = document.getElementById('resultsTable');
    const backlinkChart = document.getElementById('backlinkChart');

    // Check backlinks
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
            const backlinks = generateSampleBacklinks(20);
            const uniqueDomains = new Set(backlinks.map(link => new URL(link.sourceUrl).hostname)).size;

            // Update totals
            totalBacklinksSpan.textContent = backlinks.length;
            uniqueDomainsSpan.textContent = uniqueDomains;

            // Clear previous results
            resultsTable.innerHTML = '';

            // Add results to table
            backlinks.forEach(backlink => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><a href="${backlink.sourceUrl}" target="_blank">${backlink.sourceUrl}</a></td>
                    <td>
                        <div class="progress" style="height: 20px;">
                            <div class="progress-bar" role="progressbar" style="width: ${backlink.domainAuthority}%">
                                ${backlink.domainAuthority}
                            </div>
                        </div>
                    </td>
                    <td>
                        <span class="badge ${backlink.type === 'dofollow' ? 'bg-success' : 'bg-warning'}">
                            ${backlink.type}
                        </span>
                    </td>
                    <td>${backlink.anchorText}</td>
                `;
                resultsTable.appendChild(row);
            });

            // Create chart
            const typeCounts = {
                dofollow: backlinks.filter(link => link.type === 'dofollow').length,
                nofollow: backlinks.filter(link => link.type === 'nofollow').length
            };

            new Chart(backlinkChart, {
                type: 'pie',
                data: {
                    labels: ['DoFollow', 'NoFollow'],
                    datasets: [{
                        data: [typeCounts.dofollow, typeCounts.nofollow],
                        backgroundColor: ['rgba(40, 167, 69, 0.5)', 'rgba(255, 193, 7, 0.5)'],
                        borderColor: ['rgba(40, 167, 69, 1)', 'rgba(255, 193, 7, 1)'],
                        borderWidth: 1
                    }]
                }
            });

            // Show results
            loadingContainer.classList.add('d-none');
            resultsContainer.classList.remove('d-none');

        } catch (error) {
            showError('An error occurred while checking backlinks. Please try again.');
            console.error('Error:', error);
        }
    });

    // Generate sample backlinks
    function generateSampleBacklinks(count) {
        const backlinks = [];
        const types = ['dofollow', 'nofollow'];
        const anchorTexts = [
            'Click here',
            'Learn more',
            'Read more',
            'Visit website',
            'Check this out',
            'Find out more',
            'Get started',
            'Sign up now',
            'Download now',
            'Try it free'
        ];

        for (let i = 0; i < count; i++) {
            backlinks.push({
                sourceUrl: `https://example${i + 1}.com/page${i + 1}`,
                domainAuthority: Math.floor(Math.random() * 100),
                type: types[Math.floor(Math.random() * types.length)],
                anchorText: anchorTexts[Math.floor(Math.random() * anchorTexts.length)]
            });
        }

        return backlinks;
    }

    // Show error message
    function showError(message) {
        errorContainer.textContent = message;
        errorContainer.classList.remove('d-none');
        loadingContainer.classList.add('d-none');
        resultsContainer.classList.add('d-none');
    }
}); 