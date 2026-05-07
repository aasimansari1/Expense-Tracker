import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { TransactionProvider } from './context/TransactionContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <TransactionProvider>
          <App />
        </TransactionProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
