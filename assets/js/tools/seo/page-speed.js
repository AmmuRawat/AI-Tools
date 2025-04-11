document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const websiteUrlInput = document.getElementById('websiteUrl');
    const deviceTypeSelect = document.getElementById('deviceType');
    const locationSelect = document.getElementById('location');
    const checkBtn = document.getElementById('checkBtn');
    const resultsContainer = document.getElementById('resultsContainer');
    const loadingContainer = document.getElementById('loadingContainer');
    const errorContainer = document.getElementById('errorContainer');
    const performanceScore = document.getElementById('performanceScore');
    const loadTime = document.getElementById('loadTime');
    const metricsTable = document.getElementById('metricsTable');
    const recommendations = document.getElementById('recommendations');

    // Performance metrics
    const metrics = [
        { name: 'First Contentful Paint', weight: 0.15 },
        { name: 'Speed Index', weight: 0.15 },
        { name: 'Largest Contentful Paint', weight: 0.25 },
        { name: 'Time to Interactive', weight: 0.15 },
        { name: 'Total Blocking Time', weight: 0.15 },
        { name: 'Cumulative Layout Shift', weight: 0.15 }
    ];

    // Common recommendations
    const commonRecommendations = [
        'Enable compression',
        'Minify CSS, JavaScript, and HTML',
        'Optimize images',
        'Leverage browser caching',
        'Reduce server response time',
        'Eliminate render-blocking resources',
        'Use a content delivery network (CDN)',
        'Optimize CSS delivery',
        'Prioritize visible content',
        'Remove unused CSS'
    ];

    // Check page speed
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
            const scores = generateSampleScores();
            const totalScore = calculateTotalScore(scores);
            const pageLoadTime = (Math.random() * 3 + 1).toFixed(2);

            // Update performance score
            performanceScore.textContent = totalScore;
            performanceScore.className = `badge ${getScoreClass(totalScore)}`;
            loadTime.textContent = `${pageLoadTime}s`;

            // Update metrics table
            metricsTable.innerHTML = '';
            scores.forEach(metric => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${metric.name}</td>
                    <td>
                        <div class="progress" style="height: 20px;">
                            <div class="progress-bar" role="progressbar" style="width: ${metric.score}%">
                                ${metric.score}
                            </div>
                        </div>
                    </td>
                    <td>
                        <span class="badge ${getScoreClass(metric.score)}">
                            ${getScoreStatus(metric.score)}
                        </span>
                    </td>
                `;
                metricsTable.appendChild(row);
            });

            // Update recommendations
            recommendations.innerHTML = '';
            const selectedRecommendations = getRandomRecommendations(5);
            selectedRecommendations.forEach(rec => {
                const item = document.createElement('div');
                item.className = 'list-group-item';
                item.innerHTML = `
                    <div class="d-flex w-100 justify-content-between">
                        <h6 class="mb-1">${rec}</h6>
                        <small class="text-muted">High Priority</small>
                    </div>
                    <p class="mb-1">Click to learn more about this optimization.</p>
                `;
                recommendations.appendChild(item);
            });

            // Show results
            loadingContainer.classList.add('d-none');
            resultsContainer.classList.remove('d-none');

        } catch (error) {
            showError('An error occurred while checking page speed. Please try again.');
            console.error('Error:', error);
        }
    });

    // Generate sample scores
    function generateSampleScores() {
        return metrics.map(metric => ({
            ...metric,
            score: Math.floor(Math.random() * 100)
        }));
    }

    // Calculate total score
    function calculateTotalScore(scores) {
        return Math.floor(scores.reduce((total, metric) => 
            total + (metric.score * metric.weight), 0));
    }

    // Get score class
    function getScoreClass(score) {
        if (score >= 90) return 'bg-success';
        if (score >= 50) return 'bg-warning';
        return 'bg-danger';
    }

    // Get score status
    function getScoreStatus(score) {
        if (score >= 90) return 'Good';
        if (score >= 50) return 'Needs Improvement';
        return 'Poor';
    }

    // Get random recommendations
    function getRandomRecommendations(count) {
        const shuffled = [...commonRecommendations].sort(() => 0.5 - Math.random());
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