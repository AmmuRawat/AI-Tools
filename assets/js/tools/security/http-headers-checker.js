document.addEventListener('DOMContentLoaded', function() {
    const headersCheckerForm = document.getElementById('headersCheckerForm');
    const urlInput = document.getElementById('urlInput');
    const resultContainer = document.getElementById('resultContainer');
    const headersTableBody = document.getElementById('headersTableBody');
    const errorContainer = document.getElementById('errorContainer');
    const errorMessage = document.getElementById('errorMessage');
    const copyButton = document.getElementById('copyResult');

    // Security header checks
    const securityHeaders = {
        'Content-Security-Policy': {
            check: (value) => value && value.length > 0,
            message: 'Protects against XSS and other code injection attacks'
        },
        'X-Content-Type-Options': {
            check: (value) => value === 'nosniff',
            message: 'Prevents MIME type sniffing'
        },
        'X-Frame-Options': {
            check: (value) => ['DENY', 'SAMEORIGIN'].includes(value),
            message: 'Protects against clickjacking'
        },
        'Strict-Transport-Security': {
            check: (value) => value && value.includes('max-age='),
            message: 'Enforces HTTPS connections'
        },
        'X-XSS-Protection': {
            check: (value) => value === '1; mode=block',
            message: 'Enables XSS filtering'
        },
        'Referrer-Policy': {
            check: (value) => value && value.length > 0,
            message: 'Controls referrer information'
        },
        'Permissions-Policy': {
            check: (value) => value && value.length > 0,
            message: 'Controls browser features'
        }
    };

    // Show loading state
    function showLoading() {
        const submitButton = headersCheckerForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Checking...';
    }

    // Hide loading state
    function hideLoading() {
        const submitButton = headersCheckerForm.querySelector('button[type="submit"]');
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-search me-2"></i>Check Headers';
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

    // Get security status
    function getSecurityStatus(header, value) {
        if (!securityHeaders[header]) return null;

        const check = securityHeaders[header].check(value);
        return {
            status: check ? 'good' : 'bad',
            message: securityHeaders[header].message
        };
    }

    // Update UI with headers
    function updateUI(headers) {
        headersTableBody.innerHTML = '';
        
        Object.entries(headers).forEach(([name, value]) => {
            const securityStatus = getSecurityStatus(name, value);
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${name}</td>
                <td>${value}</td>
                <td>
                    ${securityStatus ? `
                        <span class="security-status ${securityStatus.status}">
                            ${securityStatus.status === 'good' ? '✓' : '✗'} ${securityStatus.message}
                        </span>
                    ` : '-'}
                </td>
            `;
            
            headersTableBody.appendChild(row);
        });

        resultContainer.style.display = 'block';
        hideError();
    }

    // Copy results to clipboard
    copyButton.addEventListener('click', function() {
        const headers = Array.from(headersTableBody.querySelectorAll('tr'))
            .map(row => {
                const [name, value, status] = row.querySelectorAll('td');
                return `${name.textContent}: ${value.textContent}`;
            })
            .join('\n');

        navigator.clipboard.writeText(headers).then(() => {
            const originalText = copyButton.innerHTML;
            copyButton.innerHTML = '<i class="fas fa-check me-2"></i>Copied!';
            setTimeout(() => {
                copyButton.innerHTML = originalText;
            }, 2000);
        });
    });

    // Handle form submission
    headersCheckerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const url = urlInput.value.trim();
        if (!url) {
            showError('Please enter a valid URL');
            return;
        }

        try {
            showLoading();
            
            // Use our server endpoint
            const response = await fetch(`http://localhost:3000/api/check-headers?url=${encodeURIComponent(url)}`);
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to check headers');
            }
            
            const data = await response.json();
            updateUI(data.headers);
        } catch (error) {
            console.error('Error checking headers:', error);
            showError(error.message);
        } finally {
            hideLoading();
        }
    });
}); 