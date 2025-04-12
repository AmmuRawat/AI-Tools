document.addEventListener('DOMContentLoaded', function() {
    // Initialize elements
    const ipInput = document.getElementById('ipInput');
    const lookupBtn = document.getElementById('lookupBtn');
    const myIpCheckbox = document.getElementById('myIpCheckbox');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const resultsContainer = document.getElementById('resultsContainer');
    const errorContainer = document.getElementById('errorContainer');
    const copyBtn = document.getElementById('copyBtn');
    const clearBtn = document.getElementById('clearBtn');

    // Result elements
    const resultElements = {
        ipAddress: document.getElementById('ipAddress'),
        ipVersion: document.getElementById('ipVersion'),
        location: document.getElementById('location'),
        isp: document.getElementById('isp'),
        organization: document.getElementById('organization'),
        networkClass: document.getElementById('networkClass'),
        ipType: document.getElementById('ipType'),
        reserved: document.getElementById('reserved'),
        specialPurpose: document.getElementById('specialPurpose'),
        asNumber: document.getElementById('asNumber'),
        asName: document.getElementById('asName'),
        hostname: document.getElementById('hostname'),
        country: document.getElementById('country'),
        region: document.getElementById('region'),
        city: document.getElementById('city'),
        postalCode: document.getElementById('postalCode'),
        coordinates: document.getElementById('coordinates')
    };

    // Initialize event listeners
    lookupBtn.addEventListener('click', performLookup);
    myIpCheckbox.addEventListener('change', handleMyIpCheckbox);
    copyBtn.addEventListener('click', copyResults);
    clearBtn.addEventListener('click', clearResults);
    ipInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performLookup();
        }
    });

    // Handle "Use my IP" checkbox
    function handleMyIpCheckbox() {
        if (myIpCheckbox.checked) {
            ipInput.value = '';
            ipInput.disabled = true;
            performLookup();
        } else {
            ipInput.disabled = false;
        }
    }

    // Perform IP lookup
    async function performLookup() {
        const ip = myIpCheckbox.checked ? '' : ipInput.value.trim();
        
        // Validate IP address or domain
        if (!myIpCheckbox.checked && !isValidInput(ip)) {
            showError('Please enter a valid IP address or domain');
            return;
        }

        // Show loading spinner
        loadingSpinner.classList.remove('d-none');
        resultsContainer.classList.add('d-none');
        errorContainer.classList.add('d-none');

        try {
            // Use ipapi.co API for IP lookup
            const response = await fetch(`https://ipapi.co/${ip}/json/`);
            const data = await response.json();

            if (data.error) {
                throw new Error(data.reason || 'Failed to fetch IP information');
            }

            // Update results
            updateResults(data);
        } catch (error) {
            showError(error.message || 'An error occurred while looking up the IP address');
        } finally {
            loadingSpinner.classList.add('d-none');
        }
    }

    // Update results in the UI
    function updateResults(data) {
        // IP Information
        resultElements.ipAddress.textContent = data.ip || 'N/A';
        resultElements.ipVersion.textContent = data.version || 'IPv4';
        resultElements.location.textContent = `${data.city || 'N/A'}, ${data.region || 'N/A'}`;
        resultElements.isp.textContent = data.org || 'N/A';
        resultElements.organization.textContent = data.org || 'N/A';

        // IPv4 Details
        if (data.ip) {
            const ipv4Info = analyzeIPv4(data.ip);
            resultElements.networkClass.textContent = ipv4Info.networkClass;
            resultElements.ipType.textContent = ipv4Info.ipType;
            resultElements.reserved.textContent = ipv4Info.reserved;
            resultElements.specialPurpose.textContent = ipv4Info.specialPurpose;
        } else {
            resultElements.networkClass.textContent = 'N/A';
            resultElements.ipType.textContent = 'N/A';
            resultElements.reserved.textContent = 'N/A';
            resultElements.specialPurpose.textContent = 'N/A';
        }

        // Network Details
        resultElements.asNumber.textContent = data.asn || 'N/A';
        resultElements.asName.textContent = data.org || 'N/A';
        resultElements.hostname.textContent = data.hostname || 'N/A';

        // Geographic Information
        resultElements.country.textContent = `${data.country_name || 'N/A'} (${data.country || 'N/A'})`;
        resultElements.region.textContent = data.region || 'N/A';
        resultElements.city.textContent = data.city || 'N/A';
        resultElements.postalCode.textContent = data.postal || 'N/A';
        resultElements.coordinates.textContent = `${data.latitude || 'N/A'}, ${data.longitude || 'N/A'}`;

        // Show results container
        resultsContainer.classList.remove('d-none');
    }

    // Analyze IPv4 address
    function analyzeIPv4(ip) {
        const octets = ip.split('.').map(Number);
        const firstOctet = octets[0];
        
        // Determine network class
        let networkClass = 'Unknown';
        if (firstOctet >= 1 && firstOctet <= 126) networkClass = 'Class A';
        else if (firstOctet >= 128 && firstOctet <= 191) networkClass = 'Class B';
        else if (firstOctet >= 192 && firstOctet <= 223) networkClass = 'Class C';
        else if (firstOctet >= 224 && firstOctet <= 239) networkClass = 'Class D (Multicast)';
        else if (firstOctet >= 240 && firstOctet <= 255) networkClass = 'Class E (Experimental)';

        // Determine if private or public
        let ipType = 'Public';
        if (
            (firstOctet === 10) ||
            (firstOctet === 172 && octets[1] >= 16 && octets[1] <= 31) ||
            (firstOctet === 192 && octets[1] === 168)
        ) {
            ipType = 'Private';
        }

        // Check for reserved addresses
        let reserved = 'No';
        if (
            (firstOctet === 0) || // Current network
            (firstOctet === 127) || // Loopback
            (firstOctet === 169 && octets[1] === 254) || // Link-local
            (firstOctet === 255 && octets[1] === 255 && octets[2] === 255 && octets[3] === 255) // Broadcast
        ) {
            reserved = 'Yes';
        }

        // Check for special purpose
        let specialPurpose = 'None';
        if (firstOctet === 127) specialPurpose = 'Loopback';
        else if (firstOctet === 169 && octets[1] === 254) specialPurpose = 'Link-local';
        else if (firstOctet === 224 || firstOctet === 225) specialPurpose = 'Multicast';
        else if (firstOctet === 255 && octets[1] === 255 && octets[2] === 255 && octets[3] === 255) specialPurpose = 'Broadcast';

        return {
            networkClass,
            ipType,
            reserved,
            specialPurpose
        };
    }

    // Copy results to clipboard
    function copyResults() {
        const results = [];
        for (const [key, element] of Object.entries(resultElements)) {
            const label = element.previousElementSibling.textContent.replace(':', '');
            const value = element.textContent;
            results.push(`${label}: ${value}`);
        }

        const textToCopy = results.join('\n');
        navigator.clipboard.writeText(textToCopy)
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

    // Clear results
    function clearResults() {
        ipInput.value = '';
        myIpCheckbox.checked = false;
        ipInput.disabled = false;
        resultsContainer.classList.add('d-none');
        errorContainer.classList.add('d-none');
        
        // Clear all result values
        for (const element of Object.values(resultElements)) {
            element.textContent = '';
        }
    }

    // Show error message
    function showError(message) {
        errorContainer.textContent = message;
        errorContainer.classList.remove('d-none');
    }

    // Validate IP address or domain
    function isValidInput(input) {
        if (!input) return false;

        // Check if it's a valid IP address
        const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        if (ipRegex.test(input)) return true;

        // Check if it's a valid domain
        const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
        return domainRegex.test(input);
    }
}); 