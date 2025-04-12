document.addEventListener('DOMContentLoaded', function() {
    const ipGeolocationForm = document.getElementById('ipGeolocationForm');
    const ipAddressInput = document.getElementById('ipAddress');
    const getMyIPButton = document.getElementById('getMyIP');
    const resultIp = document.getElementById('resultIp');
    const resultLocation = document.getElementById('resultLocation');
    const resultIsp = document.getElementById('resultIsp');
    const resultTimezone = document.getElementById('resultTimezone');
    const resultOrg = document.getElementById('resultOrg');
    const resultAs = document.getElementById('resultAs');
    let map = null;
    let marker = null;

    // Initialize map
    function initMap() {
        map = L.map('map').setView([0, 0], 2);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
    }

    // Update map with new location
    function updateMap(lat, lng) {
        if (marker) {
            map.removeLayer(marker);
        }
        map.setView([lat, lng], 10);
        marker = L.marker([lat, lng]).addTo(map);
    }

    // Get current user's IP
    async function getCurrentIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            console.error('Error getting current IP:', error);
            return null;
        }
    }

    // Get IP geolocation data
    async function getIPGeolocation(ip) {
        try {
            const response = await fetch(`https://ipapi.co/${ip}/json/`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error getting IP geolocation:', error);
            return null;
        }
    }

    // Update UI with geolocation data
    function updateUI(data) {
        resultIp.textContent = data.ip || 'N/A';
        resultLocation.textContent = `${data.city || 'N/A'}, ${data.region || 'N/A'}, ${data.country_name || 'N/A'}`;
        resultIsp.textContent = data.org || 'N/A';
        resultTimezone.textContent = data.timezone || 'N/A';
        resultOrg.textContent = data.org || 'N/A';
        resultAs.textContent = data.asn || 'N/A';

        if (data.latitude && data.longitude) {
            updateMap(data.latitude, data.longitude);
        }
    }

    // Handle form submission
    ipGeolocationForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const ip = ipAddressInput.value.trim() || await getCurrentIP();
        if (!ip) {
            alert('Please enter a valid IP address');
            return;
        }

        const data = await getIPGeolocation(ip);
        if (data) {
            updateUI(data);
        } else {
            alert('Error getting IP geolocation data');
        }
    });

    // Handle "My IP" button click
    getMyIPButton.addEventListener('click', async function() {
        const currentIP = await getCurrentIP();
        if (currentIP) {
            ipAddressInput.value = currentIP;
            const data = await getIPGeolocation(currentIP);
            if (data) {
                updateUI(data);
            }
        } else {
            alert('Error getting current IP address');
        }
    });

    // Initialize map on page load
    initMap();

    // Get current IP and location on page load
    getMyIPButton.click();
}); 