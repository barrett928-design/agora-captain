import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './App.jsx'

// Keep installed copies of the app up to date.
// Phones often resume a sleeping app instead of restarting it, so an old
// version could keep running for months. Check for a new version every hour
// and whenever the app comes back to the foreground; when one is found the
// app reloads itself onto it.
registerSW({
  immediate: true,
  onRegisteredSW(swUrl, registration) {
    if (!registration) return
    const checkForUpdate = () => {
      if (navigator.onLine) registration.update().catch(() => {})
    }
    setInterval(checkForUpdate, 60 * 60 * 1000)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') checkForUpdate()
    })
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
