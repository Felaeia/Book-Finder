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
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import {
  Feather,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { libraryApi } from "../components/Features/SaveBooks/api/libraryApi";
import { FilterSortModal } from "../components/Features/SaveBooks/components/FilterSortModal/FilterSortModal";
import { ProgressModal } from "../components/Features/SaveBooks/components/ProgressModal/ProgressModal";
import {
  Book,
  LibraryStats,
  ShelfType,
  SortOption,
  ViewMode,
} from "../components/Features/SaveBooks/lib/types";

const { width } = Dimensions.get("window");

const SHELF_TABS: { key: ShelfType; label: string }[] = [
  { key: "all", label: "All Books" },
  { key: "reading", label: "Reading" },
  { key: "want_to_read", label: "Want to Read" },
  { key: "completed", label: "Finished" },
  { key: "favorites", label: "Favorites" },
];

const SORT_LABELS: Record<SortOption, string> = {
  recent: "Recent",
  title: "Title",
  author: "Author",
  rating: "Rating",
  progress: "Progress",
};

export function LibraryScreen() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [stats, setStats] = useState<LibraryStats>({
    shelved: 0,
    favorites: 0,
    bookmarks: 0,
    wantToRead: 0,
    totalBooks: 0,
    booksReading: 0,
    booksWantToRead: 0,
    booksCompleted: 0,
    booksFavorites: 0,
    pagesRead: 0,
  });
  const [activeShelf, setActiveShelf] = useState<ShelfType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
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

  // Filter & Sort Logic
  const filteredAndSortedBooks = useMemo(() => {
    let result = [...books];

    if (activeShelf === "favorites") {
      result = result.filter((b) => b.isFavorite);
    } else if (activeShelf !== "all") {
      result = result.filter((b) => b.shelf === activeShelf);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q),
      );
    }

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
      if (selectedBook && selectedBook.id === bookId) setSelectedBook(updated);
    } catch (e) { console.error(e); }
  };

  const handleUpdateShelf = async (bookId: string, newShelf: Exclude<ShelfType, "all">) => {
    try {
      const updated = await libraryApi.updateShelf(bookId, newShelf);
      setBooks((prev) => prev.map((b) => (b.id === bookId ? updated : b)));
      const updatedStats = await libraryApi.getStats();
      setStats(updatedStats);
      if (selectedBook && selectedBook.id === bookId) setSelectedBook(updated);
    } catch (e) { console.error(e); }
  };

  const handleUpdateProgress = async (bookId: string, page: number) => {
    try {
      const updated = await libraryApi.updateProgress(bookId, page);
      setBooks((prev) => prev.map((b) => (b.id === bookId ? updated : b)));
      const updatedStats = await libraryApi.getStats();
      setStats(updatedStats);
      if (selectedBook && selectedBook.id === bookId) setSelectedBook(updated);
    } catch (e) { console.error(e); }
  };

  const handleUpdateRating = async (bookId: string, rating: number) => {
    try {
      const updated = await libraryApi.updateRating(bookId, rating);
      setBooks((prev) => prev.map((b) => (b.id === bookId ? updated : b)));
      if (selectedBook && selectedBook.id === bookId) setSelectedBook(updated);
    } catch (e) { console.error(e); }
  };

  const handleRemoveBook = async (bookId: string) => {
    try {
      await libraryApi.removeBook(bookId);
      setBooks((prev) => prev.filter((b) => b.id !== bookId));
      const updatedStats = await libraryApi.getStats();
      setStats(updatedStats);
      if (selectedBook && selectedBook.id === bookId) setSelectedBook(null);
    } catch (e) { console.error(e); }
  };

  const handleOpenBookModal = (book: Book) => {
    setSelectedBook(book);
    setProgressModalVisible(true);
  };

  const readPct = (book: Book) =>
    book.totalPages > 0 ? Math.round((book.currentPage / book.totalPages) * 100) : 0;

  // ── Book row (list mode) ─────────────────────────────────────────────────
  const renderListItem = ({ item }: { item: Book }) => (
    <TouchableOpacity
      style={styles.bookRow}
      activeOpacity={0.85}
      onPress={() => handleOpenBookModal(item)}
    >
      <View style={styles.bookRowCoverShadow}>
        <Image
          source={{ uri: item.coverUrl }}
          style={styles.bookRowCover}
          contentFit="cover"
          transition={200}
        />
      </View>

      <View style={styles.bookRowInfo}>
        <Text style={styles.bookRowTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.bookRowAuthor} numberOfLines={1}>by {item.author}</Text>

        {/* Stars */}
        <View style={styles.starsRow}>
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
        <View style={[styles.shelfBadge, shelfBadgeBg(item.shelf)]}>
          <Text style={[styles.shelfBadgeText, shelfBadgeFg(item.shelf)]}>
            {shelfLabel(item.shelf)}
          </Text>
        </View>

        {/* Progress bar — only for "reading" */}
        {item.shelf === "reading" && item.totalPages > 0 && (
          <View style={styles.progressRow}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${readPct(item)}%` }]} />
            </View>
            <Text style={styles.progressText}>{readPct(item)}%</Text>
          </View>
        )}
      </View>

      {/* Actions */}
      <View style={styles.rowActions}>
        <TouchableOpacity
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
          onPress={() => handleOpenBookModal(item)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={{ marginTop: 10 }}
        >
          <Feather name="more-vertical" size={18} color="#8D7E73" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // ── Book grid card (grid mode) ───────────────────────────────────────────
  const renderGridItem = ({ item }: { item: Book }) => (
    <TouchableOpacity
      style={styles.gridCard}
      activeOpacity={0.85}
      onPress={() => handleOpenBookModal(item)}
    >
      <View style={styles.gridCoverShadow}>
        <Image
          source={{ uri: item.coverUrl }}
          style={styles.gridCover}
          contentFit="cover"
          transition={200}
        />
        <TouchableOpacity
          style={styles.gridHeartBtn}
          onPress={() => handleToggleFavorite(item.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={item.isFavorite ? "heart" : "heart-outline"}
            size={18}
            color={item.isFavorite ? "#C0392B" : "rgba(255,255,255,0.85)"}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.gridInfo}>
        <Text style={styles.gridTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.gridAuthor} numberOfLines={1}>{item.author}</Text>
        <View style={[styles.shelfBadge, shelfBadgeBg(item.shelf), { marginTop: 6 }]}>
          <Text style={[styles.shelfBadgeText, shelfBadgeFg(item.shelf)]}>
            {shelfLabel(item.shelf)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const ListHeader = (
    <View>
      {/* ── Top bar ── */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.topBarTitle}>My Library</Text>
          <Text style={styles.topBarSub}>
            {stats.shelved ?? books.length} books shelved
          </Text>
        </View>
        <TouchableOpacity style={styles.notifBtn}>
          <Ionicons name="notifications-outline" size={22} color="#281D17" />
        </TouchableOpacity>
      </View>

      {/* ── Stats strip ── */}
      <View style={styles.statsStrip}>
        {[
          { label: "Reading",     value: stats.booksReading  ?? 0, color: "#1F6B38" },
          { label: "Want to Read",value: stats.wantToRead    ?? 0, color: "#785921" },
          { label: "Completed",   value: stats.booksCompleted ?? 0, color: "#422515" },
          { label: "Favorites",   value: stats.favorites     ?? 0, color: "#C0392B" },
        ].map((s, i) => (
          <View key={s.label} style={[styles.statItem, i < 3 && styles.statDivider]}>
            <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* ── Search bar ── */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Feather name="search" size={15} color="#8D7E73" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by title or author…"
            placeholderTextColor="#A89D94"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Feather name="x" size={15} color="#8D7E73" />
            </TouchableOpacity>
          )}
        </View>

        {/* View-mode toggle */}
        <TouchableOpacity
          style={styles.viewToggleBtn}
          onPress={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
        >
          <MaterialCommunityIcons
            name={viewMode === "grid" ? "view-list" : "view-grid"}
            size={20}
            color="#554438"
          />
        </TouchableOpacity>

        {/* Sort / filter */}
        <TouchableOpacity
          style={styles.viewToggleBtn}
          onPress={() => setFilterSortModalVisible(true)}
        >
          <MaterialCommunityIcons name="sort" size={20} color="#554438" />
        </TouchableOpacity>
      </View>

      {/* ── Shelf filter tabs ── */}
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

      {/* ── Results / sort row ── */}
      <View style={styles.resultsRow}>
        <Text style={styles.resultsText}>
          {filteredAndSortedBooks.length}{" "}
          {filteredAndSortedBooks.length === 1 ? "book" : "books"}
        </Text>
        <Text style={styles.sortBadge}>
          Sort: {SORT_LABELS[sortOption]}
        </Text>
      </View>
    </View>
  );

  const ListEmpty = (
    <View style={styles.emptyState}>
      <Ionicons name="book-outline" size={48} color="#C5BAB0" />
      <Text style={styles.emptyTitle}>
        {searchQuery ? "No results found" : "No books here yet"}
      </Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery
          ? `No books match "${searchQuery}"`
          : "Books you add to this shelf will appear here."}
      </Text>
      {searchQuery ? (
        <TouchableOpacity style={styles.exploreBtn} onPress={() => setSearchQuery("")}>
          <Text style={styles.exploreBtnText}>CLEAR SEARCH</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.exploreBtn}
          onPress={() => router.push("/search" as any)}
        >
          <Text style={styles.exploreBtnText}>EXPLORE BOOKS</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ECE7DF" />

      <FlatList
        data={filteredAndSortedBooks}
        key={viewMode}
        keyExtractor={(item) => item.id}
        numColumns={viewMode === "grid" ? 2 : 1}
        renderItem={viewMode === "list" ? renderListItem : renderGridItem}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={viewMode === "grid" ? styles.gridColumnWrapper : undefined}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={viewMode === "list" ? () => <View style={styles.separator} /> : undefined}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#5C4A3E"
            colors={["#5C4A3E"]}
          />
        }
      />

      {/* ── Bottom Nav — matches BookDetailScreen exactly ── */}
      <View style={styles.bottomNavContainer}>
        {[
          { icon: "home-outline",     label: "Home",     key: "home",     route: null },
          { icon: "compass-outline",  label: "Discover", key: "discover", route: "/search" },
          { icon: "search-outline",   label: "Search",   key: "search",   route: "/search" },
          { icon: "bookmark-outline", label: "Saved",    key: "saved",    route: "/saved" },
          { icon: "menu-outline",     label: "More",     key: "more",     route: null },
        ].map((item) => {
          const isActive = item.key === "saved";
          return (
            <TouchableOpacity
              key={item.key}
              style={[styles.bottomNavItem, isActive && styles.activeSearchPill]}
              onPress={() => item.route && router.push(item.route as any)}
              activeOpacity={item.route ? 0.7 : 1}
            >
              <Ionicons
                name={item.icon as any}
                size={22}
                color={isActive ? "#422515" : item.route ? "#554438" : "#B0A89E"}
              />
              <Text
                style={[
                  styles.bottomNavLabel,
                  isActive && { fontWeight: "800", color: "#422515" },
                  !item.route && { color: "#B0A89E" },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Sort & Filter Modal */}
      <FilterSortModal
        visible={filterSortModalVisible}
        onClose={() => setFilterSortModalVisible(false)}
        currentSort={sortOption}
        onSelectSort={setSortOption}
      />

      {/* Progress Modal */}
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

// ── Helpers ─────────────────────────────────────────────────────────────────

function shelfLabel(shelf: Exclude<ShelfType, "all">): string {
  const map: Record<string, string> = {
    reading:     "Reading",
    want_to_read:"Want to Read",
    completed:   "Completed",
    bookmarks:   "Bookmarked",
    favorites:   "Favorite",
  };
  return map[shelf] ?? shelf;
}

function shelfBadgeBg(shelf: Exclude<ShelfType, "all">) {
  const map: Record<string, object> = {
    reading:     { backgroundColor: "#D4EDDA" },
    want_to_read:{ backgroundColor: "#FEF9C3" },
    completed:   { backgroundColor: "#DCD5CA" },
    bookmarks:   { backgroundColor: "#FDE8CE" },
    favorites:   { backgroundColor: "#FDDEDE" },
  };
  return map[shelf] ?? { backgroundColor: "#E8E4DF" };
}

function shelfBadgeFg(shelf: Exclude<ShelfType, "all">) {
  const map: Record<string, object> = {
    reading:     { color: "#1F6B38" },
    want_to_read:{ color: "#785921" },
    completed:   { color: "#422515" },
    bookmarks:   { color: "#A0522D" },
    favorites:   { color: "#C0392B" },
  };
  return map[shelf] ?? { color: "#554438" };
}

// ── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ECE7DF",
  },
  listContent: {
    paddingBottom: 24,
    backgroundColor: "#ECE7DF",
  },

  // Top bar
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
  },
  topBarTitle: {
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

  // Stats strip
  statsStrip: {
    flexDirection: "row",
    backgroundColor: "#DFD9CF",
    marginHorizontal: 16,
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 14,
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

  // Search row
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F1EC",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D8D0C5",
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: "#281D17",
    padding: 0,
  },
  viewToggleBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#DFD9CF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#C5BAB0",
  },

  // Shelf tabs
  tabsScroll: { backgroundColor: "#ECE7DF" },
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

  // Results row
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
  sortBadge: {
    fontSize: 11,
    color: "#422515",
    backgroundColor: "#DFD9CF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    fontWeight: "700",
  },

  // List mode book row
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
  starsRow: {
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
  rowActions: {
    alignItems: "center",
    paddingTop: 4,
    marginLeft: 6,
  },
  separator: { height: 10 },

  // Grid mode
  gridColumnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  gridCard: {
    width: (width - 48) / 2,
    backgroundColor: "#F5F1EC",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden",
  },
  gridCoverShadow: { position: "relative" },
  gridCover: {
    width: "100%",
    height: 180,
    backgroundColor: "#DFD9CF",
  },
  gridHeartBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
  },
  gridInfo: {
    padding: 10,
  },
  gridTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#281D17",
    lineHeight: 17,
    fontFamily: "serif",
  },
  gridAuthor: {
    fontSize: 11,
    color: "#7D6E63",
    marginTop: 2,
  },

  // Empty state
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

  // Bottom nav — identical to BookDetailScreen
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
