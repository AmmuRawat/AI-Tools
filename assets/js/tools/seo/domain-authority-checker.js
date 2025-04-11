document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const domainInput = document.getElementById('domainInput');
    const addDomainBtn = document.getElementById('addDomainBtn');
    const domainsList = document.getElementById('domainsList');
    const checkBtn = document.getElementById('checkBtn');
    const resultsContainer = document.getElementById('resultsContainer');
    const loadingContainer = document.getElementById('loadingContainer');
    const errorContainer = document.getElementById('errorContainer');
    const resultsTable = document.getElementById('resultsTable');
    const authorityChart = document.getElementById('authorityChart');

    // Store domains to check
    const domains = new Set();

    // Add domain to list
    addDomainBtn.addEventListener('click', function() {
        const domain = domainInput.value.trim();
        if (domain && !domains.has(domain)) {
            domains.add(domain);
            addDomainToList(domain);
            domainInput.value = '';
        }
    });

    // Add domain to the UI list
    function addDomainToList(domain) {
        const div = document.createElement('div');
        div.className = 'input-group mb-2';
        div.innerHTML = `
            <input type="text" class="form-control" value="${domain}" readonly>
            <button class="btn btn-outline-danger" type="button" onclick="removeDomain('${domain}')">
                <i class="fas fa-times"></i>
            </button>
        `;
        domainsList.appendChild(div);
    }

    // Remove domain from list
    window.removeDomain = function(domain) {
        domains.delete(domain);
        const elements = domainsList.getElementsByTagName('div');
        for (let i = 0; i < elements.length; i++) {
            if (elements[i].querySelector('input').value === domain) {
                elements[i].remove();
                break;
            }
        }
    };

    // Check domain authority
    checkBtn.addEventListener('click', async function() {
        if (domains.size === 0) {
            showError('Please add at least one domain to check');
            return;
        }

        try {
            // Show loading state
            loadingContainer.classList.remove('d-none');
            resultsContainer.classList.add('d-none');
            errorContainer.classList.add('d-none');

            // Simulate API call (replace with actual API call)
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Clear previous results
            resultsTable.innerHTML = '';

            // Generate sample data
            const results = Array.from(domains).map(domain => ({
                domain,
                authority: Math.floor(Math.random() * 100),
                keywords: Math.floor(Math.random() * 1000),
                backlinks: Math.floor(Math.random() * 10000)
            }));

            // Add results to table
            results.forEach(result => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${result.domain}</td>
                    <td>
                        <div class="progress" style="height: 20px;">
                            <div class="progress-bar" role="progressbar" style="width: ${result.authority}%">
                                ${result.authority}
                            </div>
                        </div>
                    </td>
                    <td>${result.keywords}</td>
                    <td>${result.backlinks}</td>
                `;
                resultsTable.appendChild(row);
            });

            // Create chart
            new Chart(authorityChart, {
                type: 'bar',
                data: {
                    labels: results.map(r => r.domain),
                    datasets: [{
                        label: 'Authority Score',
                        data: results.map(r => r.authority),
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100
                        }
                    }
                }
            });

            // Show results
            loadingContainer.classList.add('d-none');
            resultsContainer.classList.remove('d-none');

        } catch (error) {
            showError('An error occurred while checking domain authority. Please try again.');
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