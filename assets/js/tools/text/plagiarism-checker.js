document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const inputText = document.getElementById('inputText');
    const excludeUrls = document.getElementById('excludeUrls');
    const checkType = document.getElementById('checkType');
    const checkBtn = document.getElementById('checkBtn');
    const resultsContainer = document.getElementById('resultsContainer');
    const similarityBar = document.getElementById('similarityBar');
    const similarityScore = document.getElementById('similarityScore');
    const matchesList = document.getElementById('matchesList');

    // Sample matches for demonstration
    const sampleMatches = [
        {
            url: 'https://example.com/article1',
            title: 'Sample Article 1',
            similarity: 15,
            matchedText: 'This is a sample matched text from the first source.'
        },
        {
            url: 'https://example.com/article2',
            title: 'Sample Article 2',
            similarity: 8,
            matchedText: 'This is another sample matched text from the second source.'
        }
    ];

    // Check for plagiarism
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

            // Simulate API call (replace with actual API call)
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Generate random similarity score (0-30%)
            const similarity = Math.floor(Math.random() * 31);
            
            // Update UI
            updateResults(similarity);
            
            // Show results
            resultsContainer.style.display = 'block';

        } catch (error) {
            showError('An error occurred while checking for plagiarism');
            console.error('Error:', error);
        } finally {
            // Reset button state
            checkBtn.disabled = false;
            checkBtn.innerHTML = '<i class="fas fa-search"></i> Check for Plagiarism';
        }
    });

    // Update results
    function updateResults(similarity) {
        // Update similarity score and progress bar
        similarityScore.textContent = `${similarity}% Similarity`;
        similarityBar.style.width = `${similarity}%`;
        similarityBar.className = `progress-bar ${getSimilarityClass(similarity)}`;

        // Clear previous matches
        matchesList.innerHTML = '';

        if (similarity > 0) {
            // Add matches
            sampleMatches.forEach(match => {
                const matchElement = document.createElement('div');
                matchElement.className = 'card mb-3';
                matchElement.innerHTML = `
                    <div class="card-body">
                        <h6 class="card-title">
                            <a href="${match.url}" target="_blank">${match.title}</a>
                            <span class="badge ${getSimilarityClass(match.similarity)} float-end">${match.similarity}% match</span>
                        </h6>
                        <p class="card-text">${match.matchedText}</p>
                    </div>
                `;
                matchesList.appendChild(matchElement);
            });
        } else {
            matchesList.innerHTML = '<div class="alert alert-success">No plagiarism detected!</div>';
        }
    }

    // Get similarity class based on percentage
    function getSimilarityClass(similarity) {
        if (similarity >= 20) return 'bg-danger';
        if (similarity >= 10) return 'bg-warning';
        return 'bg-success';
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