import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { libraryApi } from "../../components/Features/SaveBooks/api/libraryApi";
import { Book as SavedBook } from "../../components/Features/SaveBooks/lib/types";
import {
  getAuthorDetails,
  getCoverUrl,
  getWorkDetails,
  OpenLibraryAuthor,
  OpenLibraryWork,
} from "../../components/Features/SearchBooks/api/openLibrary";
import { Theme } from "../../constants/Theme";

type DetailTab = "Overview" | "Author" | "Reviews";

const reviews = [
  { name: "Maya R.", handle: "@mayareads", color: "#D9906D", rating: 5, date: "Sep 18", text: "A quietly gripping story. The atmosphere stays with you long after the last page." },
  { name: "Theo W.", handle: "@theo.w", color: "#708A79", rating: 4, date: "Sep 12", text: "Beautifully written and full of characters that feel like real people." },
  { name: "Nina K.", handle: "@ninareads", color: "#8C82A5", rating: 5, date: "Aug 29", text: "One of those books I immediately wanted to recommend to everyone." },
];

function textValue(value?: string | { value: string }) {
  return typeof value === "string" ? value : value?.value ?? "";
}

function words(value: string) {
  return value.trim().split(/\s+/).filter(Boolean);
}

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const workId = Array.isArray(id) ? id[0] : id;
  const [work, setWork] = useState<OpenLibraryWork | null>(null);
  const [author, setAuthor] = useState<OpenLibraryAuthor | null>(null);
  const [tab, setTab] = useState<DetailTab>("Overview");
  const [expanded, setExpanded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!workId) return;
    let active = true;
    setWork(null);
    setError(false);

    getWorkDetails(workId)
      .then(async (details) => {
        if (!active) return;
        setWork(details);
        const authorKey = details.authors?.[0]?.author?.key;
        if (authorKey) {
          try {
            const authorDetails = await getAuthorDetails(authorKey);
            if (active) setAuthor(authorDetails);
          } catch {
            if (active) setAuthor(null);
          }
        }
      })
      .catch(() => {
        if (active) setError(true);
      });

    libraryApi.getBooks().then((books) => {
      if (active) setIsSaved(books.some((book) => book.id === `/works/${workId}`));
    });

    return () => {
      active = false;
    };
  }, [workId]);

  const description = textValue(work?.description);
  const descriptionWords = words(description);
  const shortDescription = descriptionWords.slice(0, 50).join(" ");
  const title = work?.title ?? "Book details";
  const authorName = author?.name ?? "Unknown author";
  const coverUrl = getCoverUrl(work?.covers?.[0], "L");
  const subjectLabels = work?.subjects?.slice(0, 3) ?? [];

  const toggleSaved = async () => {
    if (!work || saving) return;
    setSaving(true);
    try {
      const bookId = work.key || `/works/${workId}`;
      if (isSaved) {
        await libraryApi.removeBook(bookId);
        setIsSaved(false);
      } else {
        const book: Omit<SavedBook, "shelf" | "rating" | "currentPage" | "totalPages" | "dateAdded" | "isFavorite"> = {
          id: bookId,
          title: work.title,
          author: authorName,
          coverUrl: coverUrl ?? "",
          genre: subjectLabels[0] ?? "Fiction",
          description: description || undefined,
        };
        await libraryApi.addBook(book);
        setIsSaved(true);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <StatusBar barStyle="light-content" backgroundColor={Theme.colors.background} />
      <View style={styles.page}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} style={styles.iconButton} accessibilityRole="button" accessibilityLabel="Go back">
            <Ionicons name="arrow-back" size={22} color={Theme.colors.textPrimary} />
          </Pressable>
          <Text style={styles.brand}>BOOKFINDER</Text>
          <Pressable onPress={toggleSaved} style={styles.iconButton} accessibilityRole="button" accessibilityLabel={isSaved ? "Remove from saved books" : "Save book"}>
            <Ionicons name={isSaved ? "bookmark" : "bookmark-outline"} size={22} color={isSaved ? Theme.colors.accent : Theme.colors.textPrimary} />
          </Pressable>
        </View>

        {!work && !error ? (
          <View style={styles.centerState}><ActivityIndicator color={Theme.colors.accent} /><Text style={styles.muted}>Loading book details...</Text></View>
        ) : error ? (
          <View style={styles.centerState}><Text style={styles.errorText}>Book details could not be loaded.</Text><Pressable onPress={() => router.back()}><Text style={styles.actionText}>Go back</Text></Pressable></View>
        ) : (
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.hero}>
              {coverUrl ? <Image source={{ uri: coverUrl }} style={styles.cover} resizeMode="cover" /> : <View style={styles.coverPlaceholder}><Ionicons name="book-outline" size={38} color={Theme.colors.textMuted} /></View>}
              <View style={styles.bookInfo}>
                <Text style={styles.eyebrow}>FEATURED READ</Text>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.byline}>by {authorName}</Text>
                <View style={styles.ratingRow}>
                  <Text style={styles.stars}>★★★★★</Text>
                  <Text style={styles.rating}>4.7</Text>
                </View>
                <Text style={styles.ratingCount}>Reader rating · 3 reviews</Text>
                {work?.first_publish_date ? <Text style={styles.publishYear}>{work.first_publish_date}</Text> : null}
                <View style={styles.subjects}>
                  {subjectLabels.map((subject) => <Text key={subject} style={styles.subject}>{subject}</Text>)}
                </View>
              </View>
            </View>

            <View style={styles.actions}>
              <Pressable style={[styles.saveButton, isSaved && styles.savedButton]} onPress={toggleSaved} disabled={saving} accessibilityRole="button">
                <Ionicons name={isSaved ? "checkmark" : "bookmark-outline"} size={17} color="#fff" />
                <Text style={styles.saveButtonText}>{saving ? "Saving..." : isSaved ? "Saved to your shelf" : "Add to my shelf"}</Text>
              </Pressable>
              <Text style={styles.shelfHint}>{isSaved ? "In Want to Read" : "Want to read"}</Text>
            </View>

            <View style={styles.tabs}>
              {(["Overview", "Author", "Reviews"] as DetailTab[]).map((item) => (
                <Pressable key={item} onPress={() => setTab(item)} style={styles.tab} accessibilityRole="tab" accessibilityState={{ selected: tab === item }}>
                  <Text style={[styles.tabText, tab === item && styles.activeTabText]}>{item}</Text>
                  {tab === item && <View style={styles.tabIndicator} />}
                </Pressable>
              ))}
            </View>

            {tab === "Overview" ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>The story</Text>
                <Text style={styles.description}>
                  {description ? (expanded || descriptionWords.length <= 50 ? description : `${shortDescription}...`) : "An overview for this title is not available yet."}
                </Text>
                {descriptionWords.length > 50 && <Pressable onPress={() => setExpanded((value) => !value)} accessibilityRole="button"><Text style={styles.actionText}>{expanded ? "Show less" : "...show more"}</Text></Pressable>}
              </View>
            ) : tab === "Author" ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{authorName}</Text>
                {author?.birth_date ? <Text style={styles.authorDate}>Born {author.birth_date}</Text> : null}
                <Text style={styles.description}>{textValue(author?.bio) || `Learn more about ${authorName} through their books and stories.`}</Text>
              </View>
            ) : (
              <View style={styles.section}>
                <View style={styles.reviewHeading}><Text style={styles.sectionTitle}>Reader reviews</Text><Text style={styles.reviewCount}>3 accounts</Text></View>
                {reviews.map((review) => (
                  <View key={review.handle} style={styles.review}>
                    <View style={[styles.avatar, { backgroundColor: review.color }]}><Text style={styles.avatarText}>{review.name.slice(0, 1)}</Text></View>
                    <View style={styles.reviewBody}>
                      <View style={styles.reviewMeta}><View><Text style={styles.reviewer}>{review.name}</Text><Text style={styles.handle}>{review.handle}</Text></View><Text style={styles.reviewDate}>{review.date}</Text></View>
                      <Text style={styles.reviewStars}>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</Text>
                      <Text style={styles.reviewText}>{review.text}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Theme.colors.background },
  page: { flex: 1, backgroundColor: Theme.colors.background },
  topBar: { height: 54, paddingHorizontal: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  iconButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  brand: { color: "#D4C8C2", fontSize: 11, fontWeight: "800", letterSpacing: 2 },
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
  hero: { flexDirection: "row", gap: 18, alignItems: "center" },
  cover: { width: 122, height: 184, borderRadius: 8, backgroundColor: "#2B2221" },
  coverPlaceholder: { width: 122, height: 184, borderRadius: 8, backgroundColor: "#2B2221", alignItems: "center", justifyContent: "center" },
  bookInfo: { flex: 1, minWidth: 0 },
  eyebrow: { color: Theme.colors.accent, fontSize: 10, fontWeight: "800", letterSpacing: 1.5, marginBottom: 8 },
  title: { color: Theme.colors.textPrimary, fontSize: 23, lineHeight: 28, fontWeight: "700" },
  byline: { color: "#C5B9B5", fontSize: 13, marginTop: 5 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 13 },
  stars: { color: Theme.colors.accent, fontSize: 17, letterSpacing: 1 },
  rating: { color: Theme.colors.textPrimary, fontWeight: "700", fontSize: 13 },
  ratingCount: { color: Theme.colors.textMuted, fontSize: 11, marginTop: 3 },
  publishYear: { color: "#C5B9B5", fontSize: 12, marginTop: 8 },
  subjects: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 9 },
  subject: { color: "#E4D7D1", backgroundColor: "#302523", borderRadius: 4, overflow: "hidden", paddingHorizontal: 7, paddingVertical: 4, fontSize: 10 },
  actions: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 24, marginBottom: 24 },
  saveButton: { minHeight: 44, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: Theme.colors.accent, borderRadius: 6, paddingHorizontal: 16, flex: 1 },
  savedButton: { backgroundColor: "#6A4739" },
  saveButtonText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  shelfHint: { color: Theme.colors.textMuted, fontSize: 11 },
  tabs: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#342A28", marginHorizontal: -4 },
  tab: { flex: 1, minHeight: 45, justifyContent: "center", alignItems: "center", position: "relative" },
  tabText: { color: "#9A8E89", fontSize: 13, fontWeight: "600" },
  activeTabText: { color: Theme.colors.textPrimary },
  tabIndicator: { position: "absolute", bottom: -1, height: 2, left: 16, right: 16, backgroundColor: Theme.colors.accent },
  section: { paddingTop: 22 },
  sectionTitle: { color: Theme.colors.textPrimary, fontSize: 17, fontWeight: "700", marginBottom: 11 },
  description: { color: "#C8BEBA", fontSize: 13, lineHeight: 19 },
  actionText: { color: Theme.colors.accent, fontSize: 13, fontWeight: "700", marginTop: 8 },
  centerState: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  muted: { color: Theme.colors.textMuted, fontSize: 13 },
  errorText: { color: Theme.colors.textPrimary, fontSize: 15 },
  authorDate: { color: Theme.colors.textMuted, fontSize: 12, marginTop: -5, marginBottom: 14 },
  reviewHeading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  reviewCount: { color: Theme.colors.textMuted, fontSize: 11, marginBottom: 10 },
  review: { flexDirection: "row", gap: 12, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#342A28" },
  avatar: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#fff", fontWeight: "800", fontSize: 15 },
  reviewBody: { flex: 1 },
  reviewMeta: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  reviewer: { color: Theme.colors.textPrimary, fontSize: 13, fontWeight: "700" },
  handle: { color: Theme.colors.textMuted, fontSize: 11, marginTop: 2 },
  reviewDate: { color: Theme.colors.textMuted, fontSize: 10 },
  reviewStars: { color: Theme.colors.accent, fontSize: 12, marginTop: 7 },
  reviewText: { color: "#C8BEBA", fontSize: 12, lineHeight: 18, marginTop: 5 },
});