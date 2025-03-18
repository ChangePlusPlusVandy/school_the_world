import { ExpoConfig, ConfigContext } from 'expo/config';
import 'dotenv/config';

// Helper function to ensure environment variables are defined
const getEnvVar = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Your App Name",
  slug: "your-app-slug", // Required field
  // ... other required expo config fields
  extra: {
    apiKey: process.env.API_KEY || "", // Use empty string as fallback
    authDomain: process.env.AUTH_DOMAIN || "",
    projectId: process.env.PROJECT_ID || "",
    storageBucket: process.env.STORAGE_BUCKET || "",
    messagingSenderId: process.env.MESSAGING_SENDER_ID || "",
    appId: process.env.APP_ID || "",
  },
});