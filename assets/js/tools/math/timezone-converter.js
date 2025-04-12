document.addEventListener('DOMContentLoaded', function() {
    // Initialize elements
    const dateInput = document.getElementById('date');
    const timeInput = document.getElementById('time');
    const fromTimeZone = document.getElementById('fromTimeZone');
    const toTimeZone = document.getElementById('toTimeZone');
    const convertBtn = document.getElementById('convertBtn');
    const convertedDateTime = document.getElementById('convertedDateTime');
    const timeDifference = document.getElementById('timeDifference');
    const daylightSaving = document.getElementById('daylightSaving');
    const timeZoneInfo = document.getElementById('timeZoneInfo');
    const historyList = document.getElementById('historyList');
    const clearHistoryBtn = document.getElementById('clearHistory');
    const popularTimeZones = document.getElementById('popularTimeZones');

    // Popular time zones
    const popularZones = [
        { code: 'UTC', name: 'UTC' },
        { code: 'America/New_York', name: 'New York (EST/EDT)' },
        { code: 'Europe/London', name: 'London (GMT/BST)' },
        { code: 'Asia/Tokyo', name: 'Tokyo (JST)' },
        { code: 'Australia/Sydney', name: 'Sydney (AEST/AEDT)' },
        { code: 'Europe/Paris', name: 'Paris (CET/CEST)' },
        { code: 'America/Los_Angeles', name: 'Los Angeles (PST/PDT)' },
        { code: 'Asia/Dubai', name: 'Dubai (GST)' },
        { code: 'Asia/Shanghai', name: 'Shanghai (CST)' },
        { code: 'Asia/Singapore', name: 'Singapore (SGT)' }
    ];

    // Initialize time zones
    function initializeTimeZones() {
        const timeZones = Intl.supportedValuesOf('timeZone');
        
        timeZones.forEach(zone => {
            const option = document.createElement('option');
            option.value = zone;
            option.textContent = zone;
            fromTimeZone.appendChild(option.cloneNode(true));
            toTimeZone.appendChild(option);
        });

        // Set default values
        fromTimeZone.value = 'UTC';
        toTimeZone.value = 'America/New_York';
    }

    // Initialize popular time zones
    function initializePopularTimeZones() {
        popularZones.forEach(zone => {
            const item = document.createElement('div');
            item.className = 'popular-time-zone-item';
            item.innerHTML = `
                <div class="time-zone-code">${zone.name}</div>
                <div class="time-zone-offset">${getCurrentTimeInZone(zone.code)}</div>
            `;
            item.addEventListener('click', () => {
                toTimeZone.value = zone.code;
                convertTime();
            });
            popularTimeZones.appendChild(item);
        });
    }

    // Get current time in time zone
    function getCurrentTimeInZone(timeZone) {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timeZone,
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        return formatter.format(now);
    }

    // Convert time
    function convertTime() {
        const date = dateInput.value;
        const time = timeInput.value;
        const fromZone = fromTimeZone.value;
        const toZone = toTimeZone.value;

        if (!date || !time) {
            showError('Please enter both date and time');
            return;
        }

        const dateTime = new Date(`${date}T${time}`);
        const fromDate = new Date(dateTime.toLocaleString('en-US', { timeZone: fromZone }));
        const toDate = new Date(dateTime.toLocaleString('en-US', { timeZone: toZone }));

        // Format the converted date and time
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: toZone,
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });

        convertedDateTime.textContent = formatter.format(toDate);

        // Calculate time difference
        const diff = (toDate - fromDate) / (1000 * 60 * 60);
        timeDifference.textContent = `${diff > 0 ? '+' : ''}${diff.toFixed(1)} hours`;

        // Check for daylight saving
        const isDST = new Intl.DateTimeFormat('en-US', {
            timeZone: toZone,
            timeZoneName: 'short'
        }).format(toDate).includes('DST');

        daylightSaving.textContent = isDST ? 'Yes' : 'No';

        // Add to history
        addToHistory(dateTime, fromZone, toZone, toDate);
    }

    // Add conversion to history
    function addToHistory(dateTime, fromZone, toZone, convertedDate) {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div class="d-flex justify-content-between">
                <div>
                    ${dateTime.toLocaleString()} ${fromZone} → ${convertedDate.toLocaleString()} ${toZone}
                </div>
            </div>
            <div class="text-muted small">
                ${new Date().toLocaleString()}
            </div>
        `;

        historyList.insertBefore(historyItem, historyList.firstChild);
    }

    // Clear history
    function clearHistory() {
        historyList.innerHTML = '';
    }

    // Show error message
    function showError(message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-danger alert-dismissible fade show';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        document.querySelector('.results').insertBefore(alertDiv, document.querySelector('.result-grid'));
    }

    // Update time zone info
    function updateTimeZoneInfo() {
        timeZoneInfo.innerHTML = '';
        popularZones.forEach(zone => {
            const now = new Date();
            const formatter = new Intl.DateTimeFormat('en-US', {
                timeZone: zone.code,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            });
            const offset = new Intl.DateTimeFormat('en-US', {
                timeZone: zone.code,
                timeZoneName: 'longOffset'
            }).format(now);
            const isDST = new Intl.DateTimeFormat('en-US', {
                timeZone: zone.code,
                timeZoneName: 'short'
            }).format(now).includes('DST');

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${zone.name}</td>
                <td>${formatter.format(now)}</td>
                <td>${offset}</td>
                <td>${isDST ? 'Yes' : 'No'}</td>
            `;
            timeZoneInfo.appendChild(row);
        });
    }

    // Event listeners
    document.getElementById('timeZoneConverterForm').addEventListener('submit', function(e) {
        e.preventDefault();
        convertTime();
    });

    clearHistoryBtn.addEventListener('click', clearHistory);

    // Initialize
    initializeTimeZones();
    initializePopularTimeZones();
    updateTimeZoneInfo();

    // Update time zone info every minute
    setInterval(updateTimeZoneInfo, 60000);
}); 