import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { store } from './store';
import { Provider } from 'react-redux';

const root = document.getElementById('root');
const rootElement = ReactDOM.createRoot(root);
rootElement.render(<Provider store ={store}><App /></Provider>);  // removed strict mode
// pass the store as a prop:
reportWebVitals();