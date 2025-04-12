document.addEventListener('DOMContentLoaded', function() {
    const jsInput = document.getElementById('jsInput');
    const jsOutput = document.getElementById('jsOutput');
    const minificationStatus = document.getElementById('minificationStatus');
    const minifyBtn = document.getElementById('minifyBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const stats = document.getElementById('stats');

    // Configuration options
    const options = {
        removeComments: true,
        removeWhitespace: true,
        minifyVariables: false,
        removeConsoleLogs: false
    };

    function minifyJavaScript(js) {
        let result = js;

        // Remove comments
        if (options.removeComments) {
            // Remove multi-line comments
            result = result.replace(/\/\*[\s\S]*?\*\//g, '');
            // Remove single-line comments
            result = result.replace(/\/\/.*$/gm, '');
        }

        // Remove console.log statements if enabled
        if (options.removeConsoleLogs) {
            result = result.replace(/console\.log\([^)]*\);?/g, '');
        }

        // Remove whitespace
        if (options.removeWhitespace) {
            // Remove spaces around operators
            result = result.replace(/\s*([=+\-*\/%&|^<>!?:])\s*/g, '$1');
            // Remove spaces around parentheses
            result = result.replace(/\s*([(){}[\]])\s*/g, '$1');
            // Remove spaces around commas
            result = result.replace(/\s*,\s*/g, ',');
            // Remove spaces around semicolons
            result = result.replace(/\s*;\s*/g, ';');
            // Remove multiple spaces
            result = result.replace(/\s+/g, ' ');
            // Remove spaces at the beginning and end of lines
            result = result.replace(/^\s+|\s+$/gm, '');
            // Remove empty lines
            result = result.replace(/^\s*[\r\n]/gm, '');
        }

        // Optimize boolean expressions
        result = result.replace(/true\s*===\s*true/g, 'true');
        result = result.replace(/false\s*===\s*false/g, 'true');
        result = result.replace(/true\s*===\s*false/g, 'false');
        result = result.replace(/false\s*===\s*true/g, 'false');

        // Remove redundant parentheses
        result = result.replace(/\(([^()]+)\)/g, '$1');

        // Remove trailing semicolons before closing braces
        result = result.replace(/;}/g, '}');

        // Minify variable names if enabled
        if (options.minifyVariables) {
            const variables = new Set();
            const regex = /\b(var|let|const)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g;
            let match;
            
            // Collect all variable names
            while ((match = regex.exec(result)) !== null) {
                variables.add(match[2]);
            }

            // Create a mapping of original to minified names
            const nameMap = new Map();
            let counter = 0;
            variables.forEach(name => {
                nameMap.set(name, `_${counter++}`);
            });

            // Replace variable names
            nameMap.forEach((minified, original) => {
                const regex = new RegExp(`\\b${original}\\b`, 'g');
                result = result.replace(regex, minified);
            });
        }

        return result.trim();
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
            const js = jsInput.value.trim();
            if (!js) {
                showMinificationStatus('Please enter some JavaScript to minify', true);
                return;
            }

            const minified = minifyJavaScript(js);
            jsOutput.textContent = minified;
            showMinificationStatus('Minification successful!');
            updateStats(js, minified);
        } catch (error) {
            showMinificationStatus('Error during minification: ' + error.message, true);
            console.error('Minification error:', error);
        }
    }

    minifyBtn.addEventListener('click', minify);

    clearBtn.addEventListener('click', () => {
        jsInput.value = '';
        jsOutput.textContent = '';
        minificationStatus.innerHTML = '';
        stats.innerHTML = '';
    });

    copyBtn.addEventListener('click', () => {
        if (jsOutput.textContent) {
            navigator.clipboard.writeText(jsOutput.textContent)
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
    jsInput.addEventListener('input', () => {
        if (jsInput.value.trim() === '') {
            minificationStatus.innerHTML = '';
            jsOutput.textContent = '';
            stats.innerHTML = '';
            return;
        }
        minify();
    });
}); 