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
} from "react-native";
import { Book, ShelfType, SortOption, ViewMode, LibraryStats } from "../../lib/types";
import { libraryApi } from "../../api/libraryApi";
import { ShelfTabBar, ShelfTab } from "../ShelfTabBar";
import { ShelfStatsHeader } from "../ShelfStatsHeader";
import { BookGridCard } from "../BookCard/BookGridCard";
import { BookListCard } from "../BookCard/BookListCard";
import { SearchBar } from "../SearchBar";
import { FilterSortModal } from "../FilterSortModal";
import { ProgressModal } from "../ProgressModal";
import { EmptyShelfState } from "../EmptyShelfState";
import { Colors } from "@/src/theme/colors";

const { width } = Dimensions.get("window");

export function LibraryScreen() {
  const [books, setBooks] = useState<Book[]>([]);
  const [stats, setStats] = useState<LibraryStats>({
    totalBooks: 0,
    booksReading: 0,
    booksWantToRead: 0,
    booksCompleted: 0,
    booksFavorites: 0,
    pagesRead: 0,
  });
  const [activeShelf, setActiveShelf] = useState<ShelfType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortOption, setSortOption] = useState<SortOption>("recent");
  const [refreshing, setRefreshing] = useState(false);

  // Modals
  const [filterSortModalVisible, setFilterSortModalVisible] = useState(false);
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

  // Shelf tabs configuration
  const shelfTabs: ShelfTab[] = useMemo(() => {
    return [
      { key: "all", label: "All Books", count: stats.totalBooks },
      { key: "reading", label: "Reading", count: stats.booksReading },
      { key: "want_to_read", label: "Want to Read", count: stats.booksWantToRead },
      { key: "completed", label: "Finished", count: stats.booksCompleted },
      { key: "favorites", label: "Favorites", count: stats.booksFavorites },
    ];
  }, [stats]);

  // Filter & Sort Logic
  const filteredAndSortedBooks = useMemo(() => {
    let result = [...books];

    // Filter by Shelf
    if (activeShelf === "favorites") {
      result = result.filter((b) => b.isFavorite);
    } else if (activeShelf !== "all") {
      result = result.filter((b) => b.shelf === activeShelf);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortOption) {
        case "title":
          return a.title.localeCompare(b.title);
        case "author":
          return a.author.localeCompare(b.author);
        case "rating":
          return b.rating - a.rating;
        case "progress": {
          const progA = a.totalPages > 0 ? a.currentPage / a.totalPages : 0;
          const progB = b.totalPages > 0 ? b.currentPage / b.totalPages : 0;
          return progB - progA;
        }
        case "recent":
        default:
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      }
    });

    return result;
  }, [books, activeShelf, searchQuery, sortOption]);

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
    setSelectedBook(book);
    setProgressModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Main Container */}
      <View style={styles.container}>
        {/* App Bar / Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>My Library</Text>
            <Text style={styles.headerSubtitle}>Personal Bookshelf & Reading Progress</Text>
          </View>
        </View>

        {/* Shelved Books List */}
        <FlatList
          data={filteredAndSortedBooks}
          key={viewMode === "grid" ? "grid-view" : "list-view"}
          numColumns={viewMode === "grid" ? 2 : 1}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={viewMode === "grid" ? styles.gridColumnWrapper : undefined}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.primary}
            />
          }
          ListHeaderComponent={
            <View>
              {/* Library Summary Stats */}
              <ShelfStatsHeader stats={stats} />

              {/* Shelf Filter Tabs */}
              <ShelfTabBar
                activeTab={activeShelf}
                tabs={shelfTabs}
                onSelectTab={setActiveShelf}
              />

              {/* Search, Filter & Layout Controls */}
              <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                viewMode={viewMode}
                onToggleViewMode={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                currentSort={sortOption}
                onOpenFilterSort={() => setFilterSortModalVisible(true)}
              />

              {/* Filter feedback row */}
              <View style={styles.resultsBar}>
                <Text style={styles.resultsCount}>
                  {filteredAndSortedBooks.length}{" "}
                  {filteredAndSortedBooks.length === 1 ? "book" : "books"} found
                </Text>
                <Text style={styles.activeSortBadge}>
                  Sort: {sortOption.replace("_", " ")}
                </Text>
              </View>
            </View>
          }
          renderItem={({ item }) =>
            viewMode === "grid" ? (
              <BookGridCard
                book={item}
                onPress={handleOpenBookModal}
                onToggleFavorite={handleToggleFavorite}
              />
            ) : (
              <BookListCard
                book={item}
                onPress={handleOpenBookModal}
                onToggleFavorite={handleToggleFavorite}
                onOpenShelfAction={handleOpenBookModal}
              />
            )
          }
          ListEmptyComponent={
            <EmptyShelfState
              shelf={activeShelf}
              isSearching={searchQuery.length > 0}
              onResetSearch={() => setSearchQuery("")}
              onExploreBooks={() => setActiveShelf("all")}
            />
          }
        />
      </View>

      {/* Sort & Filter Modal */}
      <FilterSortModal
        visible={filterSortModalVisible}
        onClose={() => setFilterSortModalVisible(false)}
        currentSort={sortOption}
        onSelectSort={setSortOption}
      />

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
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.text,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: "500",
    marginTop: 2,
  },
  listContent: {
    paddingBottom: 40,
  },
  gridColumnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  resultsBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 4,
  },
  resultsCount: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: "600",
  },
  activeSortBadge: {
    fontSize: 11,
    color: Colors.primary,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    fontWeight: "600",
    textTransform: "capitalize",
  },
});
