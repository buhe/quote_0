exports.handler = async (event) => {
    // Use Intl.DateTimeFormat to reliably get the time in Asia/Shanghai (UTC+8)
    const now = new Date();

    // Print current time in Asia/Shanghai
    const printFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Shanghai',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    const p = printFormatter.formatToParts(now);
    const getVal = (type) => p.find(x => x.type === type).value;
    
    // Get weekday
    const weekdayFormatter = new Intl.DateTimeFormat('zh-CN', {
        timeZone: 'Asia/Shanghai',
        weekday: 'long'
    });
    const weekday = weekdayFormatter.format(now);
    
    console.log(`${getVal('year')}-${getVal('month')}-${getVal('day')} ${getVal('hour')}:${getVal('minute')}:${getVal('second')} ${weekday}`);

    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Shanghai',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
    });
    
    const parts = formatter.formatToParts(now);
    const currentHour = parseInt(parts.find(p => p.type === 'hour').value);
    const currentMinute = parseInt(parts.find(p => p.type === 'minute').value);
    
    const currentTotalMinutes = currentHour * 60 + currentMinute;

    // Schedule configuration (in minutes)
    const startOfDay = 9 * 60;       // 09:00 -> 540
    const breakStart = 14 * 60;      // 14:00 -> 840
    const breakEnd = 17 * 60;        // 17:00 -> 1020
    const endOfDay = 20 * 60;        // 20:00 -> 1200

    // Total active working minutes (09:00-14:00 + 17:00-20:00)
    // 5 hours + 3 hours = 8 hours = 480 minutes
    const totalDuration = (breakStart - startOfDay) + (endOfDay - breakEnd);

    let activeMinutes = 0;

    if (currentTotalMinutes < startOfDay) {
        activeMinutes = 0;
    } else if (currentTotalMinutes < breakStart) {
        // Morning session
        activeMinutes = currentTotalMinutes - startOfDay;
    } else if (currentTotalMinutes < breakEnd) {
        // During break (frozen at end of morning session)
        activeMinutes = breakStart - startOfDay;
    } else if (currentTotalMinutes < endOfDay) {
        // Afternoon session
        activeMinutes = (breakStart - startOfDay) + (currentTotalMinutes - breakEnd);
    } else {
        // After end of day
        activeMinutes = totalDuration;
    }

    const percentage = (activeMinutes / totalDuration) * 100;
    // Use Math.floor to show integer percentage, or toFixed(0)
    const formattedPercentage = `${Math.floor(percentage)}%`;

    console.log(formattedPercentage);
    
    return formattedPercentage;
};

// If running locally directly via `node day.js`
if (require.main === module) {
    exports.handler();
}
