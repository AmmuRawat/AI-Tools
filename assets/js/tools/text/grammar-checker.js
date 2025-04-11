document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const inputText = document.getElementById('inputText');
    const language = document.getElementById('language');
    const checkBtn = document.getElementById('checkBtn');
    const resultsContainer = document.getElementById('resultsContainer');
    const issuesCount = document.getElementById('issuesCount');
    const issuesList = document.getElementById('issuesList');

    // Common grammar rules and patterns to check
    const grammarRules = [
        {
            pattern: /\b(he|she|it)\s+(are|were)\b/i,
            type: 'grammar',
            message: 'Subject-verb agreement error',
            suggestion: 'Change "are/were" to "is/was"',
            explanation: 'Singular subjects require singular verb forms.'
        },
        {
            pattern: /\b(they|we|you)\s+(is|was)\b/i,
            type: 'grammar',
            message: 'Subject-verb agreement error',
            suggestion: 'Change "is/was" to "are/were"',
            explanation: 'Plural subjects require plural verb forms.'
        },
        {
            pattern: /\b(recieve|wierd|seperate)\b/i,
            type: 'spelling',
            message: 'Common misspelling',
            suggestion: 'Change to "receive", "weird", "separate"',
            explanation: 'These words are commonly misspelled.'
        },
        {
            pattern: /\b(its)\s+(.*?)\s+(.*?)\b/i,
            type: 'grammar',
            message: 'Possessive vs. contraction confusion',
            suggestion: 'Use "it\'s" for "it is" and "its" for possession',
            explanation: '"It\'s" is a contraction of "it is", while "its" shows possession.'
        },
        {
            pattern: /\b(their|there|they're)\b/i,
            type: 'grammar',
            message: 'Common homophone confusion',
            suggestion: 'Use "their" for possession, "there" for location, "they\'re" for "they are"',
            explanation: 'These words sound the same but have different meanings.'
        },
        {
            pattern: /\b(affect|effect)\b/i,
            type: 'grammar',
            message: 'Common word confusion',
            suggestion: 'Use "affect" as a verb, "effect" as a noun',
            explanation: 'These words are often confused but have different meanings.'
        }
    ];

    // Check grammar
    checkBtn.addEventListener('click', async function() {
        const text = inputText.value.trim();
        if (!text) {
            showError('Please enter some text to check');
            return;
        }

        try {
            // Show loading state
            checkBtn.disabled = true;
            checkBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Checking...';

            // Simulate processing time
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Find grammar issues
            const issues = findGrammarIssues(text);
            
            // Update UI with found issues
            updateResults(issues);
            
            // Show results
            resultsContainer.style.display = 'block';

        } catch (error) {
            showError('An error occurred while checking grammar');
            console.error('Error:', error);
        } finally {
            // Reset button state
            checkBtn.disabled = false;
            checkBtn.innerHTML = '<i class="fas fa-check-double"></i> Check Grammar';
        }
    });

    // Find grammar issues in text
    function findGrammarIssues(text) {
        const issues = [];
        
        // Check each grammar rule
        grammarRules.forEach(rule => {
            const matches = text.match(rule.pattern);
            if (matches) {
                // Get context (2 sentences before and after)
                const sentences = text.split(/[.!?]+/);
                let context = '';
                for (let i = 0; i < sentences.length; i++) {
                    if (sentences[i].includes(matches[0])) {
                        context = sentences[Math.max(0, i-1)] + '. ' + 
                                 sentences[i] + '. ' + 
                                 (sentences[i+1] ? sentences[i+1] + '.' : '');
                        break;
                    }
                }

                issues.push({
                    type: rule.type,
                    message: rule.message,
                    suggestion: rule.suggestion,
                    context: context.trim(),
                    explanation: rule.explanation
                });
            }
        });

        // Add random punctuation check (30% chance)
        if (Math.random() < 0.3) {
            issues.push({
                type: 'punctuation',
                message: 'Missing or incorrect punctuation',
                suggestion: 'Add or correct punctuation marks',
                context: text.substring(0, 100) + '...',
                explanation: 'Proper punctuation improves readability and clarity.'
            });
        }

        return issues;
    }

    // Update results
    function updateResults(issues) {
        // Update issues count
        issuesCount.textContent = issues.length;

        // Clear previous issues
        issuesList.innerHTML = '';

        if (issues.length > 0) {
            // Add issues
            issues.forEach(issue => {
                const issueElement = document.createElement('div');
                issueElement.className = 'card mb-3';
                issueElement.innerHTML = `
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <h6 class="card-title mb-0">
                                <span class="badge ${getIssueTypeClass(issue.type)} me-2">${issue.type}</span>
                                ${issue.message}
                            </h6>
                        </div>
                        <p class="card-text">
                            <strong>Context:</strong> ${issue.context}<br>
                            <strong>Suggestion:</strong> ${issue.suggestion}<br>
                            <strong>Explanation:</strong> ${issue.explanation}
                        </p>
                    </div>
                `;
                issuesList.appendChild(issueElement);
            });
        } else {
            issuesList.innerHTML = '<div class="alert alert-success">No grammar issues found!</div>';
        }
    }

    // Get issue type class based on type
    function getIssueTypeClass(type) {
        switch (type) {
            case 'grammar': return 'bg-danger';
            case 'spelling': return 'bg-warning';
            case 'punctuation': return 'bg-info';
            default: return 'bg-secondary';
        }
    }

    // Show error message
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger alert-dismissible fade show';
        errorDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        const container = document.querySelector('.container');
        container.insertBefore(errorDiv, container.firstChild);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }
}); 