export function addSecondsToDate(durationInSeconds: number): Date {
  const now = new Date();
  const futureTime = now.getTime() + durationInSeconds * 1000;
  return new Date(futureTime);
}
