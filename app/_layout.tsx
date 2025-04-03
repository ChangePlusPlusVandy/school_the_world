import { Tabs } from 'expo-router';

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Hides the header (filename at the top)
        tabBarStyle: { display: 'none' }, // Hides the bottom tab bar
      }}
    />
  );
}


