document.addEventListener('DOMContentLoaded', function() {
    const whoisLookupForm = document.getElementById('whoisLookupForm');
    const domainInput = document.getElementById('domainInput');
    const resultContainer = document.getElementById('resultContainer');
    const errorContainer = document.getElementById('errorContainer');
    const errorMessage = document.getElementById('errorMessage');
    const copyButton = document.getElementById('copyResult');
    
    // Result elements
    const resultDomain = document.getElementById('resultDomain');
    const resultRegistrar = document.getElementById('resultRegistrar');
    const resultRegistrant = document.getElementById('resultRegistrant');
    const resultCreationDate = document.getElementById('resultCreationDate');
    const resultExpirationDate = document.getElementById('resultExpirationDate');
    const resultNameServers = document.getElementById('resultNameServers');
    const resultStatus = document.getElementById('resultStatus');

    // Format date
    function formatDate(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleString();
    }

    // Show loading state
    function showLoading() {
        const submitButton = whoisLookupForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Looking up...';
    }

    // Hide loading state
    function hideLoading() {
        const submitButton = whoisLookupForm.querySelector('button[type="submit"]');
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-search me-2"></i>Lookup';
    }

    // Show error message
    function showError(message) {
        errorMessage.textContent = message;
        errorContainer.style.display = 'block';
        resultContainer.style.display = 'none';
    }

    // Hide error message
    function hideError() {
        errorContainer.style.display = 'none';
    }

    // Update UI with whois data
    function updateUI(data) {
        resultDomain.textContent = data.domain || '-';
        resultRegistrar.textContent = data.registrar || '-';
        resultRegistrant.textContent = data.registrant || '-';
        resultCreationDate.textContent = formatDate(data.creationDate);
        resultExpirationDate.textContent = formatDate(data.expirationDate);
        resultNameServers.textContent = data.nameServers?.join(', ') || '-';
        resultStatus.textContent = data.status || '-';

        resultContainer.style.display = 'block';
        hideError();
    }

    // Copy results to clipboard
    copyButton.addEventListener('click', function() {
        const results = [
            `Domain Name: ${resultDomain.textContent}`,
            `Registrar: ${resultRegistrar.textContent}`,
            `Registrant: ${resultRegistrant.textContent}`,
            `Creation Date: ${resultCreationDate.textContent}`,
            `Expiration Date: ${resultExpirationDate.textContent}`,
            `Name Servers: ${resultNameServers.textContent}`,
            `Status: ${resultStatus.textContent}`
        ].join('\n');

        navigator.clipboard.writeText(results).then(() => {
            const originalText = copyButton.innerHTML;
            copyButton.innerHTML = '<i class="fas fa-check me-2"></i>Copied!';
            setTimeout(() => {
                copyButton.innerHTML = originalText;
            }, 2000);
        });
    });

    // Handle form submission
    whoisLookupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const domain = domainInput.value.trim();
        if (!domain) {
            showError('Please enter a domain name');
            return;
        }

        try {
            showLoading();
            
            // Use our server endpoint
            const response = await fetch(`http://localhost:3000/api/whois?domain=${encodeURIComponent(domain)}`);
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to perform whois lookup');
            }
            
            const data = await response.json();
            updateUI(data);
        } catch (error) {
            console.error('Error performing whois lookup:', error);
            showError(error.message);
        } finally {
            hideLoading();
        }
    });
}); 