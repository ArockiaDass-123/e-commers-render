import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

window.onerror = function (message, source, lineno, colno, error) {
  console.error("Global Error:", message, source, lineno, error);
  // Uncomment to see alert in browser
  alert("App Crash: " + message);
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
