import React from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, FlatList, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../../constants/Theme';
import { useBookSearch } from '../../hooks/useBookSearch';
import { Book } from '../../types/books'; // Assuming you create this based on Step 3.2
import { BOOKS } from '../../data/books';

export default function HomeSearchScreen() {
  const { query, setQuery, isFocused, setIsFocused, suggestions, selectSuggestion } = useBookSearch(BOOKS);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header Placeholders */}
        <View style={styles.header}>
          <Text style={styles.menuIcon}>☰</Text>
          <Text style={styles.logo}>📖 BookFinder</Text>
          <View style={styles.avatar} />
        </View>

        <Text style={styles.welcomeText}>Welcome{"\n"}back <Text style={styles.userName}>Jilliane</Text></Text>

        {/* Search Box */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search for author or book"
            placeholderTextColor={Theme.colors.textMuted}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
          
          {/* Suggestion Dropdown */}
          {isFocused && query.length > 0 && (
            <View style={styles.dropdown}>
              {suggestions.length > 0 ? (
                suggestions.map((book: Book) => (
                  <TouchableOpacity 
                    key={book.id} 
                    style={styles.suggestionItem}
                    onPress={() => {
                      selectSuggestion(book);
                      Keyboard.dismiss();
                    }}
                  >
                    <Text style={styles.suggestionText}>{book.title}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noResultsText}>No books found</Text>
              )}
            </View>
          )}
        </View>

        {/* Carousels */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selected for you</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={BOOKS.filter((b: Book) => b.recommended)}
            keyExtractor={item => item.id}
            renderItem={({item}) => <View style={styles.placeholderBook} />}
            contentContainerStyle={styles.carouselList}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  scrollContent: {
    paddingHorizontal: Theme.spacing.screenHorizontal,
    paddingBottom: 100, // Keeps content above floating tab bar
  },
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
  searchContainer: {
    position: 'relative',
    zIndex: 10,
    elevation: 10,
    marginBottom: 32,
  },
  searchInput: {
    backgroundColor: Theme.colors.surface,
    color: Theme.colors.textDark,
    borderRadius: Theme.radius.input,
    padding: 16,
    fontSize: 16,
  },
  dropdown: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.card,
    padding: 8,
    zIndex: 20,
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  suggestionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  suggestionText: {
    color: Theme.colors.textDark,
    fontSize: 16,
  },
  noResultsText: {
    padding: 16,
    color: Theme.colors.textMuted,
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    color: Theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  carouselList: {
    gap: Theme.spacing.itemGap,
  },
  placeholderBook: {
    width: 120,
    height: 180,
    backgroundColor: '#333',
    borderRadius: Theme.radius.card,
  }
});