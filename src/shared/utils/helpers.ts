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

export { formatDate, convertTimestampToReadableDate, thousandSeparator, convertToBrowserTimezone, formatDateToDDMMYYYY };