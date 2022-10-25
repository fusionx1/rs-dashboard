import React, { FC,useState, useEffect } from 'react'
import './App.scss'
import { Navigate,Router, Route, Routes } from 'react-router-dom'

import {
    MsalProvider,
    useIsAuthenticated,
    AuthenticatedTemplate,
    UnauthenticatedTemplate,
    useMsal,
    useMsalAuthentication
} from '@azure/msal-react'
import {EventType, InteractionStatus, InteractionType} from '@azure/msal-browser'

import { msalConfig,loginRequest, b2cPolicies } from '../Auth/authConfig'

import Summary from './Pages/Summary/Summary'
import Navigation from './Navigation/Navigation'
import Karte from './Pages/Karte/Karte'


const MainContent: FC = () => {

    const { instance, inProgress } = useMsal();
    const isAuthenticated = useIsAuthenticated();
    const [idTokenClaims, setIdTokenClaims] = useState(null);
        
    useEffect(() => {
        const callbackId = instance.addEventCallback((event) => {
            if (event.eventType === EventType.LOGIN_FAILURE) {
                if (event.error && event.error.errorMessage.indexOf("AADB2C90118") > -1) {
                    if (event.interactionType === InteractionType.Redirect) {
                        instance.loginRedirect(b2cPolicies.authorities.forgotPassword);
                    } else if (event.interactionType === InteractionType.Popup) {
                        instance.loginPopup(b2cPolicies.authorities.forgotPassword)
                            .catch(e => {
                                return;
                            });
                    }
                }
            }

            if (event.eventType === EventType.LOGIN_SUCCESS) {
                if (event?.payload) {
                    /**
                     * We need to reject id tokens that were not issued with the default sign-in policy.
                     * "acr" claim in the token tells us what policy is used (NOTE: for new policies (v2.0), use "tfp" instead of "acr").
                     * To learn more about B2C tokens, visit https://docs.microsoft.com/en-us/azure/active-directory-b2c/tokens-overview
                     */
                    if (event.payload.idTokenClaims["acr"] === b2cPolicies.names.forgotPassword) {
                        window.alert("Password has been reset successfully. \nPlease sign-in with your new password");
                        return instance.logout();
                    }
                }
            }
        });

        return () => {
            if (callbackId) {
                instance.removeEventCallback(callbackId);
            }
        };
    },  []);
  return (
    <div className="App">
        <AuthenticatedTemplate>
              <Navigation />
              <main className="absolute w-full h-full overflow-hidden">
                <Routes>
                  <Route index element={<Navigate to="karte"></Navigate>}></Route>
                  <Route path="/summary" element={<Summary />} />
                  <Route path="/karte" element={<Karte />} />
                </Routes>
              </main>
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate>
            <Router  location={""} navigator={SignUp_SignIn(instance,isAuthenticated)}>
                <Routes>
                    <Route path="" element={<SignUp_SignIn />} />
                </Routes>
            </Router>
        </UnauthenticatedTemplate>
    </div>
  )
}

export default function App({msalInstance}) {
    return (
        <MsalProvider instance={msalInstance}>
            <MainContent/>
        </MsalProvider>        
    );
}

function SignUp_SignIn(instance,isAuthenticated) {
    // 👇️ redirect to external URL
    if (!isAuthenticated) {
        instance.loginRedirect(loginRequest);
    }
    return null;
}
