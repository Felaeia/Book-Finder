import React from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '@/src/constants/Theme';
import { useBookSearch } from '../components/FEATURES/SearchBooks/lib/useBookSearch';
import { useSubjectBooks } from '../components/FEATURES/SearchBooks/lib/useSubjectBooks';
import BookCarousel from '../components/FEATURES/SearchBooks/components/BookCarousel';
import SearchBar from '../components/FEATURES/SearchBooks/components/SearchBar';
import SearchHeader from '../components/FEATURES/SearchBooks/components/SearchHeader';
import SubjectGroupCard from '../components/FEATURES/SearchBooks/components/SubjectGroupCard';

// Subject slugs recognized by Open Library's Subjects API.
const RECOMMENDED_SUBJECT = 'fiction';
const GROUP_SUBJECTS = ['Horror', 'Romance'];
const THUMBS_PER_GROUP = 3;

export default function SearchScreen() {
  const {
    query,
    setQuery,
    isFocused,
    setIsFocused,
    suggestions,
    loading: searchLoading,
    error: searchError,
    selectSuggestion,
  } = useBookSearch();

  const { books: recommended, loading: recommendedLoading } = useSubjectBooks(RECOMMENDED_SUBJECT, 10);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <SearchHeader userName="Jilliane" />

        <SearchBar
          query={query}
          setQuery={setQuery}
          isFocused={isFocused}
          setIsFocused={setIsFocused}
          suggestions={suggestions}
          loading={searchLoading}
          error={searchError}
          onSelect={selectSuggestion}
        />

        <BookCarousel
          title="Selected for you"
          books={recommended}
          loading={recommendedLoading}
          onSeeAll={() => {}}
        />

        <GroupSection subjects={GROUP_SUBJECTS} />
      </ScrollView>
    </SafeAreaView>
  );
}

function GroupSection({ subjects }: { subjects: string[] }) {
  return (
    <View style={styles.groupSection}>
      <Text style={styles.groupTitle}>By group</Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={subjects}
        keyExtractor={(subject) => subject}
        renderItem={({ item }) => <SubjectGroup subject={item} />}
        contentContainerStyle={styles.groupList}
      />
    </View>
  );
}

function SubjectGroup({ subject }: { subject: string }) {
  const { books } = useSubjectBooks(subject, THUMBS_PER_GROUP);
  return <SubjectGroupCard subjectLabel={subject} books={books} />;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  scrollContent: {
    paddingHorizontal: Theme.spacing.screenHorizontal,
    paddingBottom: 100,
  },
  groupSection: {
    marginBottom: 32,
  },
  groupTitle: {
    color: Theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  groupList: {
    paddingRight: Theme.spacing.screenHorizontal,
  },
});
