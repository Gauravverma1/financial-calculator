// Financial Calculator Application
// Developed by: [Your Name]
// Version: 1.0.0

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize the application
const initializeApp = () => {
  console.log('Financial Calculator initialized successfully');
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error('Root element not found');
  }
  createRoot(rootElement).render(<App />);
};

// Start the application
initializeApp();
