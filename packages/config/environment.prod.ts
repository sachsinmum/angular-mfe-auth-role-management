export const environment = {
  production: true,
  apiUrl: '/api',
  defaultLanguage: 'en',
  supportedLanguages: ['en', 'es', 'fr'],
  mfeConfig: {
    adminShell: {
      port: 80,
      remoteEntry: '/admin/remoteEntry.js'
    },
    mainShell: {
      port: 80,
      remoteEntry: '/main/remoteEntry.js'
    },
    crmApp: {
      port: 80,
      remoteEntry: '/crm/remoteEntry.js'
    },
    hrmsApp: {
      port: 80,
      remoteEntry: '/hrms/remoteEntry.js'
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
