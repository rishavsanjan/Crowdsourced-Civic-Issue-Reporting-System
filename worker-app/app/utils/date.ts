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

export function formatToMonthYear(isoString: string): string {
  const date = new Date(isoString);

  return new Intl.DateTimeFormat("en-US", {
    month: "long", // "October"
    year: "numeric", // "2025"
  }).format(date);
}

export function formatTo12Hour(timeIso: string): string {
  const date = new Date(timeIso); // e.g. "2026-02-28T16:01:34.502Z"

  // Use Intl for proper 12-hour formatting with leading zeros and AM/PM
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}


export function formatDate(iso: string): string {
  const date = new Date(iso);

  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

// Example:
console.log(formatDate("2026-02-28T16:01:34.502Z")); // "Feb 28, 2026"


