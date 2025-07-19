import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/main.css';
import 'bootstrap/dist/css/bootstrap.min.css';           // Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js';       // Bootstrap JS with Popper
import App from './App.jsx';

// Initialize Bootstrap tooltips after DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
    new bootstrap.Tooltip(el);
  });
});

// Make toggleFavourite globally accessible for inline handlers
window.toggleFavourite = function(button) {
  button.classList.toggle('active');
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
