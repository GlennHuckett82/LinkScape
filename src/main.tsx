import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { store } from './store';
import App from './App';
import './index.css';

/**
 * Welcome to the app entry.
 * We mount React, wire up Redux, and choose a router that works in both
 * local dev and GitHub Pages.
 */
// Tip: When you double-click index.html (file://), we use HashRouter so routes still work.
// In regular dev/production (http/https), we use BrowserRouter with a basename from Vite,
// which keeps links happy when deploying under a subpath like /LinkScape/.
const isFileProtocol = typeof window !== 'undefined' && window.location.protocol === 'file:';
const Router = isFileProtocol ? HashRouter : BrowserRouter;
// When not using file://, derive basename from Vite at build-time.
const baseName = isFileProtocol ? undefined : import.meta.env.BASE_URL;

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
  <Router basename={baseName}>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
