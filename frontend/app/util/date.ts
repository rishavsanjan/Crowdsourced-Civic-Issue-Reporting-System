export function formatMonthYear(dateString: string) {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const date = new Date(dateString);
    const monthName = months[date.getUTCMonth()];
    const year = date.getUTCFullYear();

    return `${monthName} ${year}`;
}


export function formatISTDateTime(dateString: string) {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const date = new Date(dateString);

    // Convert to IST by adding offset (5h 30m = 330 mins)
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(date.getTime() + istOffset);

    const day = istDate.getDate();
    const monthName = months[istDate.getMonth()];
    const year = istDate.getFullYear();

    let hours: any = istDate.getHours();
    let minutes: any = istDate.getMinutes();
    let seconds: any = istDate.getSeconds();

    // Pad single digits
    hours = String(hours).padStart(2, "0");
    minutes = String(minutes).padStart(2, "0");
    seconds = String(seconds).padStart(2, "0");

    return `${day} ${monthName} ${year}, ${hours}:${minutes} `;
}