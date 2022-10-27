import { LogLevel } from "@azure/msal-browser";

export const b2cPolicies = {
    names: {
        signUpSignIn: "B2C_1_default_mfa",
        forgotPassword: "B2C_1_password"
    },
    authorities: {
        signUpSignIn: {
            authority: "https://rsrgsgsgisb2c.b2clogin.com/rsrgsgsgisb2c.onmicrosoft.com/B2C_1_default_mfa",
        },
        forgotPassword: {
            authority: "https://rsrgsgsgisb2c.b2clogin.com/rsrgsgsgisb2c.onmicrosoft.com/B2C_1_password",
        }
    },
    authorityDomain: "rsrgsgsgisb2c.b2clogin.com"
}

export const msalConfig = {
    auth: {
        clientId: "7d882a3b-f2dd-42fb-ae39-11b74bd06a74", // This is the ONLY mandatory field that you need to supply.
        authority: b2cPolicies.authorities.signUpSignIn.authority, // Use a sign-up/sign-in user-flow as a default authority
        knownAuthorities: [b2cPolicies.authorityDomain], // Mark your B2C tenant's domain as trusted.
        redirectUri: "https://dashboard.fahrwegdiagnose.ch", // Points to window.location.origin. You must register this URI on Azure Portal/App Registration. //for prod: https://dashboard.fahrwegdiagnose.ch
        postLogoutRedirectUri: "https://dashboard.fahrwegdiagnose.ch", // Indicates the page to navigate after logout.
        navigateToLoginRequestUrl: false, // If "true", will navigate back to the original request location before processing the auth code response.
    },
    cache: {
        cacheLocation: "localStorage", // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
    system: {	
        loggerOptions: {	
            loggerCallback: (level, message, containsPii) => {	
                if (containsPii) {		
                    return;		
                }		
                switch (level) {		
                    case LogLevel.Error:		
                        console.error(message);		
                        return;		
                    case LogLevel.Info:		
                        console.info(message);		
                        return;		
                    case LogLevel.Verbose:		
                        console.debug(message);		
                        return;		
                    case LogLevel.Warning:		
                        console.warn(message);		
                        return;		
                }	
            }	
        }	
    }
};

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit: 
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
    scopes: ["https://rsrgsgsgisb2c.onmicrosoft.com/7d882a3b-f2dd-42fb-ae39-11b74bd06a74"],
};

/**
 * An optional silentRequest object can be used to achieve silent SSO
 * between applications by providing a "login_hint" property.
 */
export const silentRequest = {
  scopes: ["openid", "profile"],
  loginHint: "example@domain.net"
};