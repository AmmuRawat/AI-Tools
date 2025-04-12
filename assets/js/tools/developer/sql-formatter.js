document.addEventListener('DOMContentLoaded', function() {
    const sqlInput = document.getElementById('sqlInput');
    const sqlOutput = document.getElementById('sqlOutput');
    const formattingStatus = document.getElementById('formattingStatus');
    const formatBtn = document.getElementById('formatBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const stats = document.getElementById('stats');

    // SQL keywords for highlighting
    const sqlKeywords = [
        'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER', 'OUTER', 'LEFT', 'RIGHT', 'FULL',
        'ON', 'AND', 'OR', 'NOT', 'IN', 'EXISTS', 'BETWEEN', 'LIKE', 'IS', 'NULL',
        'GROUP BY', 'ORDER BY', 'HAVING', 'ASC', 'DESC', 'LIMIT', 'OFFSET',
        'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE',
        'ALTER', 'DROP', 'TRUNCATE', 'UNION', 'ALL', 'DISTINCT', 'AS', 'CASE',
        'WHEN', 'THEN', 'ELSE', 'END', 'WITH', 'RECURSIVE'
    ];

    function formatSQL(sql) {
        // Convert to uppercase for consistent formatting
        sql = sql.toUpperCase();

        // Add spaces around parentheses
        sql = sql.replace(/\(/g, ' ( ').replace(/\)/g, ' ) ');

        // Add spaces around commas
        sql = sql.replace(/,/g, ' , ');

        // Split into tokens
        const tokens = sql.split(/\s+/).filter(token => token.length > 0);

        let formatted = '';
        let indentLevel = 0;
        let inSelect = false;
        let inFrom = false;
        let inWhere = false;
        let inGroupBy = false;
        let inOrderBy = false;

        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            const nextToken = tokens[i + 1];

            // Handle indentation
            if (token === 'SELECT') {
                inSelect = true;
                formatted += token + ' ';
            } else if (token === 'FROM') {
                inSelect = false;
                inFrom = true;
                formatted += '\n' + ' '.repeat(indentLevel) + token + ' ';
            } else if (token === 'WHERE') {
                inFrom = false;
                inWhere = true;
                formatted += '\n' + ' '.repeat(indentLevel) + token + ' ';
            } else if (token === 'GROUP' && nextToken === 'BY') {
                inWhere = false;
                inGroupBy = true;
                formatted += '\n' + ' '.repeat(indentLevel) + token + ' ' + nextToken + ' ';
                i++; // Skip next token
            } else if (token === 'ORDER' && nextToken === 'BY') {
                inGroupBy = false;
                inOrderBy = true;
                formatted += '\n' + ' '.repeat(indentLevel) + token + ' ' + nextToken + ' ';
                i++; // Skip next token
            } else if (token === 'JOIN' || token === 'INNER' || token === 'LEFT' || token === 'RIGHT' || token === 'FULL') {
                formatted += '\n' + ' '.repeat(indentLevel) + token + ' ';
            } else if (token === '(') {
                indentLevel += 2;
                formatted += token + '\n' + ' '.repeat(indentLevel);
            } else if (token === ')') {
                indentLevel = Math.max(0, indentLevel - 2);
                formatted += '\n' + ' '.repeat(indentLevel) + token;
            } else if (token === ',') {
                if (inSelect) {
                    formatted += token + '\n' + ' '.repeat(indentLevel + 2);
                } else {
                    formatted += token + ' ';
                }
            } else {
                formatted += token + ' ';
            }
        }

        // Highlight SQL keywords
        sqlKeywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
            formatted = formatted.replace(regex, `<span class="sql-keyword">${keyword}</span>`);
        });

        return formatted.trim();
    }

    function showFormattingStatus(message, isError = false) {
        formattingStatus.innerHTML = isError
            ? `<div class="alert alert-danger">${message}</div>`
            : `<div class="alert alert-success">${message}</div>`;
    }

    function updateStats(original, formatted) {
        const originalLines = original.split('\n').length;
        const formattedLines = formatted.split('\n').length;
        const originalLength = original.length;
        const formattedLength = formatted.length;

        stats.innerHTML = `
            Original: ${originalLines} lines, ${originalLength} chars<br>
            Formatted: ${formattedLines} lines, ${formattedLength} chars
        `;
    }

    function format() {
        try {
            const sql = sqlInput.value.trim();
            if (!sql) {
                showFormattingStatus('Please enter some SQL to format', true);
                return;
            }

            const formatted = formatSQL(sql);
            sqlOutput.innerHTML = formatted;
            showFormattingStatus('Formatting successful!');
            updateStats(sql, formatted);
        } catch (error) {
            showFormattingStatus('Error during formatting: ' + error.message, true);
            console.error('Formatting error:', error);
        }
    }

    formatBtn.addEventListener('click', format);

    clearBtn.addEventListener('click', () => {
        sqlInput.value = '';
        sqlOutput.innerHTML = '';
        formattingStatus.innerHTML = '';
        stats.innerHTML = '';
    });

    copyBtn.addEventListener('click', () => {
        if (sqlOutput.textContent) {
            navigator.clipboard.writeText(sqlOutput.textContent)
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

    // Add input event listener for real-time formatting
    sqlInput.addEventListener('input', () => {
        if (sqlInput.value.trim() === '') {
            formattingStatus.innerHTML = '';
            sqlOutput.innerHTML = '';
            stats.innerHTML = '';
            return;
        }
        format();
    });
}); 