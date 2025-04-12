document.addEventListener('DOMContentLoaded', function() {
    // Initialize elements
    const markdownInput = document.getElementById('markdownInput');
    const htmlOutput = document.getElementById('htmlOutput');
    const previewOutput = document.getElementById('previewOutput');
    const convertBtn = document.getElementById('convertBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const conversionStatus = document.getElementById('conversionStatus');
    const formatButtons = document.querySelectorAll('.btn-group button[data-insert]');

    // Configure marked.js options
    marked.setOptions({
        breaks: true,
        gfm: true,
        highlight: function(code, lang) {
            if (lang && hljs.getLanguage(lang)) {
                return hljs.highlight(code, { language: lang }).value;
            }
            return hljs.highlightAuto(code).value;
        }
    });

    // Format button click handler
    formatButtons.forEach(button => {
        button.addEventListener('click', () => {
            const textToInsert = button.getAttribute('data-insert');
            const start = markdownInput.selectionStart;
            const end = markdownInput.selectionEnd;
            const text = markdownInput.value;
            
            markdownInput.value = text.substring(0, start) + textToInsert + text.substring(end);
            markdownInput.focus();
            markdownInput.selectionStart = start + textToInsert.length;
            markdownInput.selectionEnd = start + textToInsert.length;
        });
    });

    // Convert Markdown to HTML
    function convertMarkdown() {
        try {
            const markdown = markdownInput.value;
            const html = marked(markdown);
            
            // Update HTML output
            htmlOutput.textContent = html;
            
            // Update preview
            previewOutput.innerHTML = html;
            
            // Apply syntax highlighting to code blocks in preview
            previewOutput.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
            });
            
            showConversionStatus('Conversion successful!', false);
        } catch (error) {
            showConversionStatus('Error converting Markdown: ' + error.message, true);
            console.error('Conversion error:', error);
        }
    }

    // Show conversion status
    function showConversionStatus(message, isError) {
        conversionStatus.innerHTML = isError
            ? `<div class="alert alert-danger">${message}</div>`
            : `<div class="alert alert-success">${message}</div>`;
    }

    // Convert button click handler
    convertBtn.addEventListener('click', convertMarkdown);

    // Clear button click handler
    clearBtn.addEventListener('click', () => {
        markdownInput.value = '';
        htmlOutput.textContent = '';
        previewOutput.innerHTML = '';
        conversionStatus.innerHTML = '';
    });

    // Copy button click handler
    copyBtn.addEventListener('click', () => {
        if (htmlOutput.textContent) {
            navigator.clipboard.writeText(htmlOutput.textContent)
                .then(() => {
                    const originalText = copyBtn.innerHTML;
                    copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    setTimeout(() => {
                        copyBtn.innerHTML = originalText;
                    }, 2000);
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                    showConversionStatus('Failed to copy to clipboard', true);
                });
        }
    });

    // Download button click handler
    downloadBtn.addEventListener('click', () => {
        if (htmlOutput.textContent) {
            const blob = new Blob([htmlOutput.textContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'converted.html';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    });

    // Real-time conversion on input change
    markdownInput.addEventListener('input', convertMarkdown);

    // Initial conversion if there's content
    if (markdownInput.value) {
        convertMarkdown();
    }
}); 