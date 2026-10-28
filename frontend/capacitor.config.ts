import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vibepass.app',
  appName: 'VibePass',
  webDir: 'out',
  server: {
    url: 'http://192.168.1.11:3000',
    cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
  },
};

export default config;