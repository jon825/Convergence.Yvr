import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/site.css';
import './styles/theme.css';
import './styles/navigation.css';
createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
