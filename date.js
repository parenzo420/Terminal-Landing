export function getFormattedLoginDate() {
  const now = new Date();
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const weekday = weekdays[now.getDay()];
  const month = months[now.getMonth()];
  const day = String(now.getDate()).padStart(2, ' ');
  const time = now.toTimeString().split(' ')[0];

  return `Last login: ${weekday} ${month} ${day} ${time} on console`;
}