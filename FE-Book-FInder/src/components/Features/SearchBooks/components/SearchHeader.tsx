import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Theme } from '@/src/constants/Theme';

type Props = {
  userName: string;
  avatarUrl?: string;
};

export default function SearchHeader({ userName, avatarUrl }: Props) {
  return (
    <>
      <View style={styles.header}>
        <Text style={styles.menuIcon}>☰</Text>
        <Text style={styles.logo}>📖 BookFinder</Text>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.avatar} />
        )}
      </View>

      <Text style={styles.welcomeText}>
        Welcome{'\n'}back <Text style={styles.userName}>{userName}</Text>
      </Text>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },
  menuIcon: { color: Theme.colors.textPrimary, fontSize: 24 },
  logo: { color: Theme.colors.accent, fontSize: 20, fontWeight: 'bold' },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: Theme.colors.surface },
  welcomeText: {
    fontSize: 32,
    color: Theme.colors.textPrimary,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  userName: {
    color: Theme.colors.accent,
  },
});
