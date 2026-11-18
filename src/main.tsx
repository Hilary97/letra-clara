import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { loadPreferences } from './lib/preferences'
import './styles.css'

document.documentElement.dataset.theme = loadPreferences().theme

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
