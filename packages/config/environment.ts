export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  defaultLanguage: 'en',
  supportedLanguages: ['en', 'es', 'fr'],
  mfeConfig: {
    adminShell: {
      port: 4210,
      remoteEntry: 'http://localhost:4210/remoteEntry.js'
    },
    mainShell: {
      port: 4220,
      remoteEntry: 'http://localhost:4220/remoteEntry.js'
    },
    crmApp: {
      port: 4221,
      remoteEntry: 'http://localhost:4221/remoteEntry.js'
    },
    hrmsApp: {
      port: 4222,
      remoteEntry: 'http://localhost:4222/remoteEntry.js'
    }
  },
  auth: {
    tokenKey: 'auth_token',
    cookieOptions: {
      secure: true,
      httpOnly: true,
      sameSite: 'strict'
    }
  },
  theme: {
    defaultTheme: 'light',
    supportedThemes: ['light', 'dark']
  }
};
