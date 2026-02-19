import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.goaltracker.app',
  appName: 'Goal Tracker',
  webDir: 'out',
  server: {
    url: 'https://goal-tracker-lac.vercel.app',
    cleartext: true
  }
};

export default config;
