document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const inputText = document.getElementById('inputText');
    const wordCount = document.getElementById('wordCount');
    const charCount = document.getElementById('charCount');
    const sentenceCount = document.getElementById('sentenceCount');
    const paragraphCount = document.getElementById('paragraphCount');
    const charWithSpaces = document.getElementById('charWithSpaces');
    const charWithoutSpaces = document.getElementById('charWithoutSpaces');
    const avgWordLength = document.getElementById('avgWordLength');
    const readingTime = document.getElementById('readingTime');

    // Constants
    const WORDS_PER_MINUTE = 200;

    // Update statistics
    function updateStatistics() {
        const text = inputText.value;
        
        // Word count
        const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
        wordCount.textContent = words;

        // Character count
        charCount.textContent = text.length;
        charWithSpaces.textContent = text.length;
        charWithoutSpaces.textContent = text.replace(/\s/g, '').length;

        // Sentence count
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
        sentenceCount.textContent = sentences;

        // Paragraph count
        const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0).length;
        paragraphCount.textContent = paragraphs;

        // Average word length
        const totalWordLength = text.trim().split(/\s+/).reduce((sum, word) => sum + word.length, 0);
        avgWordLength.textContent = words > 0 ? (totalWordLength / words).toFixed(1) : '0';

        // Reading time
        const minutes = Math.ceil(words / WORDS_PER_MINUTE);
        readingTime.textContent = `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }

    // Update statistics on input
    inputText.addEventListener('input', updateStatistics);

    // Initial update
    updateStatistics();
}); 