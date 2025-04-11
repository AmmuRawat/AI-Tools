document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const inputText = document.getElementById('inputText');
    const totalChars = document.getElementById('totalChars');
    const totalWords = document.getElementById('totalWords');
    const totalLines = document.getElementById('totalLines');
    const charsWithSpaces = document.getElementById('charsWithSpaces');
    const charsWithoutSpaces = document.getElementById('charsWithoutSpaces');
    const totalLetters = document.getElementById('totalLetters');
    const totalNumbers = document.getElementById('totalNumbers');
    const totalSpecialChars = document.getElementById('totalSpecialChars');
    const totalSpaces = document.getElementById('totalSpaces');

    // Update character analysis
    function updateAnalysis() {
        const text = inputText.value;
        
        // Total characters
        totalChars.textContent = text.length;
        charsWithSpaces.textContent = text.length;
        charsWithoutSpaces.textContent = text.replace(/\s/g, '').length;

        // Word count
        const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
        totalWords.textContent = words;

        // Line count
        const lines = text.split(/\n/).filter(line => line.trim().length > 0).length;
        totalLines.textContent = lines;

        // Character type counts
        const letters = text.match(/[a-zA-Z]/g) || [];
        const numbers = text.match(/[0-9]/g) || [];
        const spaces = text.match(/\s/g) || [];
        const specialChars = text.match(/[^a-zA-Z0-9\s]/g) || [];

        totalLetters.textContent = letters.length;
        totalNumbers.textContent = numbers.length;
        totalSpecialChars.textContent = specialChars.length;
        totalSpaces.textContent = spaces.length;
    }

    // Update analysis on input
    inputText.addEventListener('input', updateAnalysis);

    // Initial update
    updateAnalysis();
}); 