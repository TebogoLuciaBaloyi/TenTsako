// Timezone data with offset from UTC
const timezones = {
    'sa': { name: 'Africa/Johannesburg', offset: 2 }, // South Africa
    'ny': { name: 'America/New_York', offset: -5 }, // New York (EST)
    'uk': { name: 'Europe/London', offset: 0 }, // London
    'paris': { name: 'Europe/Paris', offset: 1 }, // Paris (CET)
    'dubai': { name: 'Asia/Dubai', offset: 4 }, // Dubai
    'india': { name: 'Asia/Kolkata', offset: 5.5 }, // Mumbai
    'singapore': { name: 'Asia/Singapore', offset: 8 }, // Singapore
    'tokyo': { name: 'Asia/Tokyo', offset: 9 }, // Tokyo
    'sydney': { name: 'Australia/Sydney', offset: 10 }, // Sydney
    'la': { name: 'America/Los_Angeles', offset: -8 }, // Los Angeles (PST)
    'saopaulo': { name: 'America/Sao_Paulo', offset: -3 } // São Paulo
};

// Function to format time with leading zeros
function padZero(num) {
    return num < 10 ? '0' + num : num;
}

// Function to get time in specific timezone
function getTimeInTimezone(offsetHours) {
    const now = new Date();
    
    // Get current UTC time
    const utcTime = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
    
    // Add the offset
    const timezoneTime = new Date(utcTime.getTime() + offsetHours * 3600000);
    
    const hours = timezoneTime.getHours();
    const minutes = timezoneTime.getMinutes();
    const seconds = timezoneTime.getSeconds();
    
    return {
        hours: hours,
        minutes: minutes,
        seconds: seconds,
        period: hours >= 12 ? 'PM' : 'AM',
        display24: padZero(hours) + ':' + padZero(minutes) + ':' + padZero(seconds),
        display12: padZero(hours % 12 || 12) + ':' + padZero(minutes) + ':' + padZero(seconds)
    };
}

// Function to update all clocks
function updateAllClocks() {
    // Update each timezone clock
    for (const [key, tz] of Object.entries(timezones)) {
        const time = getTimeInTimezone(tz.offset);
        
        const clockElement = document.getElementById(`clock-${key}`);
        const offsetElement = document.getElementById(`offset-${key}`);
        
        if (clockElement) {
            const timeSpan = clockElement.querySelector('.time');
            const periodSpan = clockElement.querySelector('.period');
            
            timeSpan.textContent = time.display12;
            periodSpan.textContent = time.period;
        }
        
        // Update offset display with DST consideration
        if (offsetElement) {
            const offsetHours = Math.floor(tz.offset);
            const offsetMinutes = (tz.offset % 1) * 60;
            const offsetSign = tz.offset >= 0 ? '+' : '';
            
            let offsetText = 'UTC' + offsetSign + offsetHours;
            if (offsetMinutes !== 0) {
                offsetText += ':' + padZero(offsetMinutes);
            }
            
            offsetElement.textContent = offsetText;
        }
    }
    
    // Update local time
    updateLocalTime();
}

// Function to update local time
function updateLocalTime() {
    const now = new Date();
    
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    const display12 = padZero(hours % 12 || 12) + ':' + padZero(minutes) + ':' + padZero(seconds);
    const period = hours >= 12 ? 'PM' : 'AM';
    
    // Format date
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const dateString = now.toLocaleDateString('en-US', options);
    
    // Update DOM
    const localTimeElement = document.querySelector('.local-time');
    const localDateElement = document.getElementById('local-date');
    
    if (localTimeElement) {
        localTimeElement.textContent = display12 + ' ' + period;
    }
    
    if (localDateElement) {
        localDateElement.textContent = dateString;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Update immediately on load
    updateAllClocks();
    
    // Update every second
    setInterval(updateAllClocks, 1000);
});

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Press 'R' to manually refresh
    if (e.key === 'r' || e.key === 'R') {
        updateAllClocks();
    }
});