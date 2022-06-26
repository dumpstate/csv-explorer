import { createRoot } from 'react-dom/client'

const Yellow = <h1>Yellow!</h1>

const container = document.getElementById('app')
const root = createRoot(container!)

root.render(Yellow)
