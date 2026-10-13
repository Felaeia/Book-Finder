import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Keyboard,
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
import { Feather, FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import { useBookSearch } from "../components/Features/SearchBooks/lib/useBookSearch";
import { useSubjectBooks } from "../components/Features/SearchBooks/lib/useSubjectBooks";
import { INITIAL_BOOKS } from "../components/Features/SaveBooks/lib/mockData";
import { libraryApi } from "../components/Features/SaveBooks/api/libraryApi";

const { width } = Dimensions.get("window");

type ViewMode = "list" | "grid";
type SortOption = "recent" | "title" | "rating";

const SORT_LABELS: Record<SortOption, string> = {
  recent: "Recent",
  title: "Title",
  rating: "Rating",
};

const CATEGORY_TABS = [
  { key: "all", label: "All Books", subject: "fiction" },
  { key: "fiction", label: "Fiction", subject: "fiction" },
  { key: "romance", label: "Romance", subject: "romance" },
  { key: "mystery", label: "Mystery", subject: "mystery" },
  { key: "fantasy", label: "Fantasy", subject: "fantasy" },
  { key: "horror", label: "Horror", subject: "horror" },
  { key: "scifi", label: "Sci-Fi", subject: "science_fiction" },
  { key: "classics", label: "Classics", subject: "classics" },
];

const CURATED_COLLECTIONS = [
  {
    id: "horror",
    label: "Horror & Thriller",
    subject: "horror",
    covers: [
      "https://covers.openlibrary.org/b/isbn/9780451524935-M.jpg",
      "https://covers.openlibrary.org/b/isbn/9780141439471-M.jpg",
      "https://covers.openlibrary.org/b/isbn/9780307743657-M.jpg",
    ],
    count: "40+ Books",
  },
  {
    id: "romance",
    label: "Romance & Drama",
    subject: "romance",
    covers: [
      "https://covers.openlibrary.org/b/isbn/9780670026609-M.jpg",
      "https://covers.openlibrary.org/b/isbn/9780061120084-M.jpg",
      "https://covers.openlibrary.org/b/isbn/9780141439518-M.jpg",
    ],
    count: "35+ Books",
  },
  {
    id: "fantasy",
    label: "Epic Fantasy",
    subject: "fantasy",
    covers: [
      "https://covers.openlibrary.org/b/isbn/9780743273565-M.jpg",
      "https://covers.openlibrary.org/b/isbn/9780439064873-M.jpg",
      "https://covers.openlibrary.org/b/isbn/9780439136365-M.jpg",
    ],
    count: "50+ Books",
  },
  {
    id: "classics",
    label: "Timeless Classics",
    subject: "classics",
    covers: [
      "https://covers.openlibrary.org/b/isbn/9780141439600-M.jpg",
      "https://covers.openlibrary.org/b/isbn/9780743273565-M.jpg",
      "https://covers.openlibrary.org/b/isbn/9780451524935-M.jpg",
    ],
    count: "60+ Books",
  },
];

interface NormalizedBook {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  rating: number;
  badge: string;
  genre: string;
}

export default function SearchScreen() {
  const router = useRouter();

  // Search hook
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

  // Category and view state
  const [activeCategoryKey, setActiveCategoryKey] = useState("all");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [sortOption, setSortOption] = useState<SortOption>("recent");
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [refreshing, setRefreshing] = useState(false);

  // Selected subject for fetching
  const activeSubject = useMemo(() => {
    const found = CATEGORY_TABS.find((t) => t.key === activeCategoryKey);
    return found ? found.subject : "fiction";
  }, [activeCategoryKey]);

  // Open Library API hooks
  const { books: liveSubjectBooks, loading: subjectLoading } = useSubjectBooks(activeSubject, 16);
  const { books: featuredBooks, loading: featuredLoading } = useSubjectBooks("fiction", 10);

  // Load user favorites from libraryApi to sync heart state
  useEffect(() => {
    libraryApi.getBooks("favorites").then((favs) => {
      setFavoriteIds(new Set(favs.map((b) => b.id)));
    }).catch(() => {});
  }, []);

  const openBook = (book: { id: string }) => {
    const id = book.id.split("/").pop() ?? book.id;
    router.push({ pathname: "/book/[id]", params: { id } } as unknown as Href);
  };

  const handleToggleFavorite = async (book: NormalizedBook) => {
    const bookId = book.id.split("/").pop() ?? book.id;
    const isFav = favoriteIds.has(bookId);

    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (isFav) next.delete(bookId);
      else next.add(bookId);
      return next;
    });

    try {
      await libraryApi.toggleFavorite(bookId);
    } catch {
      try {
        await libraryApi.addBook({
          id: bookId,
          title: book.title,
          author: book.author,
          coverUrl: book.coverUrl,
          genre: book.genre || "Fiction",
        });
        await libraryApi.toggleFavorite(bookId);
      } catch (e) {
        console.log("Could not update favorite:", e);
      }
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const favs = await libraryApi.getBooks("favorites");
      setFavoriteIds(new Set(favs.map((b) => b.id)));
    } catch {}
    setTimeout(() => setRefreshing(false), 600);
  };

  // Combine live books with mock books for a rich, resilient feed
  const displayBooks: NormalizedBook[] = useMemo(() => {
    const normalizedLive: NormalizedBook[] = liveSubjectBooks.map((b, i) => {
      const id = b.id.split("/").pop() ?? b.id;
      const author = Array.isArray(b.authors) && b.authors.length > 0 ? b.authors[0] : "Unknown Author";
      const badges = ["Trending", "Popular", "Editor's Pick", "Staff Pick", "Bestseller"];
      return {
        id,
        title: b.title,
        author,
        coverUrl: b.coverUrl || "https://covers.openlibrary.org/b/id/8225261-M.jpg",
        rating: 4 + (i % 2 === 0 ? 1 : 0.5),
        badge: badges[i % badges.length],
        genre: activeCategoryKey === "all" ? "Fiction" : activeCategoryKey.toUpperCase(),
      };
    });

    const normalizedMock: NormalizedBook[] = INITIAL_BOOKS.map((b) => ({
      id: b.id,
      title: b.title,
      author: b.author,
      coverUrl: b.coverUrl,
      rating: b.rating || 4.5,
      badge: b.shelf === "want_to_read" ? "Want to Read" : b.isBookmarked ? "Bookmarked" : "Popular",
      genre: b.genre || "Fiction",
    }));

    // Filter mock by genre if not 'all'
    const filteredMock = activeCategoryKey === "all"
      ? normalizedMock
      : normalizedMock.filter((b) => b.genre.toLowerCase().includes(activeCategoryKey));

    const combined = normalizedLive.length > 0 ? [...normalizedLive, ...filteredMock] : normalizedMock;

    // Remove duplicates by id
    const seen = new Set<string>();
    const unique = combined.filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });

    // Apply sorting
    unique.sort((a, b) => {
      if (sortOption === "title") return a.title.localeCompare(b.title);
      if (sortOption === "rating") return b.rating - a.rating;
      return 0;
    });

    return unique;
  }, [liveSubjectBooks, activeCategoryKey, sortOption]);

  const cycleSort = () => {
    const options: SortOption[] = ["recent", "title", "rating"];
    const nextIdx = (options.indexOf(sortOption) + 1) % options.length;
    setSortOption(options[nextIdx]);
  };

  // Render book item in List mode (matches screenshot exactly)
  const renderListItem = ({ item }: { item: NormalizedBook }) => {
    const isFav = favoriteIds.has(item.id);
    return (
      <TouchableOpacity
        style={styles.bookCard}
        onPress={() => openBook(item)}
        activeOpacity={0.85}
      >
        <Image
          source={{ uri: item.coverUrl }}
          style={styles.bookCover}
          contentFit="cover"
          transition={200}
        />

        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.bookAuthor} numberOfLines={1}>
            by {item.author}
          </Text>

          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <FontAwesome
                key={star}
                name={star <= Math.floor(item.rating) ? "star" : star - item.rating <= 0.5 ? "star-half-empty" : "star-o"}
                size={13}
                color="#EA580C"
                style={{ marginRight: 2 }}
              />
            ))}
          </View>

          <View style={[styles.badgePill, badgeStyle(item.badge)]}>
            <Text style={[styles.badgeText, badgeTextStyle(item.badge)]}>
              {item.badge}
            </Text>
          </View>
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => handleToggleFavorite(item)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isFav ? "heart" : "heart-outline"}
              size={20}
              color={isFav ? "#C0392B" : "#8D7E73"}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
            <MaterialCommunityIcons name="dots-vertical" size={20} color="#8D7E73" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  // Render book item in Grid mode
  const renderGridItem = ({ item }: { item: NormalizedBook }) => {
    const isFav = favoriteIds.has(item.id);
    return (
      <TouchableOpacity
        style={styles.gridCard}
        onPress={() => openBook(item)}
        activeOpacity={0.85}
      >
        <View style={styles.gridCoverWrapper}>
          <Image
            source={{ uri: item.coverUrl }}
            style={styles.gridCover}
            contentFit="cover"
            transition={200}
          />
          <TouchableOpacity
            style={styles.gridHeartBtn}
            onPress={() => handleToggleFavorite(item)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isFav ? "heart" : "heart-outline"}
              size={18}
              color={isFav ? "#C0392B" : "#8D7E73"}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.gridInfo}>
          <Text style={styles.gridTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.gridAuthor} numberOfLines={1}>
            {item.author}
          </Text>

          <View style={styles.gridStarsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <FontAwesome
                key={star}
                name={star <= Math.floor(item.rating) ? "star" : "star-o"}
                size={11}
                color="#EA580C"
                style={{ marginRight: 1 }}
              />
            ))}
          </View>

          <View style={[styles.badgePill, badgeStyle(item.badge), { marginTop: 4, alignSelf: "flex-start" }]}>
            <Text style={[styles.badgeText, badgeTextStyle(item.badge), { fontSize: 10 }]}>
              {item.badge}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const showDropdown = isFocused && query.trim().length > 0;

  // Header Component for the FlatList
  const ListHeader = (
    <View>
      {/* ── Top Bar ── */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.topBarTitle}>Discover</Text>
          <Text style={styles.topBarSub}>Find your next favorite book</Text>
        </View>
        <TouchableOpacity style={styles.notifBtn} activeOpacity={0.8}>
          <Ionicons name="notifications-outline" size={22} color="#281D17" />
        </TouchableOpacity>
      </View>

      {/* ── Highlights / Quick Stats Strip (Matches screenshot) ── */}
      <View style={styles.statsStrip}>
        {[
          { label: "Trending",  value: "★ 4.8", color: "#1F6B38", key: "fiction" },
          { label: "Romance",   value: "Top 10", color: "#C0392B", key: "romance" },
          { label: "Fantasy",   value: "Magic",  color: "#785921", key: "fantasy" },
          { label: "Classics",  value: "100+",   color: "#422515", key: "classics" },
        ].map((item, i) => (
          <TouchableOpacity
            key={item.label}
            style={[styles.statItem, i < 3 && styles.statDivider]}
            onPress={() => setActiveCategoryKey(item.key)}
            activeOpacity={0.7}
          >
            <Text style={[styles.statValue, { color: item.color }]}>{item.value}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Search Bar Row ── */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Feather name="search" size={15} color="#8D7E73" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by title, author, or genre…"
            placeholderTextColor="#A89D94"
            value={query}
            onChangeText={setQuery}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            returnKeyType="search"
            autoCapitalize="none"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")}>
              <Feather name="x" size={15} color="#8D7E73" />
            </TouchableOpacity>
          )}
        </View>

        {/* View Mode Toggle */}
        <TouchableOpacity
          style={styles.viewToggleBtn}
          onPress={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name={viewMode === "grid" ? "view-list" : "view-grid"}
            size={20}
            color="#554438"
          />
        </TouchableOpacity>

        {/* Sort Button */}
        <TouchableOpacity
          style={styles.viewToggleBtn}
          onPress={cycleSort}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="sort" size={20} color="#554438" />
        </TouchableOpacity>
      </View>

      {/* ── Search Dropdown / Autocomplete ── */}
      {showDropdown && (
        <View style={styles.searchDropdown}>
          {searchLoading ? (
            <View style={styles.dropdownStatus}>
              <ActivityIndicator color="#422515" size="small" />
              <Text style={styles.dropdownStatusText}>Searching Open Library…</Text>
            </View>
          ) : searchError ? (
            <Text style={styles.dropdownStatusText}>{searchError}</Text>
          ) : suggestions.length > 0 ? (
            suggestions.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.dropdownItem}
                onPress={() => {
                  openBook(item);
                  selectSuggestion(item);
                  Keyboard.dismiss();
                }}
              >
                <Image
                  source={{ uri: item.coverUrl || "https://covers.openlibrary.org/b/id/8225261-S.jpg" }}
                  style={styles.dropdownCover}
                  contentFit="cover"
                />
                <View style={styles.dropdownInfo}>
                  <Text style={styles.dropdownTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.dropdownAuthor} numberOfLines={1}>
                    {Array.isArray(item.authors) && item.authors.length > 0 ? item.authors[0] : "Open Library"}
                  </Text>
                </View>
                <Feather name="chevron-right" size={16} color="#8D7E73" />
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.dropdownStatusText}>No books found for "{query}"</Text>
          )}
        </View>
      )}

      {/* ── Genre / Category Filter Tabs (Horizontal scroll) ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsRow}
        style={styles.tabsScroll}
      >
        {CATEGORY_TABS.map((tab) => {
          const active = activeCategoryKey === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, active && styles.activeTab]}
              onPress={() => setActiveCategoryKey(tab.key)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, active && styles.activeTabText]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ── "Selected for you" Horizontal Carousel ── */}
      <View style={styles.carouselSection}>
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={styles.sectionHeading}>SELECTED FOR YOU</Text>
            <View style={styles.headingUnderline} />
          </View>
          <TouchableOpacity
            style={styles.seeAllBtn}
            onPress={() => setActiveCategoryKey("fiction")}
            activeOpacity={0.7}
          >
            <Text style={styles.seeAllBtnText}>SEE ALL &gt;</Text>
          </TouchableOpacity>
        </View>

        {featuredLoading ? (
          <View style={{ paddingVertical: 30, alignItems: "center" }}>
            <ActivityIndicator color="#422515" />
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContent}
          >
            {(featuredBooks.length > 0 ? featuredBooks : INITIAL_BOOKS.slice(0, 6)).map((b, idx) => {
              const id = b.id.split("/").pop() ?? b.id;
              const title = b.title;
              const author = Array.isArray((b as any).authors) && (b as any).authors.length > 0
                ? (b as any).authors[0]
                : (b as any).author ?? "Author";
              const coverUrl = b.coverUrl || "https://covers.openlibrary.org/b/id/8225261-M.jpg";

              return (
                <TouchableOpacity
                  key={`${id}-${idx}`}
                  style={styles.carouselCard}
                  onPress={() => openBook({ id })}
                  activeOpacity={0.85}
                >
                  <Image
                    source={{ uri: coverUrl }}
                    style={styles.carouselCover}
                    contentFit="cover"
                  />
                  <Text style={styles.carouselTitle} numberOfLines={1}>
                    {title}
                  </Text>
                  <Text style={styles.carouselAuthor} numberOfLines={1}>
                    {author}
                  </Text>
                  <View style={styles.carouselStars}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <FontAwesome key={s} name="star" size={10} color="#EA580C" style={{ marginRight: 1 }} />
                    ))}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </View>

      {/* ── Curated Collections ("By group") ── */}
      <View style={styles.collectionsSection}>
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={styles.sectionHeading}>CURATED COLLECTIONS</Text>
            <View style={styles.headingUnderline} />
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.collectionsScroll}
        >
          {CURATED_COLLECTIONS.map((c) => (
            <TouchableOpacity
              key={c.id}
              style={styles.collectionCard}
              onPress={() => setActiveCategoryKey(c.subject)}
              activeOpacity={0.85}
            >
              {/* Overlapping cover thumbnails */}
              <View style={styles.collectionCovers}>
                {c.covers.map((cov, cIdx) => (
                  <Image
                    key={cIdx}
                    source={{ uri: cov }}
                    style={[
                      styles.collectionCoverThumb,
                      {
                        marginLeft: cIdx > 0 ? -16 : 0,
                        zIndex: 3 - cIdx,
                      },
                    ]}
                    contentFit="cover"
                  />
                ))}
              </View>

              <Text style={styles.collectionTitle}>{c.label}</Text>
              <Text style={styles.collectionCount}>{c.count}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ── Results Count & Sort Header ── */}
      <View style={styles.resultsRow}>
        <Text style={styles.resultsText}>
          {displayBooks.length} {displayBooks.length === 1 ? "book" : "books"}
        </Text>
        <TouchableOpacity onPress={cycleSort} activeOpacity={0.7}>
          <Text style={styles.sortBadge}>
            Sort: {SORT_LABELS[sortOption]}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ECE7DF" />

      <FlatList
        data={displayBooks}
        key={viewMode}
        keyExtractor={(item) => item.id}
        numColumns={viewMode === "grid" ? 2 : 1}
        renderItem={viewMode === "list" ? renderListItem : renderGridItem}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={viewMode === "grid" ? styles.gridColumnWrapper : undefined}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#5C4A3E"
            colors={["#5C4A3E"]}
          />
        }
      />

      {/* ── Bottom Navigation Bar — Discover Active ── */}
      <View style={styles.bottomNavContainer}>
        {[
          { icon: "home-outline",     label: "Home",     key: "home",     route: null },
          { icon: "compass-outline",  label: "Discover", key: "discover", route: "/search" },
          { icon: "search-outline",   label: "Search",   key: "search",   route: "/search" },
          { icon: "bookmark-outline", label: "Saved",    key: "saved",    route: "/saved" },
          { icon: "menu-outline",     label: "More",     key: "more",     route: null },
        ].map((item) => {
          const isActive = item.key === "discover";
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
    </SafeAreaView>
  );
}

// ── Helpers for badge coloring matching warm Goodreads design ──────────────
function badgeStyle(badge: string) {
  if (badge === "Want to Read") return { backgroundColor: "#FEF9C3" };
  if (badge === "Bookmarked") return { backgroundColor: "#FDE8CE" };
  if (badge === "Trending" || badge === "Bestseller") return { backgroundColor: "#D4EDDA" };
  if (badge === "Staff Pick") return { backgroundColor: "#FDDEDE" };
  return { backgroundColor: "#E8E4DF" };
}

function badgeTextStyle(badge: string) {
  if (badge === "Want to Read") return { color: "#785921" };
  if (badge === "Bookmarked") return { color: "#A0522D" };
  if (badge === "Trending" || badge === "Bestseller") return { color: "#1F6B38" };
  if (badge === "Staff Pick") return { color: "#C0392B" };
  return { color: "#554438" };
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

  // Top Bar
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

  // Stats / Highlights Strip
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
    fontSize: 19,
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

  // Search Row
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

  // Search Dropdown
  searchDropdown: {
    backgroundColor: "#F5F1EC",
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D8D0C5",
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  dropdownStatus: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    gap: 8,
  },
  dropdownStatusText: {
    fontSize: 13,
    color: "#7D6E63",
    textAlign: "center",
    padding: 12,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#EAE5DC",
  },
  dropdownCover: {
    width: 32,
    height: 48,
    borderRadius: 4,
    backgroundColor: "#DFD9CF",
    marginRight: 10,
  },
  dropdownInfo: {
    flex: 1,
  },
  dropdownTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#281D17",
    fontFamily: "serif",
  },
  dropdownAuthor: {
    fontSize: 11,
    color: "#7D6E63",
    marginTop: 2,
  },

  // Tabs Row
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

  // Horizontal Carousel Section
  carouselSection: {
    marginTop: 4,
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: "800",
    color: "#281D17",
    letterSpacing: 0.8,
  },
  headingUnderline: {
    height: 2,
    width: 28,
    backgroundColor: "#5C4A3E",
    marginTop: 4,
  },
  seeAllBtn: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  seeAllBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#5C4A3E",
    letterSpacing: 0.5,
  },
  carouselContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  carouselCard: {
    width: 102,
  },
  carouselCover: {
    width: 102,
    height: 148,
    borderRadius: 8,
    backgroundColor: "#DFD9CF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  carouselTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#281D17",
    marginTop: 6,
    fontFamily: "serif",
  },
  carouselAuthor: {
    fontSize: 10,
    color: "#7D6E63",
    marginTop: 1,
  },
  carouselStars: {
    flexDirection: "row",
    marginTop: 3,
  },

  // Collections Section
  collectionsSection: {
    marginBottom: 16,
  },
  collectionsScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  collectionCard: {
    backgroundColor: "#DFD9CF",
    borderRadius: 12,
    padding: 12,
    width: 145,
    borderWidth: 1,
    borderColor: "#C5BAB0",
  },
  collectionCovers: {
    flexDirection: "row",
    marginBottom: 10,
    height: 64,
  },
  collectionCoverThumb: {
    width: 44,
    height: 64,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#DFD9CF",
    backgroundColor: "#F5F1EC",
  },
  collectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#281D17",
    fontFamily: "serif",
  },
  collectionCount: {
    fontSize: 10,
    color: "#7D6E63",
    marginTop: 2,
  },

  // Results Row
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

  // Book Card - List Mode (Matches screenshot)
  bookCard: {
    flexDirection: "row",
    backgroundColor: "#F5F1EC",
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D8D0C5",
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  bookCover: {
    width: 66,
    height: 98,
    borderRadius: 6,
    backgroundColor: "#DFD9CF",
  },
  bookInfo: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "center",
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#281D17",
    fontFamily: "serif",
    lineHeight: 20,
  },
  bookAuthor: {
    fontSize: 13,
    color: "#5C4A3E",
    marginTop: 2,
  },
  starsRow: {
    flexDirection: "row",
    marginTop: 6,
    alignItems: "center",
  },
  badgePill: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginTop: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  cardActions: {
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingLeft: 4,
  },
  actionBtn: {
    padding: 4,
  },

  // Book Card - Grid Mode
  gridColumnWrapper: {
    paddingHorizontal: 16,
    justifyContent: "space-between",
    marginBottom: 12,
  },
  gridCard: {
    width: (width - 44) / 2,
    backgroundColor: "#F5F1EC",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D8D0C5",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  gridCoverWrapper: {
    position: "relative",
    width: "100%",
    height: 155,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#DFD9CF",
  },
  gridCover: {
    width: "100%",
    height: "100%",
  },
  gridHeartBtn: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(245, 241, 236, 0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  gridInfo: {
    marginTop: 8,
  },
  gridTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#281D17",
    fontFamily: "serif",
    lineHeight: 17,
  },
  gridAuthor: {
    fontSize: 11,
    color: "#7D6E63",
    marginTop: 2,
  },
  gridStarsRow: {
    flexDirection: "row",
    marginTop: 4,
  },

  // Bottom Navigation Bar
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
