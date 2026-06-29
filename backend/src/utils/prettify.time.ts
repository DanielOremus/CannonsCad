export default function (timeInMs: number): string {
  const timeInSec = timeInMs / 1000
  const hours = timeInSec / 3600
  if (hours >= 1) return `${hours} hour(s)`
  const minutes = timeInSec / 60
  return `${minutes} minute(s)`
}
