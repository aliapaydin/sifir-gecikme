import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sifirgecikme.app',
  appName: 'Sıfır Gecikme',
  webDir: 'out',
  server: {
    url: 'https://sifirgecikme.com',
    cleartext: false,
  },
  android: {
    allowMixedContent: false,
    backgroundColor: '#faf8f3',
  },
};

export default config;
