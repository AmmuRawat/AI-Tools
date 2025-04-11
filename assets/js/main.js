// Load header and footer
document.addEventListener('DOMContentLoaded', function() {
    loadComponent('header-container', 'components/header.html');
    loadComponent('footer-container', 'components/footer.html');
    loadTools();
    initializeSearch();
    initializeCategoryFilter();
});

// Function to load components
function loadComponent(containerId, componentPath) {
    fetch(componentPath)
        .then(response => response.text())
        .then(html => {
            document.getElementById(containerId).innerHTML = html;
        })
        .catch(error => console.error('Error loading component:', error));
}

// Tools data
const tools = [
    // Image Tools
    { id: 1, name: 'Image to PNG Converter', category: 'image', path: 'tools/image/image-to-png.html', icon: 'fa-image', description: 'Convert any image format to PNG' },
    { id: 2, name: 'Image to JPG Converter', category: 'image', path: 'tools/image/image-to-jpg.html', icon: 'fa-image', description: 'Convert any image format to JPG' },
    { id: 3, name: 'Image Resizer', category: 'image', path: 'tools/image/image-resizer.html', icon: 'fa-expand', description: 'Resize images while maintaining aspect ratio' },
    { id: 4, name: 'Image Compressor', category: 'image', path: 'tools/image/image-compressor.html', icon: 'fa-compress', description: 'Compress images without losing quality' },
    { id: 5, name: 'Image Cropper', category: 'image', path: 'tools/image/image-cropper.html', icon: 'fa-crop', description: 'Crop images to desired dimensions' },
    { id: 6, name: 'Base64 Image Converter', category: 'image', path: 'tools/image/base64-converter.html', icon: 'fa-code', description: 'Convert images to Base64 and vice versa' },
    { id: 7, name: 'WebP to PNG Converter', category: 'image', path: 'tools/image/webp-to-png.html', icon: 'fa-exchange-alt', description: 'Convert WebP images to PNG format' },
    { id: 8, name: 'GIF Maker', category: 'image', path: 'tools/image/gif-maker.html', icon: 'fa-film', description: 'Create GIFs from multiple images' },
    { id: 9, name: 'QR Code Generator', category: 'image', path: 'tools/image/qr-generator.html', icon: 'fa-qrcode', description: 'Generate QR codes from text or URLs' },
    { id: 10, name: 'Screenshot to PDF', category: 'image', path: 'tools/image/screenshot-to-pdf.html', icon: 'fa-file-pdf', description: 'Convert screenshots to PDF documents' },

    // SEO Tools
    { id: 11, name: 'Meta Tag Generator', category: 'seo', path: 'tools/seo/meta-tag-generator.html', icon: 'fa-tags', description: 'Generate optimized meta tags for your website' },
    { id: 12, name: 'Keyword Density Checker', category: 'seo', path: 'tools/seo/keyword-density.html', icon: 'fa-chart-bar', description: 'Analyze keyword density in your content' },
    { id: 13, name: 'Sitemap Generator', category: 'seo', path: 'tools/seo/sitemap-generator.html', icon: 'fa-sitemap', description: 'Generate XML sitemaps for your website' },
    { id: 14, name: 'Robots.txt Generator', category: 'seo', path: 'tools/seo/robots-generator.html', icon: 'fa-robot', description: 'Create robots.txt files for your website' },
    { id: 15, name: 'Google Index Checker', category: 'seo', path: 'tools/seo/google-index.html', icon: 'fa-google', description: 'Check if your page is indexed by Google' },
    { id: 16, name: 'Domain Authority Checker', category: 'seo', path: 'tools/seo/domain-authority.html', icon: 'fa-globe', description: 'Check domain authority of any website' },
    { id: 17, name: 'Backlink Checker', category: 'seo', path: 'tools/seo/backlink-checker.html', icon: 'fa-link', description: 'Analyze backlinks of any website' },
    { id: 18, name: 'Page Speed Checker', category: 'seo', path: 'tools/seo/page-speed.html', icon: 'fa-tachometer-alt', description: 'Check website loading speed' },
    { id: 19, name: 'XML Sitemap Validator', category: 'seo', path: 'tools/seo/xml-validator.html', icon: 'fa-check-circle', description: 'Validate your XML sitemap' },
    { id: 20, name: 'Mobile-Friendly Test', category: 'seo', path: 'tools/seo/mobile-friendly.html', icon: 'fa-mobile-alt', description: 'Test website mobile-friendliness' },

    // Text Tools
    { id: 21, name: 'Word Counter', category: 'text', path: 'tools/text/word-counter.html', icon: 'fa-font', description: 'Count words and characters in text' },
    { id: 22, name: 'Character Counter', category: 'text', path: 'tools/text/character-counter.html', icon: 'fa-text-width', description: 'Count characters in text' },
    { id: 23, name: 'Case Converter', category: 'text', path: 'tools/text/case-converter.html', icon: 'fa-text-height', description: 'Convert text between different cases' },
    { id: 24, name: 'Plagiarism Checker', category: 'text', path: 'tools/text/plagiarism-checker.html', icon: 'fa-copy', description: 'Check text for plagiarism' },
    { id: 25, name: 'Grammar Checker', category: 'text', path: 'tools/text/grammar-checker.html', icon: 'fa-spell-check', description: 'Check grammar in text' },
    { id: 26, name: 'Text to Speech', category: 'text', path: 'tools/text/text-to-speech.html', icon: 'fa-volume-up', description: 'Convert text to speech' },
    { id: 27, name: 'Speech to Text', category: 'text', path: 'tools/text/speech-to-text.html', icon: 'fa-microphone', description: 'Convert speech to text' },
    { id: 28, name: 'URL Encoder/Decoder', category: 'text', path: 'tools/text/url-encoder.html', icon: 'fa-link', description: 'Encode and decode URLs' },
    { id: 29, name: 'Fancy Text Generator', category: 'text', path: 'tools/text/fancy-text.html', icon: 'fa-magic', description: 'Generate fancy text styles' },
    { id: 30, name: 'Random Text Generator', category: 'text', path: 'tools/text/random-text.html', icon: 'fa-random', description: 'Generate random text' },

    // Developer Tools
    { id: 31, name: 'JSON Formatter', category: 'developer', path: 'tools/developer/json-formatter.html', icon: 'fa-code', description: 'Format and validate JSON' },
    { id: 32, name: 'HTML to Markdown', category: 'developer', path: 'tools/developer/html-to-markdown.html', icon: 'fa-file-code', description: 'Convert HTML to Markdown' },
    { id: 33, name: 'CSS Minifier', category: 'developer', path: 'tools/developer/css-minifier.html', icon: 'fa-css3', description: 'Minify CSS code' },
    { id: 34, name: 'JavaScript Minifier', category: 'developer', path: 'tools/developer/js-minifier.html', icon: 'fa-js', description: 'Minify JavaScript code' },
    { id: 35, name: 'SQL Formatter', category: 'developer', path: 'tools/developer/sql-formatter.html', icon: 'fa-database', description: 'Format SQL queries' },
    { id: 36, name: 'HTACCESS Generator', category: 'developer', path: 'tools/developer/htaccess-generator.html', icon: 'fa-server', description: 'Generate .htaccess rules' },
    { id: 37, name: 'Markdown to HTML', category: 'developer', path: 'tools/developer/markdown-to-html.html', icon: 'fa-file-alt', description: 'Convert Markdown to HTML' },
    { id: 38, name: 'Color Picker', category: 'developer', path: 'tools/developer/color-picker.html', icon: 'fa-palette', description: 'Pick and convert colors' },
    { id: 39, name: 'Base64 Encoder/Decoder', category: 'developer', path: 'tools/developer/base64.html', icon: 'fa-key', description: 'Encode and decode Base64' },
    { id: 40, name: 'IP Address Lookup', category: 'developer', path: 'tools/developer/ip-lookup.html', icon: 'fa-network-wired', description: 'Lookup IP address information' },

    // Math & Calculators
    { id: 41, name: 'Percentage Calculator', category: 'math', path: 'tools/math/percentage.html', icon: 'fa-percent', description: 'Calculate percentages' },
    { id: 42, name: 'Age Calculator', category: 'math', path: 'tools/math/age-calculator.html', icon: 'fa-birthday-cake', description: 'Calculate age from birth date' },
    { id: 43, name: 'BMI Calculator', category: 'math', path: 'tools/math/bmi-calculator.html', icon: 'fa-weight', description: 'Calculate Body Mass Index' },
    { id: 44, name: 'Loan EMI Calculator', category: 'math', path: 'tools/math/loan-emi.html', icon: 'fa-calculator', description: 'Calculate loan EMIs' },
    { id: 45, name: 'Scientific Calculator', category: 'math', path: 'tools/math/scientific-calculator.html', icon: 'fa-square-root-alt', description: 'Advanced scientific calculations' },
    { id: 46, name: 'Discount Calculator', category: 'math', path: 'tools/math/discount-calculator.html', icon: 'fa-tag', description: 'Calculate discounts and savings' },
    { id: 47, name: 'Currency Converter', category: 'math', path: 'tools/math/currency-converter.html', icon: 'fa-money-bill-wave', description: 'Convert between currencies' },
    { id: 48, name: 'Time Zone Converter', category: 'math', path: 'tools/math/timezone-converter.html', icon: 'fa-clock', description: 'Convert between time zones' },
    { id: 49, name: 'Binary Converter', category: 'math', path: 'tools/math/binary-converter.html', icon: 'fa-hashtag', description: 'Convert between number systems' },
    { id: 50, name: 'Tip Calculator', category: 'math', path: 'tools/math/tip-calculator.html', icon: 'fa-utensils', description: 'Calculate tips and splits' },

    // Unit Converters
    { id: 51, name: 'Length Converter', category: 'unit', path: 'tools/unit/length-converter.html', icon: 'fa-ruler', description: 'Convert between length units' },
    { id: 52, name: 'Weight Converter', category: 'unit', path: 'tools/unit/weight-converter.html', icon: 'fa-weight-hanging', description: 'Convert between weight units' },
    { id: 53, name: 'Speed Converter', category: 'unit', path: 'tools/unit/speed-converter.html', icon: 'fa-tachometer-alt', description: 'Convert between speed units' },
    { id: 54, name: 'Temperature Converter', category: 'unit', path: 'tools/unit/temperature-converter.html', icon: 'fa-thermometer-half', description: 'Convert between temperature units' },
    { id: 55, name: 'Volume Converter', category: 'unit', path: 'tools/unit/volume-converter.html', icon: 'fa-flask', description: 'Convert between volume units' },
    { id: 56, name: 'Data Storage Converter', category: 'unit', path: 'tools/unit/data-converter.html', icon: 'fa-hdd', description: 'Convert between data storage units' },
    { id: 57, name: 'Energy Converter', category: 'unit', path: 'tools/unit/energy-converter.html', icon: 'fa-bolt', description: 'Convert between energy units' },
    { id: 58, name: 'Pressure Converter', category: 'unit', path: 'tools/unit/pressure-converter.html', icon: 'fa-compress-arrows-alt', description: 'Convert between pressure units' },
    { id: 59, name: 'Fuel Efficiency Converter', category: 'unit', path: 'tools/unit/fuel-converter.html', icon: 'fa-gas-pump', description: 'Convert between fuel efficiency units' },
    { id: 60, name: 'Angle Converter', category: 'unit', path: 'tools/unit/angle-converter.html', icon: 'fa-compass', description: 'Convert between angle units' },

    // Security & Encryption Tools
    { id: 61, name: 'MD5 Hash Generator', category: 'security', path: 'tools/security/md5-generator.html', icon: 'fa-lock', description: 'Generate MD5 hashes' },
    { id: 62, name: 'SHA256 Hash Generator', category: 'security', path: 'tools/security/sha256-generator.html', icon: 'fa-shield-alt', description: 'Generate SHA256 hashes' },
    { id: 63, name: 'Password Generator', category: 'security', path: 'tools/security/password-generator.html', icon: 'fa-key', description: 'Generate secure passwords' },
    { id: 64, name: 'Random String Generator', category: 'security', path: 'tools/security/random-string.html', icon: 'fa-random', description: 'Generate random strings' },
    { id: 65, name: 'URL Shortener', category: 'security', path: 'tools/security/url-shortener.html', icon: 'fa-link', description: 'Shorten long URLs' },
    { id: 66, name: 'IP Geolocation', category: 'security', path: 'tools/security/ip-geolocation.html', icon: 'fa-map-marker-alt', description: 'Find IP location' },
    { id: 67, name: 'SSL Certificate Checker', category: 'security', path: 'tools/security/ssl-checker.html', icon: 'fa-certificate', description: 'Check SSL certificates' },
    { id: 68, name: 'Whois Lookup', category: 'security', path: 'tools/security/whois-lookup.html', icon: 'fa-search', description: 'Lookup domain information' },
    { id: 69, name: 'HTTP Headers Checker', category: 'security', path: 'tools/security/http-headers.html', icon: 'fa-heading', description: 'Check HTTP headers' },
    { id: 70, name: 'Privacy Policy Generator', category: 'security', path: 'tools/security/privacy-policy.html', icon: 'fa-file-contract', description: 'Generate privacy policies' },

    // Social Media Tools
    { id: 71, name: 'YouTube Thumbnail Downloader', category: 'social', path: 'tools/social/youtube-thumbnail.html', icon: 'fa-youtube', description: 'Download YouTube thumbnails' },
    { id: 72, name: 'Instagram Photo Downloader', category: 'social', path: 'tools/social/instagram-downloader.html', icon: 'fa-instagram', description: 'Download Instagram photos' },
    { id: 73, name: 'Twitter Video Downloader', category: 'social', path: 'tools/social/twitter-downloader.html', icon: 'fa-twitter', description: 'Download Twitter videos' },
    { id: 74, name: 'Facebook Video Downloader', category: 'social', path: 'tools/social/facebook-downloader.html', icon: 'fa-facebook', description: 'Download Facebook videos' },
    { id: 75, name: 'TikTok Video Downloader', category: 'social', path: 'tools/social/tiktok-downloader.html', icon: 'fa-music', description: 'Download TikTok videos' },
    { id: 76, name: 'YouTube Tags Extractor', category: 'social', path: 'tools/social/youtube-tags.html', icon: 'fa-tags', description: 'Extract YouTube video tags' },
    { id: 77, name: 'Hashtag Generator', category: 'social', path: 'tools/social/hashtag-generator.html', icon: 'fa-hashtag', description: 'Generate social media hashtags' },
    { id: 78, name: 'Social Media Post Generator', category: 'social', path: 'tools/social/post-generator.html', icon: 'fa-share-alt', description: 'Generate social media posts' },
    { id: 79, name: 'Emoji Keyboard', category: 'social', path: 'tools/social/emoji-keyboard.html', icon: 'fa-smile', description: 'Copy and paste emojis' },
    { id: 80, name: 'Twitter Character Counter', category: 'social', path: 'tools/social/twitter-counter.html', icon: 'fa-twitter', description: 'Count Twitter characters' },

    // Miscellaneous Tools
    { id: 81, name: 'Barcode Generator', category: 'misc', path: 'tools/misc/barcode-generator.html', icon: 'fa-barcode', description: 'Generate barcodes' },
    { id: 82, name: 'Meme Generator', category: 'misc', path: 'tools/misc/meme-generator.html', icon: 'fa-laugh', description: 'Create memes' },
    { id: 83, name: 'Resume Builder', category: 'misc', path: 'tools/misc/resume-builder.html', icon: 'fa-file-alt', description: 'Build professional resumes' },
    { id: 84, name: 'Invoice Generator', category: 'misc', path: 'tools/misc/invoice-generator.html', icon: 'fa-file-invoice', description: 'Generate invoices' },
    { id: 85, name: 'Business Name Generator', category: 'misc', path: 'tools/misc/business-name.html', icon: 'fa-building', description: 'Generate business names' },
    { id: 86, name: 'Lottery Number Generator', category: 'misc', path: 'tools/misc/lottery-generator.html', icon: 'fa-ticket-alt', description: 'Generate lottery numbers' },
    { id: 87, name: 'Coin Flip Simulator', category: 'misc', path: 'tools/misc/coin-flip.html', icon: 'fa-coins', description: 'Flip a virtual coin' },
    { id: 88, name: 'Random Number Generator', category: 'misc', path: 'tools/misc/random-number.html', icon: 'fa-dice', description: 'Generate random numbers' },
    { id: 89, name: 'Dice Roller', category: 'misc', path: 'tools/misc/dice-roller.html', icon: 'fa-dice-six', description: 'Roll virtual dice' },
    { id: 90, name: 'Internet Speed Test', category: 'misc', path: 'tools/misc/speed-test.html', icon: 'fa-tachometer-alt', description: 'Test internet speed' },
    { id: 91, name: 'Daily Planner', category: 'misc', path: 'tools/misc/daily-planner.html', icon: 'fa-calendar-alt', description: 'Create daily plans' },
    { id: 92, name: 'Wedding Invitation Generator', category: 'misc', path: 'tools/misc/wedding-invitation.html', icon: 'fa-ring', description: 'Generate wedding invitations' },
    { id: 93, name: 'Story Plot Generator', category: 'misc', path: 'tools/misc/story-plot.html', icon: 'fa-book', description: 'Generate story plots' },
    { id: 94, name: 'E-book Creator', category: 'misc', path: 'tools/misc/ebook-creator.html', icon: 'fa-book-open', description: 'Create e-books' },
    { id: 95, name: 'AI Chatbot Demo', category: 'misc', path: 'tools/misc/ai-chatbot.html', icon: 'fa-robot', description: 'Try our AI chatbot' },
    { id: 96, name: 'IP Address Tracker', category: 'misc', path: 'tools/misc/ip-tracker.html', icon: 'fa-map-marker-alt', description: 'Track IP addresses' },
    { id: 97, name: 'Fake Address Generator', category: 'misc', path: 'tools/misc/fake-address.html', icon: 'fa-map', description: 'Generate fake addresses' },
    { id: 98, name: 'Electric Bill Calculator', category: 'misc', path: 'tools/misc/electric-bill.html', icon: 'fa-bolt', description: 'Calculate electric bills' },
    { id: 99, name: 'Leap Year Checker', category: 'misc', path: 'tools/misc/leap-year.html', icon: 'fa-calendar-check', description: 'Check for leap years' },
    { id: 100, name: 'Numerology Calculator', category: 'misc', path: 'tools/misc/numerology.html', icon: 'fa-calculator', description: 'Calculate name numerology' }
];

