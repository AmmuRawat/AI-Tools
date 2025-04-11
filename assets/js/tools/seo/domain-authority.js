document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const websiteUrlInput = document.getElementById('websiteUrl');
    const checkBtn = document.getElementById('checkBtn');
    const resultsContainer = document.getElementById('resultsContainer');
    const loadingContainer = document.getElementById('loadingContainer');
    const errorContainer = document.getElementById('errorContainer');
    const domainAuthority = document.getElementById('domainAuthority');
    const pageAuthority = document.getElementById('pageAuthority');
    const authorityChart = document.getElementById('authorityChart');
    const authorityFactors = document.getElementById('authorityFactors');

    // Common authority factors
    const commonFactors = [
        'Number of linking root domains',
        'Total number of links',
        'Link quality and relevance',
        'Social signals',
        'Content quality',
        'Website age',
        'Traffic metrics',
        'Brand signals',
        'Technical SEO',
        'User engagement'
    ];

    // Check domain authority
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
            const daScore = Math.floor(Math.random() * 100);
            const paScore = Math.floor(Math.random() * 100);
            const factors = getRandomFactors();

            // Update authority scores
            domainAuthority.textContent = daScore;
            domainAuthority.className = `badge ${getScoreClass(daScore)}`;
            pageAuthority.textContent = paScore;

            // Update authority factors
            authorityFactors.innerHTML = '';
            factors.forEach(factor => {
                const item = document.createElement('div');
                item.className = 'list-group-item';
                item.innerHTML = `
                    <div class="d-flex w-100 justify-content-between">
                        <h6 class="mb-1">${factor}</h6>
                        <small class="text-success">Good</small>
                    </div>
                    <p class="mb-1">This factor positively impacts your domain authority.</p>
                `;
                authorityFactors.appendChild(item);
            });

            // Update chart
            updateChart(daScore, paScore);

            // Show results
            loadingContainer.classList.add('d-none');
            resultsContainer.classList.remove('d-none');

        } catch (error) {
            showError('An error occurred while checking domain authority. Please try again.');
            console.error('Error:', error);
        }
    });

    // Get random factors
    function getRandomFactors() {
        const count = Math.floor(Math.random() * 5) + 3; // 3-7 factors
        const shuffled = [...commonFactors].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    // Get score class
    function getScoreClass(score) {
        if (score >= 80) return 'bg-success';
        if (score >= 60) return 'bg-primary';
        if (score >= 40) return 'bg-warning';
        return 'bg-danger';
    }

    // Update chart
    function updateChart(daScore, paScore) {
        const ctx = authorityChart.getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Domain Authority',
                    data: generateHistory(daScore),
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }, {
                    label: 'Page Authority',
                    data: generateHistory(paScore),
                    borderColor: 'rgb(255, 99, 132)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }

    // Generate history data
    function generateHistory(currentScore) {
        const history = [];
        let score = currentScore;
        for (let i = 0; i < 6; i++) {
            score = Math.max(0, Math.min(100, score + (Math.random() * 10 - 5)));
            history.unshift(score);
        }
        return history;
    }

    // Show error message
    function showError(message) {
        errorContainer.textContent = message;
        errorContainer.classList.remove('d-none');
        loadingContainer.classList.add('d-none');
        resultsContainer.classList.add('d-none');
    }
}); 