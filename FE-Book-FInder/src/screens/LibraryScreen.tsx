import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Book, ShelfType, LibraryStats } from "../components/FEATURES/LIBRARY/lib/types";
import { INITIAL_BOOKS } from "../components/FEATURES/LIBRARY/lib/mockData";
import { libraryApi } from "../components/FEATURES/LIBRARY/api/libraryApi";
import { ShelfTabBar, ShelfTab } from "../components/FEATURES/LIBRARY/components/ShelfTabBar";
import { ShelfStatsHeader } from "../components/FEATURES/LIBRARY/components/ShelfStatsHeader";
import { BookGridCard } from "../components/FEATURES/LIBRARY/components/BookCard/BookGridCard";
import { ProgressModal } from "../components/FEATURES/LIBRARY/components/ProgressModal";
import { EmptyShelfState } from "../components/FEATURES/LIBRARY/components/EmptyShelfState";
import { Colors } from "../theme/colors";

const { width } = Dimensions.get("window");

export function LibraryScreen() {
  const router = useRouter();

  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [stats, setStats] = useState<LibraryStats>({
    shelved: 10,
    favorites: 7,
    bookmarks: 7,
    wantToRead: 7,
    totalBooks: 10,
    booksReading: 7,
    booksWantToRead: 7,
    booksCompleted: 0,
    booksFavorites: 7,
    pagesRead: 1420,
  });

  const [activeShelf, setActiveShelf] = useState<ShelfType>("all");
  const [refreshing, setRefreshing] = useState(false);

  // Modals & Active selection
  const [progressModalVisible, setProgressModalVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [fetchedBooks, fetchedStats] = await Promise.all([
        libraryApi.getBooks(),
        libraryApi.getStats(),
      ]);
      setBooks(fetchedBooks);
      setStats(fetchedStats);
    } catch (error) {
      console.error("Failed to load library data:", error);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Shelf tabs configuration matching Figma design
  const shelfTabs: ShelfTab[] = useMemo(() => {
    return [
      { key: "all", label: "My Books" },
      { key: "favorites", label: "Favorites" },
      { key: "bookmarks", label: "Bookmarks" },
      { key: "want_to_read", label: "Want to read" },
    ];
  }, []);

  // Filter books based on active tab
  const filteredBooks = useMemo(() => {
    let result = [...books];

    if (activeShelf === "favorites") {
      result = result.filter((b) => b.isFavorite);
    } else if (activeShelf === "bookmarks") {
      result = result.filter((b) => b.isBookmarked);
    } else if (activeShelf === "want_to_read") {
      result = result.filter((b) => b.shelf === "want_to_read");
    }

    return result;
  }, [books, activeShelf]);

  // Handlers
  const handleToggleFavorite = async (bookId: string) => {
    try {
      const updated = await libraryApi.toggleFavorite(bookId);
      setBooks((prev) => prev.map((b) => (b.id === bookId ? updated : b)));
      const updatedStats = await libraryApi.getStats();
      setStats(updatedStats);
      if (selectedBook && selectedBook.id === bookId) {
        setSelectedBook(updated);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateShelf = async (bookId: string, newShelf: Exclude<ShelfType, "all">) => {
    try {
      const updated = await libraryApi.updateShelf(bookId, newShelf);
      setBooks((prev) => prev.map((b) => (b.id === bookId ? updated : b)));
      const updatedStats = await libraryApi.getStats();
      setStats(updatedStats);
      if (selectedBook && selectedBook.id === bookId) {
        setSelectedBook(updated);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateProgress = async (bookId: string, page: number) => {
    try {
      const updated = await libraryApi.updateProgress(bookId, page);
      setBooks((prev) => prev.map((b) => (b.id === bookId ? updated : b)));
      const updatedStats = await libraryApi.getStats();
      setStats(updatedStats);
      if (selectedBook && selectedBook.id === bookId) {
        setSelectedBook(updated);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateRating = async (bookId: string, rating: number) => {
    try {
      const updated = await libraryApi.updateRating(bookId, rating);
      setBooks((prev) => prev.map((b) => (b.id === bookId ? updated : b)));
      if (selectedBook && selectedBook.id === bookId) {
        setSelectedBook(updated);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemoveBook = async (bookId: string) => {
    try {
      await libraryApi.removeBook(bookId);
      setBooks((prev) => prev.filter((b) => b.id !== bookId));
      const updatedStats = await libraryApi.getStats();
      setStats(updatedStats);
      if (selectedBook && selectedBook.id === bookId) {
        setSelectedBook(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenBookModal = (book: Book) => {
    router.push(`/book/${book.id}` as any);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#121214" />

      {/* Main Container */}
      <View style={styles.container}>
        {/* FlatList with complete header elements */}
        <FlatList
          data={filteredBooks}
          key="grid-view"
          numColumns={2}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.gridColumnWrapper}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.primary}
            />
          }
          ListHeaderComponent={
            <View>
              {/* Top Navigation Row: Logo + User Avatar */}
              <View style={styles.topBar}>
                {/* Book Logo Icon */}
                <View style={styles.logoWrapper}>
                  <Ionicons name="book" size={32} color="#EA580C" />
                </View>

                {/* Profile Avatar */}
                <Image
                  source={{
                    uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
                  }}
                  style={styles.avatar}
                  contentFit="cover"
                />
              </View>

              {/* Screen Title */}
              <View style={styles.titleWrapper}>
                <Text style={styles.screenTitle}>My{"\n"}Library</Text>
              </View>

              {/* Shelved Stats Card */}
              <ShelfStatsHeader stats={stats} />

              {/* Shelf Filter Pill Tabs */}
              <ShelfTabBar
                activeTab={activeShelf}
                tabs={shelfTabs}
                onSelectTab={setActiveShelf}
              />

              {/* Result Count Feedback */}
              <View style={styles.countWrapper}>
                <Text style={styles.countText}>
                  {filteredBooks.length} {filteredBooks.length === 1 ? "book" : "books"} found
                </Text>
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <BookGridCard
              book={item}
              onPress={handleOpenBookModal}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
          ListEmptyComponent={
            <EmptyShelfState
              shelf={activeShelf}
              isSearching={false}
              onResetSearch={() => {}}
              onExploreBooks={() => setActiveShelf("all")}
            />
          }
        />

        {/* Floating Bottom Navigation Bar */}
        <View style={styles.floatingBarWrapper} pointerEvents="box-none">
          <View style={styles.floatingBar}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push("/")}
              style={styles.navButton}
            >
              <Feather name="home" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setActiveShelf("all")}
              style={styles.navButton}
            >
              <Feather name="compass" size={25} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setActiveShelf("bookmarks")}
              style={styles.navButton}
            >
              <FontAwesome name="bookmark" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Book Detail & Progress Modal */}
      <ProgressModal
        book={selectedBook}
        visible={progressModalVisible}
        onClose={() => {
          setProgressModalVisible(false);
          setSelectedBook(null);
        }}
        onUpdateShelf={handleUpdateShelf}
        onUpdateProgress={handleUpdateProgress}
        onUpdateRating={handleUpdateRating}
        onToggleFavorite={handleToggleFavorite}
        onRemoveBook={handleRemoveBook}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#121214",
  },
  container: {
    flex: 1,
    backgroundColor: "#121214",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  logoWrapper: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#EA580C",
    backgroundColor: "#27272A",
  },
  titleWrapper: {
    paddingHorizontal: 16,
    marginTop: 14,
    marginBottom: 4,
  },
  screenTitle: {
    fontSize: 40,
    fontWeight: "800",
    color: "#FFFFFF",
    lineHeight: 44,
    letterSpacing: -1,
  },
  countWrapper: {
    paddingHorizontal: 16,
    marginTop: 14,
    marginBottom: 10,
  },
  countText: {
    fontSize: 14,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  listContent: {
    paddingBottom: 110, // Extra space for floating bottom bar
  },
  gridColumnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  floatingBarWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  floatingBar: {
    flexDirection: "row",
    backgroundColor: "#EA580C",
    width: 240,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  navButton: {
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
