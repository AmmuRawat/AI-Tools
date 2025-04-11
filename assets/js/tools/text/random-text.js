document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const textType = document.getElementById('textType');
    const textLength = document.getElementById('textLength');
    const outputText = document.getElementById('outputText');
    const generateBtn = document.getElementById('generateBtn');
    const copyBtn = document.getElementById('copyBtn');
    const clearBtn = document.getElementById('clearBtn');

    // Sample words for random text generation
    const words = [
        'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I',
        'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
        'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
        'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
        'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
        'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
        'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
        'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
        'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way',
        'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us'
    ];

    // Sample sentences for random text generation
    const sentences = [
        'The quick brown fox jumps over the lazy dog.',
        'Pack my box with five dozen liquor jugs.',
        'How vexingly quick daft zebras jump!',
        'Bright vixens jump; dozy fowl quack.',
        'Quick zephyrs blow, vexing daft Jim.',
        'Sphinx of black quartz, judge my vow.',
        'Waltz, nymph, for quick jigs vex Bud.',
        'Jackdaws love my big sphinx of quartz.',
        'The five boxing wizards jump quickly.',
        'How quickly daft jumping zebras vex.'
    ];

    // Lorem Ipsum text
    const loremIpsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

    // Generate random text based on type and length
    function generateRandomText(type, length) {
        switch (type) {
            case 'lorem':
                return generateLoremIpsum(length);
            case 'random':
                return generateRandomWords(length);
            case 'sentences':
                return generateRandomSentences(length);
            case 'paragraphs':
                return generateRandomParagraphs(length);
            default:
                return '';
        }
    }

    // Generate Lorem Ipsum text
    function generateLoremIpsum(length) {
        const paragraphs = Math.ceil(length / 50);
        let result = '';
        for (let i = 0; i < paragraphs; i++) {
            result += loremIpsum + '\n\n';
        }
        return result.trim();
    }

    // Generate random words
    function generateRandomWords(length) {
        let result = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * words.length);
            result += words[randomIndex] + ' ';
        }
        return result.trim();
    }

    // Generate random sentences
    function generateRandomSentences(length) {
        let result = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * sentences.length);
            result += sentences[randomIndex] + ' ';
        }
        return result.trim();
    }

    // Generate random paragraphs
    function generateRandomParagraphs(length) {
        let result = '';
        for (let i = 0; i < length; i++) {
            const sentenceCount = Math.floor(Math.random() * 5) + 3;
            let paragraph = '';
            for (let j = 0; j < sentenceCount; j++) {
                const randomIndex = Math.floor(Math.random() * sentences.length);
                paragraph += sentences[randomIndex] + ' ';
            }
            result += paragraph.trim() + '\n\n';
        }
        return result.trim();
    }

    // Generate button click handler
    generateBtn.addEventListener('click', function() {
        const type = textType.value;
        const length = parseInt(textLength.value);

        if (length < 1 || length > 1000) {
            showError('Please enter a length between 1 and 1000');
            return;
        }

        try {
            const generatedText = generateRandomText(type, length);
            outputText.value = generatedText;
            showSuccess('Text generated successfully');
        } catch (error) {
            showError('Error generating text: ' + error.message);
        }
    });

    // Copy button click handler
    copyBtn.addEventListener('click', function() {
        if (!outputText.value) {
            showError('No text to copy');
            return;
        }

        try {
            outputText.select();
            document.execCommand('copy');
            showSuccess('Text copied to clipboard');
        } catch (error) {
            showError('Error copying text: ' + error.message);
        }
    });

    // Clear button click handler
    clearBtn.addEventListener('click', function() {
        outputText.value = '';
        showSuccess('Text cleared');
    });

    // Show success message
    function showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'alert alert-success alert-dismissible fade show';
        successDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        const container = document.querySelector('.container');
        container.insertBefore(successDiv, container.firstChild);
        
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
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