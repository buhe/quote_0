export const handler = async (event) => {
    try {
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

        console.log(`Burned working hours: ${formattedPercentage}`);

        // Life expectancy calculation
        // Birth: 1986-06-29, Lifespan: 65 years
        const deathDate = new Date('2051-06-29T00:00:00+08:00');

        const diffMs = deathDate - now;
        const remainingDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const remainingWeeks = Math.floor(remainingDays / 7);

        console.log(`Remaining Days: ${remainingDays}`);
        console.log(`Remaining Weeks: ${remainingWeeks}`);

        const key = 'dot_app_rNdgyLmXPksJdkFwBrjPqguonlTXIZSJgHRTDjvhjgIagfmlcONIsXpTAxkYESwj';
        const title = '> __';
        const taskKey = 'O7wFSSkyTnev';
        const message = `Burned working hours: ${formattedPercentage}\nRemaining Days: ${remainingDays}\nRemaining Weeks: ${remainingWeeks}`;
        const signature = `${getVal('year')}-${getVal('month')}-${getVal('day')} ${getVal('hour')}:${getVal('minute')}:${getVal('second')} ${weekday}`;
        console.log(signature);

        const body = JSON.stringify({
            refreshNow: false,
            taskKey,
            title,
            message,
            signature,
        });

        const res = await fetch('https://dot.mindreset.tech/api/authV2/open/device/48F6EE55B498/text', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${key}`,
                'Content-Type': 'application/json'
            },
            body
        });

        if (!res.ok) throw new Error(`Dot API ${res.status}`);

        const response3 = {
            statusCode: 200,
            body: JSON.stringify('Progress pushed to Dot device')
        };
        return response3;
    } catch (e) {
        console.error(e);
        const response2 = {
            statusCode: 500,
            body: JSON.stringify(e.message)
        };
        return response2;
    }
};
