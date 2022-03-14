export function formatDate(dateAsStr) {
    return new Date(dateAsStr).toLocaleString('en-GB', { hour12: false });
}
