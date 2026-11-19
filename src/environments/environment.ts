const env = (import.meta as any).env || {};

export const environment = {
  production: true,
  firebaseConfig: {
    apiKey: env['NG_APP_API_KEY'] || '',
    authDomain: env['NG_APP_AUTH_DOMAIN'] || '',
    projectId: env['NG_APP_PROJECT_ID'] || '',
    storageBucket: env['NG_APP_STORAGE_BUCKET'] || '',
    messagingSenderId: env['NG_APP_MESSAGING_SENDER_ID'] || '',
    appId: env['NG_APP_APP_ID'] || ''
  }
};