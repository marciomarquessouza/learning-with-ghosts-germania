export function timerFormat(timeInSeconds: number) {
  const minutes = Math.floor(timeInSeconds / 60);
  const minutesWithTwoDigits = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const seconds = Math.floor(timeInSeconds % 60);
  const secondsWithTwoDigits = seconds < 10 ? `0${seconds}` : `${seconds}`;

  return `${minutesWithTwoDigits}:${secondsWithTwoDigits}`;
}
