document.addEventListener('DOMContentLoaded', function() {
    const urlShortenerForm = document.getElementById('urlShortenerForm');
    const shortenedUrl = document.getElementById('shortenedUrl');
    const copyUrl = document.getElementById('copyUrl');
    const visitUrl = document.getElementById('visitUrl');
    const urlHistory = document.getElementById('urlHistory');

    // Load URL history from localStorage
    let history = JSON.parse(localStorage.getItem('urlHistory')) || [];
    updateHistoryList();

    // Generate random string for URL alias
    function generateRandomAlias(length = 6) {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    // Update history list in the UI
    function updateHistoryList() {
        urlHistory.innerHTML = '';
        history.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.innerHTML = `
                <div>
                    <small class="text-muted">${item.shortUrl}</small><br>
                    <a href="${item.longUrl}" target="_blank" class="text-truncate" style="max-width: 300px; display: inline-block;">
                        ${item.longUrl}
                    </a>
                </div>
                <div>
                    <button class="btn btn-sm btn-outline-primary copy-history" data-index="${index}">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger delete-history" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            urlHistory.appendChild(li);
        });

        // Add event listeners to history buttons
        document.querySelectorAll('.copy-history').forEach(button => {
            button.addEventListener('click', function() {
                const index = this.dataset.index;
                navigator.clipboard.writeText(history[index].shortUrl);
                showCopyFeedback(this);
            });
        });

        document.querySelectorAll('.delete-history').forEach(button => {
            button.addEventListener('click', function() {
                const index = this.dataset.index;
                history.splice(index, 1);
                localStorage.setItem('urlHistory', JSON.stringify(history));
                updateHistoryList();
            });
        });
    }

    // Show copy feedback
    function showCopyFeedback(button) {
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
            button.innerHTML = originalHTML;
        }, 2000);
    }

    // Handle form submission
    urlShortenerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const longUrl = document.getElementById('longUrl').value;
        const customAlias = document.getElementById('customAlias').value.trim();
        
        // Validate URL
        try {
            new URL(longUrl);
        } catch (e) {
            alert('Please enter a valid URL');
            return;
        }

        // Generate short URL
        const alias = customAlias || generateRandomAlias();
        const shortUrl = `https://short.ly/${alias}`;

        // Update UI
        shortenedUrl.value = shortUrl;
        visitUrl.href = shortUrl;

        // Add to history
        history.unshift({
            longUrl: longUrl,
            shortUrl: shortUrl,
            timestamp: new Date().toISOString()
        });

        // Keep only last 10 items in history
        if (history.length > 10) {
            history = history.slice(0, 10);
        }

        // Save to localStorage
        localStorage.setItem('urlHistory', JSON.stringify(history));
        updateHistoryList();
    });

    // Copy URL to clipboard
    copyUrl.addEventListener('click', function() {
        if (shortenedUrl.value) {
            navigator.clipboard.writeText(shortenedUrl.value);
            showCopyFeedback(this);
        }
    });
}); 