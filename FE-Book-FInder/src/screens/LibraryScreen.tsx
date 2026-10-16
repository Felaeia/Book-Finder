import React, { useCallback, useMemo, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import {
  Dimensions,
  FlatList,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import { Feather, FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Book, ShelfType, LibraryStats } from "../components/Features/SaveBooks/lib/types";
import { INITIAL_BOOKS } from "../components/Features/SaveBooks/lib/mockData";
import { libraryApi } from "../components/Features/SaveBooks/api/libraryApi";
import { ProgressModal } from "../components/Features/SaveBooks/components/ProgressModal/ProgressModal";

const { width } = Dimensions.get("window");

const SHELF_TABS: { key: ShelfType; label: string; icon: string }[] = [
  { key: "all", label: "My Books", icon: "book" },
  { key: "reading", label: "Reading", icon: "book-open" },
  { key: "want_to_read", label: "Want to Read", icon: "bookmark" },
  { key: "completed", label: "Completed", icon: "check-circle" },
  { key: "favorites", label: "Favorites", icon: "heart" },
];

export function LibraryScreen() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [stats, setStats] = useState<LibraryStats>({
    shelved: 10,
    favorites: 7,
    bookmarks: 7,
    wantToRead: 7,
    totalBooks: 10,
    booksReading: 2,
    booksWantToRead: 7,
    booksCompleted: 1,
    booksFavorites: 7,
    pagesRead: 1420,
  });

  const [activeShelf, setActiveShelf] = useState<ShelfType>("all");
  const [refreshing, setRefreshing] = useState(false);
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

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const filteredBooks = useMemo(() => {
    let result = [...books];
    if (activeShelf === "favorites") {
      result = result.filter((b) => b.isFavorite);
    } else if (activeShelf === "bookmarks") {
      result = result.filter((b) => b.isBookmarked);
    } else if (activeShelf === "want_to_read") {
      result = result.filter((b) => b.shelf === "want_to_read");
    } else if (activeShelf === "reading") {
      result = result.filter((b) => b.shelf === "reading");
    } else if (activeShelf === "completed") {
      result = result.filter((b) => b.shelf === "completed");
    }
    return result;
  }, [books, activeShelf]);

  const handleToggleFavorite = async (bookId: string) => {
    try {
      const updated = await libraryApi.toggleFavorite(bookId);
      setBooks((prev) => prev.map((b) => (b.id === bookId ? updated : b)));
      const updatedStats = await libraryApi.getStats();
      setStats(updatedStats);
      if (selectedBook?.id === bookId) setSelectedBook(updated);
    } catch (e) { console.error(e); }
  };

  const handleUpdateShelf = async (bookId: string, newShelf: Exclude<ShelfType, "all">) => {
    try {
      const updated = await libraryApi.updateShelf(bookId, newShelf);
      setBooks((prev) => prev.map((b) => (b.id === bookId ? updated : b)));
      const updatedStats = await libraryApi.getStats();
      setStats(updatedStats);
      if (selectedBook?.id === bookId) setSelectedBook(updated);
    } catch (e) { console.error(e); }
  };

  const handleUpdateProgress = async (bookId: string, page: number) => {
    try {
      const updated = await libraryApi.updateProgress(bookId, page);
      setBooks((prev) => prev.map((b) => (b.id === bookId ? updated : b)));
      const updatedStats = await libraryApi.getStats();
      setStats(updatedStats);
      if (selectedBook?.id === bookId) setSelectedBook(updated);
    } catch (e) { console.error(e); }
  };

  const handleUpdateRating = async (bookId: string, rating: number) => {
    try {
      const updated = await libraryApi.updateRating(bookId, rating);
      setBooks((prev) => prev.map((b) => (b.id === bookId ? updated : b)));
      if (selectedBook?.id === bookId) setSelectedBook(updated);
    } catch (e) { console.error(e); }
  };

  const handleRemoveBook = async (bookId: string) => {
    try {
      await libraryApi.removeBook(bookId);
      setBooks((prev) => prev.filter((b) => b.id !== bookId));
      const updatedStats = await libraryApi.getStats();
      setStats(updatedStats);
      if (selectedBook?.id === bookId) setSelectedBook(null);
    } catch (e) { console.error(e); }
  };

  const handleOpenBook = (book: Book) => {
    router.push(`/book/${book.id}` as any);
  };

  const handleOpenProgress = (book: Book) => {
    setSelectedBook(book);
    setProgressModalVisible(true);
  };

  // Reading progress pct for a given book
  const readPct = (book: Book) =>
    book.totalPages > 0
      ? Math.round((book.currentPage / book.totalPages) * 100)
      : 0;

  const renderBookRow = ({ item }: { item: Book }) => (
    <TouchableOpacity
      style={styles.bookRow}
      activeOpacity={0.85}
      onPress={() => handleOpenBook(item)}
    >
      {/* Cover */}
      <View style={styles.bookRowCoverShadow}>
        <Image
          source={{ uri: item.coverUrl }}
          style={styles.bookRowCover}
          contentFit="cover"
          transition={200}
        />
      </View>

      {/* Info */}
      <View style={styles.bookRowInfo}>
        <Text style={styles.bookRowTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.bookRowAuthor} numberOfLines={1}>
          by {item.author}
        </Text>

        {/* Star rating */}
        <View style={styles.bookRowStars}>
          {[1, 2, 3, 4, 5].map((s) => (
            <FontAwesome
              key={s}
              name={s <= (item.rating ?? 0) ? "star" : "star-o"}
              size={11}
              color="#EA580C"
              style={{ marginRight: 1 }}
            />
          ))}
        </View>

        {/* Shelf badge */}
        <View style={[styles.shelfBadge, shelfBadgeColor(item.shelf)]}>
          <Text style={[styles.shelfBadgeText, shelfBadgeTextColor(item.shelf)]}>
            {shelfLabel(item.shelf)}
          </Text>
        </View>

        {/* Reading progress bar */}
        {item.shelf === "reading" && item.totalPages > 0 && (
          <View style={styles.progressRow}>
            <View style={styles.progressTrack}>
              <View
                style={[styles.progressFill, { width: `${readPct(item)}%` }]}
              />
            </View>
            <Text style={styles.progressText}>{readPct(item)}%</Text>
          </View>
        )}
      </View>

      {/* Right actions */}
      <View style={styles.bookRowActions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => handleToggleFavorite(item.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={item.isFavorite ? "heart" : "heart-outline"}
            size={20}
            color={item.isFavorite ? "#C0392B" : "#8D7E73"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => handleOpenProgress(item)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name="more-vertical" size={18} color="#8D7E73" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const ListHeader = (
    <View>
      {/* Top bar */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <Text style={styles.topBarGreeting}>My Library</Text>
          <Text style={styles.topBarSub}>{stats.shelved ?? books.length} books shelved</Text>
        </View>
        <TouchableOpacity style={styles.notifBtn}>
          <Ionicons name="notifications-outline" size={22} color="#281D17" />
        </TouchableOpacity>
      </View>

      {/* Stats strip */}
      <View style={styles.statsStrip}>
        {[
          { label: "Reading", value: stats.booksReading ?? 0, color: "#1F6B38" },
          { label: "Want to Read", value: stats.wantToRead ?? 0, color: "#785921" },
          { label: "Completed", value: stats.booksCompleted ?? 0, color: "#422515" },
          { label: "Favorites", value: stats.favorites ?? 0, color: "#C0392B" },
        ].map((s, i) => (
          <View key={s.label} style={[styles.statItem, i < 3 && styles.statDivider]}>
            <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Shelf filter tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsRow}
        style={styles.tabsScroll}
      >
        {SHELF_TABS.map((tab) => {
          const active = activeShelf === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, active && styles.activeTab]}
              onPress={() => setActiveShelf(tab.key)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, active && styles.activeTabText]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Results count + sort */}
      <View style={styles.resultsRow}>
        <Text style={styles.resultsText}>
          {filteredBooks.length} {filteredBooks.length === 1 ? "book" : "books"}
        </Text>
        <TouchableOpacity style={styles.sortBtn}>
          <MaterialCommunityIcons name="sort" size={16} color="#554438" />
          <Text style={styles.sortText}>Sort</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const ListEmpty = (
    <View style={styles.emptyState}>
      <Ionicons name="book-outline" size={48} color="#C5BAB0" />
      <Text style={styles.emptyTitle}>No books here yet</Text>
      <Text style={styles.emptySubtitle}>
        Books you add to this shelf will appear here.
      </Text>
      <TouchableOpacity
        style={styles.exploreBtn}
        onPress={() => router.push("/search" as any)}
      >
        <Text style={styles.exploreBtnText}>EXPLORE BOOKS</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ECE7DF" />

      <FlatList
        data={filteredBooks}
        keyExtractor={(item) => item.id}
        renderItem={renderBookRow}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#5C4A3E"
            colors={["#5C4A3E"]}
          />
        }
      />

      {/* Bottom Nav — Saved Active */}
      <View style={styles.bottomNavContainer}>
        {[
          { icon: "compass-outline", label: "Discover", route: "/search", key: "discover" },
          { icon: "bookmark-outline", label: "Saved", route: "/saved", key: "saved" },
        ].map((item) => {
          const isActive = item.key === "saved";
          return (
            <TouchableOpacity
              key={item.key}
              style={[styles.bottomNavItem, isActive && styles.activeSearchPill]}
              onPress={() => item.route && router.push(item.route as any)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={item.icon as any}
                size={22}
                color={isActive ? "#422515" : "#554438"}
              />
              <Text
                style={[
                  styles.bottomNavLabel,
                  isActive && { fontWeight: "800", color: "#422515" },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

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

// Helpers
function shelfLabel(shelf: Exclude<ShelfType, "all">): string {
  const map: Record<string, string> = {
    reading: "Reading",
    want_to_read: "Want to Read",
    completed: "Completed",
    bookmarks: "Bookmarked",
    favorites: "Favorite",
  };
  return map[shelf] ?? shelf;
}

function shelfBadgeColor(shelf: Exclude<ShelfType, "all">) {
  const map: Record<string, object> = {
    reading: { backgroundColor: "#D4EDDA" },
    want_to_read: { backgroundColor: "#FEF9C3" },
    completed: { backgroundColor: "#DCD5CA" },
    bookmarks: { backgroundColor: "#FDE8CE" },
    favorites: { backgroundColor: "#FDDEDE" },
  };
  return map[shelf] ?? { backgroundColor: "#E8E4DF" };
}

function shelfBadgeTextColor(shelf: Exclude<ShelfType, "all">) {
  const map: Record<string, object> = {
    reading: { color: "#1F6B38" },
    want_to_read: { color: "#785921" },
    completed: { color: "#422515" },
    bookmarks: { color: "#A0522D" },
    favorites: { color: "#C0392B" },
  };
  return map[shelf] ?? { color: "#554438" };
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ECE7DF",
  },

  // ── List ─────────────────────────────────────
  listContent: {
    paddingBottom: 24,
    backgroundColor: "#ECE7DF",
  },

  // ── Top bar ──────────────────────────────────
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
    backgroundColor: "#ECE7DF",
  },
  topBarLeft: {},
  topBarGreeting: {
    fontSize: 22,
    fontWeight: "800",
    color: "#281D17",
    fontFamily: "serif",
  },
  topBarSub: {
    fontSize: 12,
    color: "#7D6E63",
    marginTop: 2,
  },
  notifBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#DFD9CF",
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Stats strip ──────────────────────────────
  statsStrip: {
    flexDirection: "row",
    backgroundColor: "#DFD9CF",
    marginHorizontal: 16,
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    borderRightWidth: 1,
    borderRightColor: "#C5BAB0",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    fontFamily: "serif",
  },
  statLabel: {
    fontSize: 10,
    color: "#7D6E63",
    marginTop: 2,
    fontWeight: "600",
    textAlign: "center",
  },

  // ── Shelf filter tabs ─────────────────────────
  tabsScroll: {
    backgroundColor: "#ECE7DF",
  },
  tabsRow: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
    flexDirection: "row",
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#DFD9CF",
    borderWidth: 1,
    borderColor: "#C5BAB0",
  },
  activeTab: {
    backgroundColor: "#422515",
    borderColor: "#422515",
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#554438",
  },
  activeTabText: {
    color: "#FFFFFF",
  },

  // ── Results / sort row ────────────────────────
  resultsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  resultsText: {
    fontSize: 12,
    color: "#7D6E63",
    fontWeight: "600",
  },
  sortBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sortText: {
    fontSize: 12,
    color: "#554438",
    fontWeight: "700",
  },

  // ── Book row card ─────────────────────────────
  bookRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F5F1EC",
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  bookRowCoverShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 4,
  },
  bookRowCover: {
    width: 72,
    height: 108,
    borderRadius: 4,
    backgroundColor: "#DFD9CF",
  },
  bookRowInfo: {
    flex: 1,
    marginLeft: 14,
    paddingTop: 2,
  },
  bookRowTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#281D17",
    lineHeight: 19,
    fontFamily: "serif",
  },
  bookRowAuthor: {
    fontSize: 12,
    color: "#7D6E63",
    marginTop: 3,
    fontWeight: "500",
  },
  bookRowStars: {
    flexDirection: "row",
    marginTop: 6,
  },
  shelfBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: 8,
  },
  shelfBadgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 8,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: "#D8D0C5",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#1F6B38",
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
    color: "#7D6E63",
    fontWeight: "600",
  },
  bookRowActions: {
    alignItems: "center",
    gap: 10,
    paddingTop: 4,
    marginLeft: 6,
  },
  actionBtn: {
    padding: 4,
  },

  separator: {
    height: 10,
  },

  // ── Empty state ───────────────────────────────
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#281D17",
    marginTop: 16,
    fontFamily: "serif",
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#7D6E63",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 19,
  },
  exploreBtn: {
    marginTop: 20,
    borderWidth: 1.5,
    borderColor: "#3E2E25",
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 2,
  },
  exploreBtnText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#281D17",
    letterSpacing: 1,
  },

  // ── Bottom Nav (same as BookDetailScreen) ──────
  bottomNavContainer: {
    flexDirection: "row",
    backgroundColor: "#DFD9CF",
    borderTopWidth: 1,
    borderTopColor: "#D1C9BD",
    paddingVertical: 8,
    paddingHorizontal: 4,
    justifyContent: "space-around",
    alignItems: "center",
  },
  bottomNavItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  activeSearchPill: {
    backgroundColor: "#CEBFAC",
    borderRadius: 18,
    paddingHorizontal: 12,
  },
  bottomNavLabel: {
    fontSize: 10,
    color: "#554438",
    fontWeight: "600",
    marginTop: 2,
  },
});
