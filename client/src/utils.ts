export function formatDateTime(timestamp: string) {
  const date = new Date(timestamp);
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export function formatTimeStamp(timestamp: string) {
  const date = new Date(timestamp);
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}
