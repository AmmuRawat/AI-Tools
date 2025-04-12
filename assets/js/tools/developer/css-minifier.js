document.addEventListener('DOMContentLoaded', function() {
    const cssInput = document.getElementById('cssInput');
    const cssOutput = document.getElementById('cssOutput');
    const minificationStatus = document.getElementById('minificationStatus');
    const minifyBtn = document.getElementById('minifyBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const stats = document.getElementById('stats');

    function minifyCSS(css) {
        // Remove comments
        css = css.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '');

        // Remove whitespace
        css = css.replace(/\s+/g, ' ');

        // Remove spaces around selectors and properties
        css = css.replace(/\s*([{};:,])\s*/g, '$1');

        // Remove trailing semicolons
        css = css.replace(/;}/g, '}');

        // Remove units from zero values
        css = css.replace(/(\d+)px/g, function(match, num) {
            return num === '0' ? '0' : match;
        });

        // Optimize color values
        css = css.replace(/#([0-9a-fA-F])\1([0-9a-fA-F])\2([0-9a-fA-F])\3/g, '#$1$2$3');

        // Optimize font-weight values
        css = css.replace(/font-weight:\s*normal/g, 'font-weight:400');
        css = css.replace(/font-weight:\s*bold/g, 'font-weight:700');

        // Compress margin/padding shorthand
        css = css.replace(/margin:\s*0\s+0\s+0\s+0/g, 'margin:0');
        css = css.replace(/padding:\s*0\s+0\s+0\s+0/g, 'padding:0');

        // Remove unnecessary spaces
        css = css.replace(/\s+/g, ' ');
        css = css.trim();

        return css;
    }

    function showMinificationStatus(message, isError = false) {
        minificationStatus.innerHTML = isError
            ? `<div class="alert alert-danger">${message}</div>`
            : `<div class="alert alert-success">${message}</div>`;
    }

    function updateStats(original, minified) {
        const originalSize = original.length;
        const minifiedSize = minified.length;
        const savings = originalSize - minifiedSize;
        const percentage = ((savings / originalSize) * 100).toFixed(2);

        stats.innerHTML = `
            Original: ${originalSize} bytes<br>
            Minified: ${minifiedSize} bytes<br>
            Savings: ${savings} bytes (${percentage}%)
        `;
    }

    function minify() {
        try {
            const css = cssInput.value.trim();
            if (!css) {
                showMinificationStatus('Please enter some CSS to minify', true);
                return;
            }

            const minified = minifyCSS(css);
            cssOutput.textContent = minified;
            showMinificationStatus('Minification successful!');
            updateStats(css, minified);
        } catch (error) {
            showMinificationStatus('Error during minification: ' + error.message, true);
            console.error('Minification error:', error);
        }
    }

    minifyBtn.addEventListener('click', minify);

    clearBtn.addEventListener('click', () => {
        cssInput.value = '';
        cssOutput.textContent = '';
        minificationStatus.innerHTML = '';
        stats.innerHTML = '';
    });

    copyBtn.addEventListener('click', () => {
        if (cssOutput.textContent) {
            navigator.clipboard.writeText(cssOutput.textContent)
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

    // Add input event listener for real-time minification
    cssInput.addEventListener('input', () => {
        if (cssInput.value.trim() === '') {
            minificationStatus.innerHTML = '';
            cssOutput.textContent = '';
            stats.innerHTML = '';
            return;
        }
        minify();
    });
}); 