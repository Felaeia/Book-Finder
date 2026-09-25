import { Tabs } from 'expo-router';
import { Theme } from '../../constants/Theme';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Theme.colors.textPrimary,
        tabBarInactiveTintColor: Theme.colors.surface,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="compass" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="bookmark" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 24,
    left: Theme.spacing.screenHorizontal,
    right: Theme.spacing.screenHorizontal,
    backgroundColor: Theme.colors.accent,
    borderRadius: Theme.radius.tabBar,
    height: 60,
    borderTopWidth: 0,
    elevation: 5,
  },
});