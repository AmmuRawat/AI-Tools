document.addEventListener('DOMContentLoaded', () => {
    const postForm = document.getElementById('postForm');
    const resultContainer = document.getElementById('resultContainer');
    const generatedPost = document.getElementById('generatedPost');
    const generatedHashtags = document.getElementById('generatedHashtags');
    const copyPostBtn = document.getElementById('copyPostBtn');

    // Post templates for different platforms and types
    const postTemplates = {
        instagram: {
            promotional: [
                "🎉 Exciting news! {topic} is now available!",
                "✨ Introducing our latest {topic} - designed just for you!",
                "🌟 Don't miss out on our amazing {topic} offer!"
            ],
            informative: [
                "📚 Did you know? {topic} can make a big difference!",
                "💡 Here's everything you need to know about {topic}",
                "📖 Let's dive into the world of {topic}"
            ],
            engagement: [
                "🤔 What's your favorite thing about {topic}?",
                "💭 Share your thoughts on {topic} in the comments!",
                "🎯 Tag someone who needs to know about {topic}"
            ],
            announcement: [
                "📢 Big announcement! {topic} is coming soon!",
                "🚀 We're thrilled to announce {topic}",
                "🎊 Mark your calendars! {topic} is happening!"
            ]
        },
        twitter: {
            promotional: [
                "Check out our new {topic}! #NewProduct",
                "Limited time offer: {topic} #Deal",
                "Don't miss this amazing {topic} #SpecialOffer"
            ],
            informative: [
                "Quick tip: {topic} #ProTip",
                "Did you know? {topic} #FunFact",
                "Here's why {topic} matters #Insight"
            ],
            engagement: [
                "What do you think about {topic}? #Poll",
                "Share your experience with {topic} #Community",
                "Tag someone who needs to know about {topic} #Share"
            ],
            announcement: [
                "Breaking: {topic} #News",
                "Exciting update: {topic} #Update",
                "Save the date: {topic} #Event"
            ]
        },
        facebook: {
            promotional: [
                "We're excited to introduce {topic}! Like and share to spread the word!",
                "Special offer alert! {topic} is now available at an amazing price!",
                "Don't miss out on our exclusive {topic} deal!"
            ],
            informative: [
                "Let's talk about {topic} and why it matters to you!",
                "Everything you need to know about {topic} in one post!",
                "Breaking down {topic} - what you need to know!"
            ],
            engagement: [
                "What's your take on {topic}? Share your thoughts below!",
                "Tag a friend who would love to know about {topic}!",
                "How has {topic} impacted your life? Tell us in the comments!"
            ],
            announcement: [
                "We're thrilled to announce {topic}! Stay tuned for more details!",
                "Big news! {topic} is coming soon to our community!",
                "Mark your calendars! {topic} is happening next week!"
            ]
        },
        linkedin: {
            promotional: [
                "We're proud to announce {topic} - a game-changer in our industry!",
                "Introducing {topic} - designed to help professionals like you succeed!",
                "Join us in revolutionizing {topic} with our latest innovation!"
            ],
            informative: [
                "Industry insights: The impact of {topic} on business growth",
                "Professional perspective: Understanding {topic} in today's market",
                "Expert analysis: How {topic} is shaping our industry"
            ],
            engagement: [
                "How has {topic} influenced your professional journey?",
                "Share your expertise on {topic} in the comments below",
                "What are your thoughts on the future of {topic}?"
            ],
            announcement: [
                "We're excited to announce {topic} - a milestone for our company!",
                "Join us in celebrating {topic} - a significant achievement!",
                "Breaking news: {topic} is now available for professionals!"
            ]
        }
    };

    // Hashtag database
    const hashtagDatabase = {
        instagram: {
            promotional: ['#NewProduct', '#SpecialOffer', '#LimitedTime', '#Deal', '#Discount'],
            informative: ['#DidYouKnow', '#FunFact', '#LearnMore', '#Education', '#Knowledge'],
            engagement: ['#Community', '#ShareYourThoughts', '#Poll', '#Discussion', '#Feedback'],
            announcement: ['#BreakingNews', '#Announcement', '#Update', '#ComingSoon', '#Event']
        },
        twitter: {
            promotional: ['#Deal', '#Offer', '#Discount', '#Sale', '#Promotion'],
            informative: ['#Tip', '#Fact', '#Info', '#Learn', '#Knowledge'],
            engagement: ['#Poll', '#Discussion', '#Share', '#Community', '#Feedback'],
            announcement: ['#News', '#Update', '#Event', '#Announcement', '#ComingSoon']
        },
        facebook: {
            promotional: ['#SpecialOffer', '#LimitedTime', '#Deal', '#Discount', '#Promotion'],
            informative: ['#DidYouKnow', '#FunFact', '#LearnMore', '#Education', '#Knowledge'],
            engagement: ['#Community', '#ShareYourThoughts', '#Discussion', '#Feedback', '#Poll'],
            announcement: ['#BreakingNews', '#Announcement', '#Update', '#ComingSoon', '#Event']
        },
        linkedin: {
            promotional: ['#Business', '#Innovation', '#Professional', '#Industry', '#Growth'],
            informative: ['#Insights', '#Knowledge', '#Expertise', '#Learning', '#Development'],
            engagement: ['#Discussion', '#Community', '#Networking', '#Professional', '#Industry'],
            announcement: ['#BusinessNews', '#IndustryUpdate', '#Professional', '#Growth', '#Success']
        }
    };

    // Function to create hashtag element
    function createHashtagElement(hashtag) {
        const hashtagElement = document.createElement('span');
        hashtagElement.className = 'hashtag';
        hashtagElement.textContent = hashtag;
        hashtagElement.addEventListener('click', () => copyToClipboard(hashtag));
        return hashtagElement;
    }

    // Function to copy text to clipboard
    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            showToast('Copied to clipboard!');
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

    // Event listener for copy post button
    copyPostBtn.addEventListener('click', () => {
        const postText = generatedPost.textContent;
        const hashtagsText = Array.from(generatedHashtags.getElementsByClassName('hashtag'))
            .map(hashtag => hashtag.textContent)
            .join(' ');
        copyToClipboard(`${postText}\n\n${hashtagsText}`);
    });

    // Form submission handler
    postForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const platform = document.getElementById('platform').value;
        const postType = document.getElementById('postType').value;
        const topic = document.getElementById('topic').value;
        const tone = document.getElementById('tone').value;
        const keywords = document.getElementById('keywords').value
            .split(',')
            .map(keyword => keyword.trim())
            .filter(keyword => keyword.length > 0);
        const includeHashtags = document.getElementById('hashtags').checked;

        // Select a random template based on platform and post type
        const templates = postTemplates[platform][postType];
        const template = templates[Math.floor(Math.random() * templates.length)];

        // Generate the post
        let post = template.replace('{topic}', topic);

        // Add keywords if provided
        if (keywords.length > 0) {
            post += `\n\n${keywords.join(' ')}`;
        }

        // Update the generated post
        generatedPost.textContent = post;

        // Generate hashtags if enabled
        if (includeHashtags) {
            generatedHashtags.innerHTML = '';
            const hashtags = hashtagDatabase[platform][postType];
            hashtags.forEach(hashtag => {
                const hashtagElement = createHashtagElement(hashtag);
                generatedHashtags.appendChild(hashtagElement);
            });
        } else {
            generatedHashtags.innerHTML = '';
        }

        // Show the result container
        resultContainer.classList.remove('d-none');
    });
}); 