// Function to load tools into the grid
function loadTools() {
    const toolsGrid = document.getElementById('toolsGrid');
    toolsGrid.innerHTML = '';

    tools.forEach(tool => {
        const toolCard = createToolCard(tool);
        toolsGrid.appendChild(toolCard);
    });
}

// Function to create tool card
function createToolCard(tool) {
    const col = document.createElement('div');
    col.className = 'col-md-4 col-lg-3 mb-4';
    
    col.innerHTML = `
        <div class="card h-100" data-category="${tool.category}">
            <div class="card-body text-center">
                <i class="fas ${tool.icon} fa-3x mb-3 text-primary"></i>
                <h5 class="card-title">${tool.name}</h5>
                <p class="card-text small text-muted">${tool.description}</p>
                <a href="${tool.path}" class="btn btn-primary">Use Tool</a>
            </div>
        </div>
    `;
    
    return col;
}

// Initialize search functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const toolsGrid = document.getElementById('toolsGrid');
            const cards = toolsGrid.getElementsByClassName('col-md-4');
            
            Array.from(cards).forEach(card => {
                const title = card.querySelector('.card-title').textContent.toLowerCase();
                const description = card.querySelector('.card-text').textContent.toLowerCase();
                card.style.display = (title.includes(searchTerm) || description.includes(searchTerm)) ? '' : 'none';
            });
        });
    }
}

// Initialize category filtering
function initializeCategoryFilter() {
    document.querySelectorAll('.category-btn').forEach(button => {
        button.addEventListener('click', function() {
            const category = this.dataset.category;
            const toolsGrid = document.getElementById('toolsGrid');
            const cards = toolsGrid.getElementsByClassName('col-md-4');
            
            // Update active button
            document.querySelectorAll('.category-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            Array.from(cards).forEach(card => {
                const toolCategory = card.querySelector('.card').dataset.category;
                if (category === 'all' || toolCategory === category) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
} 