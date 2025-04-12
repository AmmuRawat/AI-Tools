document.addEventListener('DOMContentLoaded', function() {
    const htmlInput = document.getElementById('htmlInput');
    const markdownOutput = document.getElementById('markdownOutput');
    const conversionStatus = document.getElementById('conversionStatus');
    const convertBtn = document.getElementById('convertBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');

    function convertHTMLToMarkdown(html) {
        // Create a temporary div to parse HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        // Convert common HTML elements to Markdown
        function convertElement(element) {
            let markdown = '';

            // Handle text nodes
            if (element.nodeType === Node.TEXT_NODE) {
                return element.textContent;
            }

            // Convert different HTML elements
            switch (element.tagName?.toLowerCase()) {
                case 'h1':
                    markdown += `# ${element.textContent}\n\n`;
                    break;
                case 'h2':
                    markdown += `## ${element.textContent}\n\n`;
                    break;
                case 'h3':
                    markdown += `### ${element.textContent}\n\n`;
                    break;
                case 'h4':
                    markdown += `#### ${element.textContent}\n\n`;
                    break;
                case 'h5':
                    markdown += `##### ${element.textContent}\n\n`;
                    break;
                case 'h6':
                    markdown += `###### ${element.textContent}\n\n`;
                    break;
                case 'p':
                    markdown += `${element.textContent}\n\n`;
                    break;
                case 'a':
                    const href = element.getAttribute('href');
                    const text = element.textContent;
                    markdown += `[${text}](${href})`;
                    break;
                case 'img':
                    const src = element.getAttribute('src');
                    const alt = element.getAttribute('alt') || '';
                    markdown += `![${alt}](${src})`;
                    break;
                case 'ul':
                case 'ol':
                    const items = Array.from(element.children).map(li => {
                        const prefix = element.tagName.toLowerCase() === 'ol' ? '1. ' : '- ';
                        return prefix + convertElement(li).trim();
                    });
                    markdown += items.join('\n') + '\n\n';
                    break;
                case 'li':
                    markdown += Array.from(element.childNodes)
                        .map(node => convertElement(node))
                        .join('');
                    break;
                case 'strong':
                case 'b':
                    markdown += `**${element.textContent}**`;
                    break;
                case 'em':
                case 'i':
                    markdown += `*${element.textContent}*`;
                    break;
                case 'pre':
                case 'code':
                    const code = element.textContent;
                    markdown += '```\n' + code + '\n```\n\n';
                    break;
                case 'blockquote':
                    const quote = element.textContent.split('\n')
                        .map(line => `> ${line}`)
                        .join('\n');
                    markdown += quote + '\n\n';
                    break;
                case 'hr':
                    markdown += '---\n\n';
                    break;
                default:
                    // Recursively convert child elements
                    markdown += Array.from(element.childNodes)
                        .map(node => convertElement(node))
                        .join('');
            }

            return markdown;
        }

        return convertElement(tempDiv).trim();
    }

    function showConversionStatus(message, isError = false) {
        conversionStatus.innerHTML = isError
            ? `<div class="alert alert-danger">${message}</div>`
            : `<div class="alert alert-success">${message}</div>`;
    }

    function convert() {
        try {
            const html = htmlInput.value.trim();
            if (!html) {
                showConversionStatus('Please enter some HTML to convert', true);
                return;
            }

            const markdown = convertHTMLToMarkdown(html);
            markdownOutput.textContent = markdown;
            showConversionStatus('Conversion successful!');
        } catch (error) {
            showConversionStatus('Error during conversion: ' + error.message, true);
            console.error('Conversion error:', error);
        }
    }

    convertBtn.addEventListener('click', convert);

    clearBtn.addEventListener('click', () => {
        htmlInput.value = '';
        markdownOutput.textContent = '';
        conversionStatus.innerHTML = '';
    });

    copyBtn.addEventListener('click', () => {
        if (markdownOutput.textContent) {
            navigator.clipboard.writeText(markdownOutput.textContent)
                .then(() => {
                    const originalText = copyBtn.innerHTML;
                    copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    setTimeout(() => {
                        copyBtn.innerHTML = originalText;
                    }, 2000);
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                });
        }
    });

    // Add input event listener for real-time conversion
    htmlInput.addEventListener('input', () => {
        if (htmlInput.value.trim() === '') {
            conversionStatus.innerHTML = '';
            markdownOutput.textContent = '';
            return;
        }
        convert();
    });
}); 