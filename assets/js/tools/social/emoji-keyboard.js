document.addEventListener('DOMContentLoaded', () => {
    const emojiSearch = document.getElementById('emojiSearch');
    const recentEmojis = document.getElementById('recentEmojis');
    const emojiContainers = {
        all: document.getElementById('allEmojis'),
        smileys: document.getElementById('smileysEmojis'),
        animals: document.getElementById('animalsEmojis'),
        food: document.getElementById('foodEmojis'),
        activities: document.getElementById('activitiesEmojis'),
        travel: document.getElementById('travelEmojis'),
        objects: document.getElementById('objectsEmojis'),
        symbols: document.getElementById('symbolsEmojis')
    };

    // Emoji database
    const emojiDatabase = {
        smileys: [
            { emoji: '😀', name: 'grinning face' },
            { emoji: '😃', name: 'grinning face with big eyes' },
            { emoji: '😄', name: 'grinning face with smiling eyes' },
            { emoji: '😁', name: 'beaming face with smiling eyes' },
            { emoji: '😆', name: 'grinning squinting face' },
            { emoji: '😅', name: 'grinning face with sweat' },
            { emoji: '🤣', name: 'rolling on the floor laughing' },
            { emoji: '😂', name: 'face with tears of joy' },
            { emoji: '🙂', name: 'slightly smiling face' },
            { emoji: '🙃', name: 'upside-down face' }
        ],
        animals: [
            { emoji: '🐶', name: 'dog face' },
            { emoji: '🐱', name: 'cat face' },
            { emoji: '🐭', name: 'mouse face' },
            { emoji: '🐹', name: 'hamster' },
            { emoji: '🐰', name: 'rabbit face' },
            { emoji: '🦊', name: 'fox' },
            { emoji: '🐻', name: 'bear' },
            { emoji: '🐼', name: 'panda' },
            { emoji: '🐨', name: 'koala' },
            { emoji: '🐯', name: 'tiger face' }
        ],
        food: [
            { emoji: '🍎', name: 'red apple' },
            { emoji: '🍐', name: 'pear' },
            { emoji: '🍊', name: 'tangerine' },
            { emoji: '🍋', name: 'lemon' },
            { emoji: '🍌', name: 'banana' },
            { emoji: '🍉', name: 'watermelon' },
            { emoji: '🍇', name: 'grapes' },
            { emoji: '🍓', name: 'strawberry' },
            { emoji: '🍈', name: 'melon' },
            { emoji: '🍒', name: 'cherries' }
        ],
        activities: [
            { emoji: '⚽', name: 'soccer ball' },
            { emoji: '🏀', name: 'basketball' },
            { emoji: '🏈', name: 'football' },
            { emoji: '⚾', name: 'baseball' },
            { emoji: '🎾', name: 'tennis' },
            { emoji: '🏐', name: 'volleyball' },
            { emoji: '🏉', name: 'rugby football' },
            { emoji: '🎱', name: 'pool 8 ball' },
            { emoji: '🏓', name: 'ping pong' },
            { emoji: '🏸', name: 'badminton' }
        ],
        travel: [
            { emoji: '✈️', name: 'airplane' },
            { emoji: '🚀', name: 'rocket' },
            { emoji: '🚁', name: 'helicopter' },
            { emoji: '🚢', name: 'ship' },
            { emoji: '🚂', name: 'locomotive' },
            { emoji: '🚃', name: 'railway car' },
            { emoji: '🚄', name: 'high-speed train' },
            { emoji: '🚅', name: 'bullet train' },
            { emoji: '🚆', name: 'train' },
            { emoji: '🚇', name: 'metro' }
        ],
        objects: [
            { emoji: '⌚', name: 'watch' },
            { emoji: '📱', name: 'mobile phone' },
            { emoji: '💻', name: 'laptop' },
            { emoji: '⌨️', name: 'keyboard' },
            { emoji: '🖥️', name: 'desktop computer' },
            { emoji: '🖨️', name: 'printer' },
            { emoji: '📷', name: 'camera' },
            { emoji: '🎥', name: 'movie camera' },
            { emoji: '📺', name: 'television' },
            { emoji: '📻', name: 'radio' }
        ],
        symbols: [
            { emoji: '❤️', name: 'red heart' },
            { emoji: '💛', name: 'yellow heart' },
            { emoji: '💚', name: 'green heart' },
            { emoji: '💙', name: 'blue heart' },
            { emoji: '💜', name: 'purple heart' },
            { emoji: '🖤', name: 'black heart' },
            { emoji: '💔', name: 'broken heart' },
            { emoji: '❣️', name: 'heart exclamation' },
            { emoji: '💕', name: 'two hearts' },
            { emoji: '💞', name: 'revolving hearts' }
        ]
    };

    // Function to create emoji element
    function createEmojiElement(emojiData) {
        const emojiElement = document.createElement('div');
        emojiElement.className = 'emoji-item';
        emojiElement.textContent = emojiData.emoji;
        emojiElement.title = emojiData.name;
        emojiElement.addEventListener('click', () => copyToClipboard(emojiData.emoji));
        return emojiElement;
    }

    // Function to create recent emoji element
    function createRecentEmojiElement(emojiData) {
        const emojiElement = document.createElement('div');
        emojiElement.className = 'recent-emoji';
        emojiElement.textContent = emojiData.emoji;
        emojiElement.title = emojiData.name;
        emojiElement.addEventListener('click', () => copyToClipboard(emojiData.emoji));
        return emojiElement;
    }

    // Function to copy text to clipboard
    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            showToast('Copied to clipboard!');
            addToRecent(text);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    }

    // Function to show toast notification
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    }

    // Function to add emoji to recent
    function addToRecent(emoji) {
        const emojiData = findEmojiData(emoji);
        if (emojiData) {
            const recentEmojiElement = createRecentEmojiElement(emojiData);
            recentEmojis.insertBefore(recentEmojiElement, recentEmojis.firstChild);
            if (recentEmojis.children.length > 10) {
                recentEmojis.removeChild(recentEmojis.lastChild);
            }
        }
    }

    // Function to find emoji data
    function findEmojiData(emoji) {
        for (const category in emojiDatabase) {
            const emojiData = emojiDatabase[category].find(item => item.emoji === emoji);
            if (emojiData) {
                return emojiData;
            }
        }
        return null;
    }

    // Function to populate emoji containers
    function populateEmojiContainers() {
        // Populate all emojis
        for (const category in emojiDatabase) {
            emojiDatabase[category].forEach(emojiData => {
                const emojiElement = createEmojiElement(emojiData);
                emojiContainers.all.appendChild(emojiElement);
            });
        }

        // Populate category-specific containers
        for (const category in emojiDatabase) {
            emojiDatabase[category].forEach(emojiData => {
                const emojiElement = createEmojiElement(emojiData);
                emojiContainers[category].appendChild(emojiElement);
            });
        }
    }

    // Event listener for search
    emojiSearch.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        for (const containerId in emojiContainers) {
            const container = emojiContainers[containerId];
            const emojiItems = container.getElementsByClassName('emoji-item');
            for (const item of emojiItems) {
                const emojiName = item.title.toLowerCase();
                item.style.display = emojiName.includes(searchTerm) ? 'flex' : 'none';
            }
        }
    });

    // Initialize the emoji keyboard
    populateEmojiContainers();
}); 