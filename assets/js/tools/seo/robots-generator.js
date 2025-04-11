document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const websiteUrlInput = document.getElementById('websiteUrl');
    const sitemapUrlInput = document.getElementById('sitemapUrl');
    const disallowRulesContainer = document.getElementById('disallowRules');
    const generateBtn = document.getElementById('generateBtn');
    const resultsContainer = document.getElementById('resultsContainer');
    const loadingContainer = document.getElementById('loadingContainer');
    const errorContainer = document.getElementById('errorContainer');
    const robotsContent = document.getElementById('robotsContent');
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');

    // Add rule button functionality
    window.addRule = function() {
        const ruleDiv = document.createElement('div');
        ruleDiv.className = 'input-group mb-2';
        ruleDiv.innerHTML = `
            <input type="text" class="form-control" placeholder="/admin/">
            <button class="btn btn-outline-danger" type="button" onclick="removeRule(this)">
                <i class="fas fa-times"></i>
            </button>
        `;
        disallowRulesContainer.appendChild(ruleDiv);
    };

    // Remove rule button functionality
    window.removeRule = function(button) {
        button.closest('.input-group').remove();
    };

    // Generate robots.txt
    generateBtn.addEventListener('click', function() {
        const websiteUrl = websiteUrlInput.value.trim();
        const sitemapUrl = sitemapUrlInput.value.trim();

        if (!websiteUrl) {
            showError('Please enter a valid website URL');
            return;
        }

        try {
            // Show loading state
            loadingContainer.classList.remove('d-none');
            resultsContainer.classList.add('d-none');
            errorContainer.classList.add('d-none');

            // Get disallow rules
            const disallowRules = Array.from(disallowRulesContainer.getElementsByTagName('input'))
                .map(input => input.value.trim())
                .filter(value => value);

            // Generate robots.txt content
            let content = `User-agent: *\n`;
            
            // Add disallow rules
            if (disallowRules.length > 0) {
                disallowRules.forEach(rule => {
                    content += `Disallow: ${rule}\n`;
                });
            } else {
                content += `Disallow:\n`;
            }

            // Add sitemap if provided
            if (sitemapUrl) {
                content += `\nSitemap: ${sitemapUrl}\n`;
            }

            // Update results
            robotsContent.value = content;
            loadingContainer.classList.add('d-none');
            resultsContainer.classList.remove('d-none');

        } catch (error) {
            showError('An error occurred while generating the robots.txt file. Please try again.');
            console.error('Error:', error);
        }
    });

    // Copy to clipboard
    copyBtn.addEventListener('click', function() {
        robotsContent.select();
        document.execCommand('copy');
        showSuccess('Copied to clipboard!');
    });

    // Download file
    downloadBtn.addEventListener('click', function() {
        const blob = new Blob([robotsContent.value], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'robots.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // Show error message
    function showError(message) {
        errorContainer.textContent = message;
        errorContainer.classList.remove('d-none');
        loadingContainer.classList.add('d-none');
        resultsContainer.classList.add('d-none');
    }

    // Show success message
    function showSuccess(message) {
        const successAlert = document.createElement('div');
        successAlert.className = 'alert alert-success alert-dismissible fade show';
        successAlert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        resultsContainer.insertBefore(successAlert, resultsContainer.firstChild);
        setTimeout(() => successAlert.remove(), 3000);
    }
}); 