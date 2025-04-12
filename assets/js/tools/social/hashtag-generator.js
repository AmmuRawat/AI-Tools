document.addEventListener('DOMContentLoaded', () => {
    const hashtagForm = document.getElementById('hashtagForm');
    const resultContainer = document.getElementById('resultContainer');
    const hashtagsList = document.getElementById('hashtagsList');
    const copyHashtagsBtn = document.getElementById('copyHashtagsBtn');
    const hashtagCount = document.getElementById('hashtagCount');
    const countValue = document.getElementById('countValue');

    // Platform-specific hashtag databases
    const hashtagDatabase = {
        instagram: {
            travel: ['#travel', '#wanderlust', '#travelgram', '#instatravel', '#travelphotography', '#traveltheworld', '#traveling', '#travelling', '#travelblogger', '#travelholic'],
            food: ['#food', '#foodporn', '#foodie', '#instafood', '#foodphotography', '#foodstagram', '#yummy', '#delicious', '#foodlover', '#foodblogger'],
            fashion: ['#fashion', '#style', '#ootd', '#outfit', '#fashionista', '#streetstyle', '#fashionblogger', '#stylish', '#fashionstyle', '#fashiongram'],
            nature: ['#nature', '#naturephotography', '#naturelovers', '#naturegram', '#nature_perfection', '#nature_brilliance', '#natureaddict', '#naturelover', '#nature_photo', '#nature_seekers']
        },
        twitter: {
            travel: ['#Travel', '#TravelTuesday', '#TravelBlogger', '#TravelPhotography', '#TravelGram', '#TravelLife', '#TravelAddict', '#TravelTheWorld', '#TravelDiaries', '#TravelMore'],
            food: ['#Food', '#Foodie', '#FoodPorn', '#FoodPhotography', '#FoodBlogger', '#FoodLover', '#FoodGram', '#FoodPics', '#FoodShare', '#FoodStagram'],
            fashion: ['#Fashion', '#Style', '#OOTD', '#FashionBlogger', '#Fashionista', '#StreetStyle', '#FashionWeek', '#FashionStyle', '#FashionGram', '#FashionDiaries'],
            nature: ['#Nature', '#NaturePhotography', '#NatureLovers', '#NatureGram', '#NaturePerfection', '#NatureBrilliance', '#NatureAddict', '#NatureLover', '#NaturePhoto', '#NatureSeekers']
        },
        facebook: {
            travel: ['#Travel', '#TravelPhotography', '#TravelLife', '#TravelAddict', '#TravelTheWorld', '#TravelDiaries', '#TravelMore', '#TravelBlogger', '#TravelGram', '#TravelTuesday'],
            food: ['#Food', '#Foodie', '#FoodPorn', '#FoodPhotography', '#FoodBlogger', '#FoodLover', '#FoodGram', '#FoodPics', '#FoodShare', '#FoodStagram'],
            fashion: ['#Fashion', '#Style', '#OOTD', '#FashionBlogger', '#Fashionista', '#StreetStyle', '#FashionWeek', '#FashionStyle', '#FashionGram', '#FashionDiaries'],
            nature: ['#Nature', '#NaturePhotography', '#NatureLovers', '#NatureGram', '#NaturePerfection', '#NatureBrilliance', '#NatureAddict', '#NatureLover', '#NaturePhoto', '#NatureSeekers']
        }
    };

    // Update count value display
    hashtagCount.addEventListener('input', () => {
        countValue.textContent = hashtagCount.value;
    });

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

    // Event listener for copy all hashtags button
    copyHashtagsBtn.addEventListener('click', () => {
        const hashtags = Array.from(hashtagsList.getElementsByClassName('hashtag'))
            .map(hashtag => hashtag.textContent)
            .join(' ');
        copyToClipboard(hashtags);
    });

    // Form submission handler
    hashtagForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const keywords = document.getElementById('keywords').value
            .split(',')
            .map(keyword => keyword.trim().toLowerCase())
            .filter(keyword => keyword.length > 0);
        
        if (keywords.length === 0) {
            showToast('Please enter at least one keyword');
            return;
        }

        const selectedPlatforms = Array.from(document.querySelectorAll('.form-check-input:checked'))
            .map(checkbox => checkbox.value);

        if (selectedPlatforms.length === 0) {
            showToast('Please select at least one platform');
            return;
        }

        const count = parseInt(hashtagCount.value);
        const generatedHashtags = new Set();

        // Generate hashtags for each selected platform and keyword
        selectedPlatforms.forEach(platform => {
            keywords.forEach(keyword => {
                if (hashtagDatabase[platform] && hashtagDatabase[platform][keyword]) {
                    hashtagDatabase[platform][keyword]
                        .slice(0, Math.ceil(count / selectedPlatforms.length))
                        .forEach(hashtag => generatedHashtags.add(hashtag));
                }
            });
        });

        // Clear and update hashtags list
        hashtagsList.innerHTML = '';
        Array.from(generatedHashtags)
            .slice(0, count)
            .forEach(hashtag => {
                const hashtagElement = createHashtagElement(hashtag);
                hashtagsList.appendChild(hashtagElement);
            });

        resultContainer.classList.remove('d-none');
    });
}); 