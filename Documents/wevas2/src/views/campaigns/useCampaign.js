export default function useCampaign() {
  const resolveLabelColor = state => {
    if (state === 0) return 'secondary'
    if (state === 1) return 'warning'
    if (state === 2) return 'dark'
    if (state === 3) return 'info'
    if (state === 4) return 'success'
    if (state === 5) return 'primary'
    if (state === 6) return 'danger'
    return 'success'
  }
  const resolveLabelName = state => {
    if (state === 0) return 'Waiting'
    if (state === 1) return 'Queued'
    if (state === 2) return 'Scheduled'
    if (state === 3) return 'Paused'
    if (state === 4) return 'Sent'
    if (state === 5) return 'Draft'
    if (state === 6) return 'Stopped'
    return 'Sent'
  }

  return {
    resolveLabelColor,
    resolveLabelName,
  }
}
