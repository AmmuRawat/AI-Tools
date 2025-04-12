document.addEventListener('DOMContentLoaded', () => {
    const tweetInput = document.getElementById('tweetInput');
    const characterCount = document.getElementById('characterCount');
    const includeUrl = document.getElementById('includeUrl');
    const includeMedia = document.getElementById('includeMedia');
    const tweetPreview = document.getElementById('tweetPreview');
    const previewText = tweetPreview.querySelector('.preview-text');

    // Constants for Twitter character limits
    const MAX_CHARACTERS = 280;
    const URL_LENGTH = 23;
    const MEDIA_LENGTH = 24;

    // Function to count characters in a string
    function countCharacters(text) {
        // Count emojis as 2 characters each
        const emojiRegex = /[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;
        const emojiCount = (text.match(emojiRegex) || []).length;
        const regularChars = text.replace(emojiRegex, '').length;
        return regularChars + (emojiCount * 2);
    }

    // Function to update character count
    function updateCharacterCount() {
        let count = countCharacters(tweetInput.value);
        
        // Add URL length if checkbox is checked
        if (includeUrl.checked) {
            count += URL_LENGTH;
        }
        
        // Add media length if checkbox is checked
        if (includeMedia.checked) {
            count += MEDIA_LENGTH;
        }

        // Update character count display
        characterCount.textContent = count;
        
        // Update character count color based on remaining characters
        characterCount.classList.remove('warning', 'danger');
        if (count > MAX_CHARACTERS) {
            characterCount.classList.add('danger');
        } else if (count > MAX_CHARACTERS * 0.9) {
            characterCount.classList.add('warning');
        }

        // Update preview
        updatePreview();
    }

    // Function to update tweet preview
    function updatePreview() {
        let preview = tweetInput.value;
        
        // Add URL placeholder if checkbox is checked
        if (includeUrl.checked) {
            preview += '\n\n[URL]';
        }
        
        // Add media placeholder if checkbox is checked
        if (includeMedia.checked) {
            preview += '\n\n[Media]';
        }

        previewText.textContent = preview || 'Your tweet will appear here...';
    }

    // Event listeners
    tweetInput.addEventListener('input', updateCharacterCount);
    includeUrl.addEventListener('change', updateCharacterCount);
    includeMedia.addEventListener('change', updateCharacterCount);

    // Initialize
    updateCharacterCount();
}); 