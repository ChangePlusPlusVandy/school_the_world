// app/layout.tsx
import { Tabs } from "expo-router";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        // Add any global tab options here
      }}
    >
      {/* Tab configurations will be auto-generated from your file structure */}
    </Tabs>
  );
}
