document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const websiteUrlInput = document.getElementById('websiteUrl');
    const changeFreqSelect = document.getElementById('changeFreq');
    const prioritySelect = document.getElementById('priority');
    const excludePatternsTextarea = document.getElementById('excludePatterns');
    const generateBtn = document.getElementById('generateBtn');
    const totalUrlsSpan = document.getElementById('totalUrls');
    const fileSizeSpan = document.getElementById('fileSize');
    const sitemapOutput = document.getElementById('sitemapOutput');
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');

    // Generate sitemap when button is clicked
    generateBtn.addEventListener('click', async function() {
        const websiteUrl = websiteUrlInput.value.trim();
        if (!websiteUrl) {
            alert('Please enter a valid website URL');
            return;
        }

        try {
            generateBtn.disabled = true;
            generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Generating...';

            // Fetch website content
            const response = await fetch(websiteUrl);
            const html = await response.text();

            // Parse HTML and extract URLs
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const links = doc.getElementsByTagName('a');
            
            // Get exclude patterns
            const excludePatterns = excludePatternsTextarea.value
                .split('\n')
                .map(pattern => pattern.trim())
                .filter(pattern => pattern);

            // Filter and process URLs
            const urls = new Set();
            for (const link of links) {
                const href = link.href;
                if (href && href.startsWith(websiteUrl)) {
                    // Check if URL matches any exclude pattern
                    const shouldExclude = excludePatterns.some(pattern => {
                        if (pattern.startsWith('*.')) {
                            // File extension pattern
                            return href.endsWith(pattern.substring(1));
                        } else if (pattern.startsWith('/')) {
                            // Path pattern
                            return href.includes(pattern);
                        }
                        return false;
                    });

                    if (!shouldExclude) {
                        urls.add(href);
                    }
                }
            }

            // Generate XML sitemap
            const changeFreq = changeFreqSelect.value;
            const priority = prioritySelect.value;
            const lastmod = new Date().toISOString().split('T')[0];

            let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
            xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

            for (const url of urls) {
                xml += '  <url>\n';
                xml += `    <loc>${url}</loc>\n`;
                xml += `    <lastmod>${lastmod}</lastmod>\n`;
                xml += `    <changefreq>${changeFreq}</changefreq>\n`;
                xml += `    <priority>${priority}</priority>\n`;
                xml += '  </url>\n';
            }

            xml += '</urlset>';

            // Update UI
            sitemapOutput.value = xml;
            totalUrlsSpan.textContent = urls.size;
            fileSizeSpan.textContent = `${(new Blob([xml]).size / 1024).toFixed(2)} KB`;

            // Enable buttons
            copyBtn.disabled = false;
            downloadBtn.disabled = false;

        } catch (error) {
            console.error('Error generating sitemap:', error);
            alert('Error generating sitemap. Please check the website URL and try again.');
        } finally {
            generateBtn.disabled = false;
            generateBtn.innerHTML = '<i class="fas fa-sitemap me-2"></i>Generate Sitemap';
        }
    });

    // Copy sitemap to clipboard
    copyBtn.addEventListener('click', function() {
        sitemapOutput.select();
        document.execCommand('copy');
        alert('Sitemap copied to clipboard!');
    });

    // Download sitemap
    downloadBtn.addEventListener('click', function() {
        const blob = new Blob([sitemapOutput.value], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sitemap.xml';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // Initialize buttons as disabled
    copyBtn.disabled = true;
    downloadBtn.disabled = true;
}); 