export const formatBytes = (b) => {
  const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  let l = 0
  let n = b

  while (n >= 1024) {
    n /= 1024
    l += 1
  }

  return `${n.toFixed(n >= 10 || l < 1 ? 0 : 1)}${units[l]}`
}

export const formatDuration = (seconds) => {
  const date = new Date(null)
  date.setSeconds(seconds)
  return date.toISOString().substr(11, 8)
}
