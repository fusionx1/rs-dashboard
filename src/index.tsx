import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App/App'
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./Auth//authConfig";
import './i18n'
import { BrowserRouter } from 'react-router-dom'
import './index.css'

const root = createRoot(document.getElementById('root'))

export const msalInstance = new PublicClientApplication(msalConfig);

root.render(
    <BrowserRouter>
      <App msalInstance={msalInstance}/>
    </BrowserRouter>
)
