export function padDay(day: number | string): string {
  if (typeof day === "number") {
    return day.toString().padStart(2, "0");
  }
  return day.padStart(2, "0");
}
