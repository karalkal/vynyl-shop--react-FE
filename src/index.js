import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthContextProvider } from './context/AuthContextProvider';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	// <React.StrictMode>
	<AuthContextProvider >
		<App />
	</AuthContextProvider>
	// </React.StrictMode>
);

