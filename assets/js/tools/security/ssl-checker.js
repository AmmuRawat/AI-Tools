document.addEventListener('DOMContentLoaded', function() {
    const sslCheckerForm = document.getElementById('sslCheckerForm');
    const websiteUrlInput = document.getElementById('websiteUrl');
    const resultDomain = document.getElementById('resultDomain');
    const resultIssuer = document.getElementById('resultIssuer');
    const resultValidFrom = document.getElementById('resultValidFrom');
    const resultExpiresOn = document.getElementById('resultExpiresOn');
    const resultDaysRemaining = document.getElementById('resultDaysRemaining');
    const resultStatus = document.getElementById('resultStatus');
    const certificateChain = document.getElementById('certificateChain');
    const checkButton = sslCheckerForm.querySelector('button[type="submit"]');

    // Format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString();
    }

    // Calculate days remaining
    function calculateDaysRemaining(expiryDate) {
        const now = new Date();
        const expiry = new Date(expiryDate);
        const diffTime = expiry - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }

    // Update certificate chain
    function updateCertificateChain(chain) {
        certificateChain.innerHTML = '';
        chain.forEach((cert, index) => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.innerHTML = `
                <div>
                    <strong>${index + 1}. ${cert.subject}</strong><br>
                    <small class="text-muted">Issuer: ${cert.issuer}</small>
                </div>
                <span class="badge bg-${cert.valid ? 'success' : 'danger'}">
                    ${cert.valid ? 'Valid' : 'Invalid'}
                </span>
            `;
            certificateChain.appendChild(li);
        });
    }

    // Update UI with certificate data
    function updateUI(data) {
        resultDomain.textContent = data.domain || 'N/A';
        resultIssuer.textContent = data.issuer || 'N/A';
        resultValidFrom.textContent = data.validFrom ? formatDate(data.validFrom) : 'N/A';
        resultExpiresOn.textContent = data.expiresOn ? formatDate(data.expiresOn) : 'N/A';
        
        if (data.expiresOn) {
            const daysRemaining = calculateDaysRemaining(data.expiresOn);
            resultDaysRemaining.textContent = `${daysRemaining} days`;
            resultDaysRemaining.className = `mb-0 ${daysRemaining <= 30 ? 'text-danger' : 'text-success'}`;
        } else {
            resultDaysRemaining.textContent = 'N/A';
        }

        resultStatus.textContent = data.valid ? 'Valid' : 'Invalid';
        resultStatus.className = `mb-0 ${data.valid ? 'text-success' : 'text-danger'}`;

        if (data.chain) {
            updateCertificateChain(data.chain);
        }
    }

    // Show loading state
    function showLoading() {
        checkButton.disabled = true;
        checkButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Checking...';
    }

    // Hide loading state
    function hideLoading() {
        checkButton.disabled = false;
        checkButton.innerHTML = '<i class="fas fa-shield-alt me-2"></i>Check SSL Certificate';
    }

    // Show error message
    function showError(message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-danger alert-dismissible fade show mt-3';
        alertDiv.innerHTML = `
            <i class="fas fa-exclamation-circle me-2"></i>${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        sslCheckerForm.appendChild(alertDiv);
        setTimeout(() => alertDiv.remove(), 5000);
    }

    // Check SSL certificate
    async function checkSSLCertificate(url) {
        try {
            // Remove protocol if present
            const domain = url.replace(/^https?:\/\//, '');
            
            // Use our server endpoint
            const response = await fetch(`http://localhost:3000/api/check-ssl?domain=${encodeURIComponent(domain)}`);
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to check SSL certificate');
            }
            
            const data = await response.json();
            
            if (data.status === 'in_progress') {
                // If analysis is in progress, wait and retry
                await new Promise(resolve => setTimeout(resolve, 5000));
                return await checkSSLCertificate(url);
            }
            
            return data;
        } catch (error) {
            console.error('Error checking SSL certificate:', error);
            throw error;
        }
    }

    // Handle form submission
    sslCheckerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const url = websiteUrlInput.value.trim();
        if (!url) {
            showError('Please enter a valid URL');
            return;
        }

        try {
            showLoading();
            const data = await checkSSLCertificate(url);
            if (data) {
                updateUI(data);
            }
        } catch (error) {
            showError(error.message);
        } finally {
            hideLoading();
        }
    });
}); 