function formatDate(timestamp: number) {
    const date = new Date(timestamp * 1000); // Convert the timestamp to milliseconds
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = String(date.getFullYear()).slice(-2); // Get the last two digits of the year
    return `${day}.${month}.${year}`;
}

function convertTimestampToReadableDate(unixTimestamp: number) {
    // Convert the timestamp to milliseconds
    const date = new Date(unixTimestamp * 1000);

    // Extract date components
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    // Extract time components
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    // Format the date and time
    return `${day}.${month}.${year} ${hours}:${minutes}`;
}
const thousandSeparator = (number: number) => {
    return number.toLocaleString('en-US').replace(/,/g, ' ');
}

const convertToBrowserTimezone = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
};

function formatDateToDDMMYYYY(isoDate: string) {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
}

function convertTimeToTimezone(isoTime: string, timezoneId: string = 'utc+5'): string {
    const workingZones = {
        'utc-12': -12,
        'utc-11': -11,
        'utc-10': -10,
        'utc-9_30': -9.5,
        'utc-9': -9,
        'utc-8': -8,
        'utc-7': -7,
        'utc-6': -6,
        'utc-5': -5,
        'utc-4': -4,
        'utc-3_30': -3.5,
        'utc-3': -3,
        'utc-2': -2,
        'utc-1': -1,
        'utc0': 0,
        'utc+1': 1,
        'utc+2': 2,
        'utc+3': 3,
        'utc+3_30': 3.5,
        'utc+4': 4,
        'utc+4_30': 4.5,
        'utc+5': 5,
        'utc+5_30': 5.5,
        'utc+5_45': 5.75,
        'utc+6': 6,
        'utc+6_30': 6.5,
        'utc+7': 7,
        'utc+8': 8,
        'utc+8_45': 8.75,
        'utc+9': 9,
        'utc+9_30': 9.5,
        'utc+10': 10,
        'utc+10_30': 10.5,
        'utc+11': 11,
        'utc+12': 12,
        'utc+12_45': 12.75,
        'utc+13': 13,
        'utc+14': 14,
    };

    // Validate timezoneId
    const timezoneOffset = workingZones[timezoneId];
    if (timezoneOffset === undefined) {
        throw new Error(`Invalid timezone ID: ${timezoneId}`);
    }

    // Parse the input time
    const date = new Date(isoTime);

    // Calculate the target time in milliseconds
    const targetTime = date.getTime() + timezoneOffset * 60 * 60 * 1000;

    // Create a new Date object for the target time
    const targetDate = new Date(targetTime);

    // Format the time as HH:mm
    const hours = targetDate.getUTCHours().toString().padStart(2, '0');
    const minutes = targetDate.getUTCMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
}

function convertToTimeZone(time: string, timezoneId: string = 'utc+5'): string {
    // Define timezone offsets in hours
    const timeZones: { [key: string]: number } = {
        'utc-12': -12,
        'utc-11': -11,
        'utc-10': -10,
        'utc-9_30': -9.5,
        'utc-9': -9,
        'utc-8': -8,
        'utc-7': -7,
        'utc-6': -6,
        'utc-5': -5,
        'utc-4': -4,
        'utc-3_30': -3.5,
        'utc-3': -3,
        'utc-2': -2,
        'utc-1': -1,
        'utc0': 0,
        'utc+1': 1,
        'utc+2': 2,
        'utc+3': 3,
        'utc+3_30': 3.5,
        'utc+4': 4,
        'utc+4_30': 4.5,
        'utc+5': 5,
        'utc+5_30': 5.5,
        'utc+5_45': 5.75,
        'utc+6': 6,
        'utc+6_30': 6.5,
        'utc+7': 7,
        'utc+8': 8,
        'utc+8_45': 8.75,
        'utc+9': 9,
        'utc+9_30': 9.5,
        'utc+10': 10,
        'utc+10_30': 10.5,
        'utc+11': 11,
        'utc+12': 12,
        'utc+12_45': 12.75,
        'utc+13': 13,
        'utc+14': 14,
    };

    // Validate timezone ID
    const timezoneOffset = timeZones[timezoneId];
    if (timezoneOffset === undefined) {
        throw new Error(`Invalid timezone ID: ${timezoneId}`);
    }

    // Convert input time to a Date object
    const date = new Date(time);

    // Calculate the time in the target timezone
    const targetTime = date.getTime() + timezoneOffset * 60 * 60 * 1000;
    const targetDate = new Date(targetTime);

    // Extract hours and minutes in HH:mm format
    const hours = targetDate.getUTCHours().toString().padStart(2, '0');
    const minutes = targetDate.getUTCMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
}

function getBaseUrlBeforeRest(url: string): string {
    const index = url.indexOf('/rest');
    if (index === -1) {
        // Если в строке нет '/rest', возвращаем исходный URL
        return url;
    }
    return url.substring(0, index);
}

export { formatDate, convertTimestampToReadableDate, thousandSeparator, convertToBrowserTimezone, formatDateToDDMMYYYY, convertTimeToTimezone, convertToTimeZone, getBaseUrlBeforeRest };