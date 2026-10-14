import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Share,
} from "react-native";
import { Image } from "expo-image";
import { Feather, FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Book } from "../components/Features/SaveBooks/lib/types";

const { width } = Dimensions.get("window");

export interface BookDetailScreenProps {
  book: Book;
  onBack?: () => void;
  onUpdateShelf?: (shelf: string) => void;
}

export function BookDetailScreen({ book, onBack, onUpdateShelf }: BookDetailScreenProps) {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [currentShelf, setCurrentShelf] = useState(book.shelf || "want_to_read");
  const [showShelfMenu, setShowShelfMenu] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});
  const scrollRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / width);
    if (slide !== currentSlide && slide >= 0 && slide <= 2) {
      setCurrentSlide(slide);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out "${book.title}" by ${book.author} on BookFinder!`,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const toggleReviewLike = (reviewId: string) => {
    setLikedReviews((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  const shelfLabels: Record<string, string> = {
    want_to_read: "Want to Read",
    reading: "Currently Reading",
    completed: "Read / Finished",
    bookmarks: "Bookmarked",
    favorites: "Favorites",
  };

  // Mock series books
  const seriesBooks = [
    {
      id: "s1",
      title: "Harry Potter and the Chamber of Secrets",
      cover: "https://covers.openlibrary.org/b/isbn/9780439064873-L.jpg",
    },
    {
      id: "s2",
      title: "Harry Potter and the Prisoner of Azkaban",
      cover: "https://covers.openlibrary.org/b/isbn/9780439136365-L.jpg",
    },
    {
      id: "s3",
      title: "Harry Potter and the Goblet of Fire",
      cover: "https://covers.openlibrary.org/b/isbn/9780439139601-L.jpg",
    },
    {
      id: "s4",
      title: "Harry Potter and the Order of the Phoenix",
      cover: "https://covers.openlibrary.org/b/isbn/9780439358071-L.jpg",
    },
  ];

  // Mock author's other books
  const authorBooks = [
    {
      id: "a1",
      title: "The Tales of Beedle the Bard",
      cover: "https://covers.openlibrary.org/b/isbn/9780545128285-L.jpg",
    },
    {
      id: "a2",
      title: "Fantastic Beasts & Where to Find Them",
      cover: "https://covers.openlibrary.org/b/isbn/9781338132311-L.jpg",
    },
    {
      id: "a3",
      title: "Quidditch Through the Ages",
      cover: "https://covers.openlibrary.org/b/isbn/9781338125740-L.jpg",
    },
    {
      id: "a4",
      title: "The Casual Vacancy",
      cover: "https://covers.openlibrary.org/b/isbn/9780316228534-L.jpg",
    },
  ];

  // Readers also enjoyed
  const readersEnjoyed = [
    {
      id: "r1",
      title: "The Hunger Games",
      author: "Suzanne Collins",
      cover: "https://covers.openlibrary.org/b/isbn/9780439023481-L.jpg",
    },
    {
      id: "r2",
      title: "Twilight",
      author: "Stephenie Meyer",
      cover: "https://covers.openlibrary.org/b/isbn/9780316015844-L.jpg",
    },
    {
      id: "r3",
      title: "The Hobbit, or There and Back Again",
      author: "J.R.R. Tolkien",
      cover: "https://covers.openlibrary.org/b/isbn/9780544003415-L.jpg",
    },
    {
      id: "r4",
      title: "The Fault in Our Stars",
      author: "John Green",
      cover: "https://covers.openlibrary.org/b/isbn/9780525478812-L.jpg",
    },
  ];

  // Genres
  const genres = [
    "Fantasy",
    "Fiction",
    "Young Adult",
    "Harry Potter",
    "Magic",
    "Audiobook",
    "Childrens",
    "Middle Grade",
    "Classics",
    "Adventure",
  ];

  // Lists featuring this book
  const featuredLists = [
    {
      id: "l1",
      title: "Best Books of the 20th Century",
      count: "7,818 books",
      covers: [
        "https://covers.openlibrary.org/b/isbn/9780316015844-L.jpg",
        "https://covers.openlibrary.org/b/isbn/9780439554930-L.jpg",
        "https://covers.openlibrary.org/b/isbn/9780544003415-L.jpg",
      ],
    },
    {
      id: "l2",
      title: "Books That Everyone Should Read At Least Once",
      count: "79,747 books",
      covers: [
        "https://covers.openlibrary.org/b/isbn/9780439554930-L.jpg",
        "https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg",
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#422515" />

      {/* Top Header Bar with title when scrolled */}
      <View style={styles.topAppBar}>
        <TouchableOpacity
          onPress={handleBack}
          activeOpacity={0.7}
          style={styles.iconCircle}
        >
          <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.topAppTitleCol}>
          <Text style={styles.topAppTitle} numberOfLines={1}>
            {book.title}
          </Text>
          <Text style={styles.topAppAuthor} numberOfLines={1}>
            by {book.author}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleShare}
          activeOpacity={0.7}
          style={styles.iconCircle}
        >
          <Feather name="upload" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} bounces={false} showsVerticalScrollIndicator={false}>
        {/* UPPER SWIPEABLE CAROUSEL SECTION */}
        <View style={styles.carouselContainer}>
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            style={styles.slidesWrapper}
          >
            {/* SLIDE 1: Book Cover */}
            <View style={[styles.slide, { width }]}>
              <View style={styles.coverShadowBox}>
                <Image
                  source={{ uri: book.coverUrl }}
                  style={styles.bookCover}
                  contentFit="cover"
                  transition={250}
                />
              </View>
            </View>

            {/* SLIDE 2: Edition & Publication Details */}
            <View style={[styles.slide, styles.textSlide, { width }]}>
              <Text style={styles.editionText}>
                {book.edition ?? "Kindle Edition, 333 pages"}
              </Text>
              <Text style={styles.publishedDateText}>
                {book.publishedDate ?? "Published December 8, 2015"}
              </Text>
              <Text style={styles.publisherText}>
                {book.publisher ?? "by Pottermore Publishing"}
              </Text>

              <TouchableOpacity style={styles.outlinedButton} activeOpacity={0.8}>
                <Text style={styles.outlinedButtonText}>MORE DETAILS AND EDITIONS &gt;</Text>
              </TouchableOpacity>
            </View>

            {/* SLIDE 3: Author Bio & Details */}
            <View style={[styles.slide, styles.textSlide, { width }]}>
              <Image
                source={{
                  uri:
                    book.authorPhotoUrl ??
                    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
                }}
                style={styles.authorAvatar}
                contentFit="cover"
              />

              <Text style={styles.authorBioText} numberOfLines={5}>
                {book.authorBio ??
                  `See also: Robert Galbraith Although she writes under the pen name J.K. Rowling, pronounced like rolling, her name when her first Harry Potter book was published was simply Joanne Rowling. Anticipating that the target audience of young...`}
              </Text>

              <TouchableOpacity style={styles.outlinedButton} activeOpacity={0.8}>
                <Text style={styles.outlinedButtonText}>MORE ABOUT THE AUTHOR &gt;</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Carousel Pagination Dots */}
          <View style={styles.dotsRow}>
            {[0, 1, 2].map((idx) => (
              <View
                key={idx}
                style={[
                  styles.dot,
                  currentSlide === idx ? styles.activeDot : styles.inactiveDot,
                ]}
              />
            ))}
          </View>
        </View>

        {/* LOWER SECTION: BOOK INFO & ACTIONS */}
        <View style={styles.lowerSection}>
          {/* Title */}
          <Text style={styles.titleText}>{book.title}</Text>

          {/* Series Info */}
          {book.series ? (
            <Text style={styles.seriesText}>({book.series})</Text>
          ) : (
            <Text style={styles.seriesText}>(Harry Potter #1)</Text>
          )}

          {/* Author / Illustrator */}
          <Text style={styles.authorText}>by {book.author}</Text>

          {/* Rating Summary Row */}
          <View style={styles.ratingSummaryRow}>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((s) => (
                <FontAwesome key={s} name="star" size={13} color="#EA580C" style={styles.starIcon} />
              ))}
            </View>
            <Text style={styles.ratingCountText}>
              5.0 · {book.ratingsCount ?? "11,955,198"} ratings · {book.reviewsCount ?? "217,689"} reviews
            </Text>
          </View>

          {/* Green Shelf Status Dropdown Button */}
          <View style={styles.shelfDropdownWrapper}>
            <TouchableOpacity
              style={styles.wantToReadButton}
              activeOpacity={0.85}
              onPress={() => setShowShelfMenu(!showShelfMenu)}
            >
              <Text style={styles.wantToReadText}>
                {shelfLabels[currentShelf] || "Want to Read"}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Dropdown Options */}
            {showShelfMenu && (
              <View style={styles.shelfMenu}>
                {(["want_to_read", "reading", "completed"] as const).map((sh) => (
                  <TouchableOpacity
                    key={sh}
                    style={styles.shelfMenuItem}
                    onPress={() => {
                      setCurrentShelf(sh);
                      setShowShelfMenu(false);
                      if (onUpdateShelf) onUpdateShelf(sh);
                    }}
                  >
                    <Text
                      style={[
                        styles.shelfMenuText,
                        currentShelf === sh && styles.shelfMenuTextActive,
                      ]}
                    >
                      {shelfLabels[sh]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Interactive User Rating: 5 Stars */}
          <View style={styles.userRatingSection}>
            <View style={styles.interactiveStarsRow}>
              {[1, 2, 3, 4, 5].map((starIndex) => (
                <TouchableOpacity
                  key={starIndex}
                  activeOpacity={0.7}
                  onPress={() => setUserRating(starIndex)}
                  style={styles.interactiveStarTouch}
                >
                  <FontAwesome
                    name={starIndex <= userRating ? "star" : "star-o"}
                    size={24}
                    color={starIndex <= userRating ? "#EA580C" : "#8D7E73"}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.rateThisBookLabel}>
              {userRating > 0 ? `You rated this ${userRating} stars` : "Rate this book"}
            </Text>
          </View>

          {/* 3 Action Buttons with Labels (Preview, Book Details, Share) */}
          <View style={styles.labeledActionsRow}>
            <TouchableOpacity style={styles.labeledActionItem} activeOpacity={0.7}>
              <View style={styles.actionCircle}>
                <Feather name="book-open" size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.actionItemLabel}>Preview</Text>
            </TouchableOpacity>

            <View style={styles.verticalActionDivider} />

            <TouchableOpacity style={styles.labeledActionItem} activeOpacity={0.7}>
              <View style={styles.actionCircle}>
                <Feather name="info" size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.actionItemLabel}>Book Details</Text>
            </TouchableOpacity>

            <View style={styles.verticalActionDivider} />

            <TouchableOpacity style={styles.labeledActionItem} activeOpacity={0.7} onPress={handleShare}>
              <View style={styles.actionCircle}>
                <MaterialCommunityIcons name="share" size={22} color="#FFFFFF" />
              </View>
              <Text style={styles.actionItemLabel}>Share</Text>
            </TouchableOpacity>
          </View>

          {/* BOOK DESCRIPTION SECTION */}
          <View style={styles.contentSection}>
            <View style={styles.sectionHeaderCol}>
              <Text style={styles.sectionHeading}>BOOK DESCRIPTION</Text>
              <View style={styles.headingUnderline} />
            </View>

            <Text
              style={styles.descriptionParagraph}
              numberOfLines={isDescriptionExpanded ? undefined : 6}
            >
              {book.description ??
                `In 1975, author Ben Mears returns to his former hometown of Jerusalem's Lot looking for inspiration for a new book. He befriends and starts a romantic relationship with Susan Norton, a young woman who lives locally with her overbearing mother and who yearns to leave the small town. Meanwhile, 11-year-old Mark Petrie finds himself the target of a bully at his new school, and meets school teacher Matt Burke. A strange European man named. In 1975, author Ben Mears returns to his former hometown of Jerusalem's Lot looking for inspiration for a new book. He befriends and starts a romantic relationship with Susan Norton, a young woman.`}
            </Text>

            <TouchableOpacity
              onPress={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              activeOpacity={0.7}
              style={styles.readMoreTouch}
            >
              <Text style={styles.readMoreText}>
                {isDescriptionExpanded ? "show less" : "read more"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* COMMUNITY REVIEWS BREAKDOWN */}
          <View style={styles.contentSection}>
            <View style={styles.reviewsHeaderRow}>
              <View>
                <Text style={styles.reviewsTitle}>207,721 Community Reviews</Text>
                <View style={styles.reviewsRatingSubRow}>
                  <View style={styles.starsRow}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <FontAwesome key={s} name="star" size={13} color="#EA580C" style={styles.starIcon} />
                    ))}
                  </View>
                  <Text style={styles.ratingSubText}>5.0 (11,955,198 ratings)</Text>
                </View>
              </View>
              <Feather name="chevron-right" size={22} color="#8D7E73" />
            </View>

            {/* Star Distribution Bars */}
            <View style={styles.breakdownContainer}>
              {[
                { label: "5 star", pct: 0.85, color: "#EA580C" },
                { label: "4 star", pct: 0.75, color: "#EA580C" },
                { label: "3 star", pct: 0.25, color: "#BFB4A9" },
                { label: "2 star", pct: 0.15, color: "#BFB4A9" },
                { label: "1 star", pct: 0.1, color: "#BFB4A9" },
              ].map((bar, idx) => (
                <View key={idx} style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>{bar.label}</Text>
                  <View style={styles.barBackground}>
                    <View
                      style={[
                        styles.barFill,
                        { width: `${bar.pct * 100}%`, backgroundColor: bar.color },
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* COMMUNITY RATINGS AND REVIEWS */}
          <View style={styles.contentSection}>
            <Text style={styles.communityHeading}>Community Ratings and Reviews</Text>

            {/* Review 1: Jayson */}
            <View style={styles.reviewCard}>
              <View style={styles.reviewUserRow}>
                <Image
                  source={{
                    uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120",
                  }}
                  style={styles.reviewAvatar}
                />
                <View style={styles.reviewUserMeta}>
                  <Text style={styles.reviewUserName}>
                    Jayson <Text style={styles.reviewRatedText}>rated it</Text>{" "}
                    <Text style={{ color: "#EA580C" }}>★★★★★</Text>
                  </Text>
                  <Text style={styles.reviewTimestamp}>2 years ago</Text>
                </View>
                <Feather name="more-horizontal" size={18} color="#8D7E73" />
              </View>
              <Text style={styles.reviewBody}>Love the story!</Text>
              <View style={styles.reviewFooterRow}>
                <Text style={styles.reviewActionText}>Like · Comment</Text>
                <TouchableOpacity
                  onPress={() => toggleReviewLike("r1")}
                  style={styles.likeCommentCounts}
                >
                  <Feather
                    name="thumbs-up"
                    size={14}
                    color={likedReviews["r1"] ? "#EA580C" : "#7D6E63"}
                  />
                  <Text style={styles.countNumberText}>
                    {likedReviews["r1"] ? 979 : 978}
                  </Text>
                  <Feather name="message-square" size={14} color="#7D6E63" style={{ marginLeft: 8 }} />
                  <Text style={styles.countNumberText}>244</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Review 2: Mark */}
            <View style={styles.reviewCard}>
              <View style={styles.reviewUserRow}>
                <Image
                  source={{
                    uri: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=120",
                  }}
                  style={styles.reviewAvatar}
                />
                <View style={styles.reviewUserMeta}>
                  <Text style={styles.reviewUserName}>
                    Mark <Text style={styles.reviewRatedText}>rated it</Text>{" "}
                    <Text style={{ color: "#EA580C" }}>★★★★★</Text>
                  </Text>
                  <Text style={styles.reviewTimestamp}>1 year ago</Text>
                </View>
                <Feather name="more-horizontal" size={18} color="#8D7E73" />
              </View>
              <Text style={styles.reviewBody}>
                Yes the story! Love the story! Love the story! For the story! Love the story! Love the story! Love the win! Love the story! Love...... <Text style={styles.readMoreText}>more</Text>
              </Text>
              <View style={styles.reviewFooterRow}>
                <Text style={styles.reviewActionText}>Like · Comment</Text>
                <TouchableOpacity
                  onPress={() => toggleReviewLike("r2")}
                  style={styles.likeCommentCounts}
                >
                  <Feather
                    name="thumbs-up"
                    size={14}
                    color={likedReviews["r2"] ? "#EA580C" : "#7D6E63"}
                  />
                  <Text style={styles.countNumberText}>
                    {likedReviews["r2"] ? 979 : 978}
                  </Text>
                  <Feather name="message-square" size={14} color="#7D6E63" style={{ marginLeft: 8 }} />
                  <Text style={styles.countNumberText}>244</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Review 3: Maysa */}
            <View style={styles.reviewCard}>
              <View style={styles.reviewUserRow}>
                <Image
                  source={{
                    uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
                  }}
                  style={styles.reviewAvatar}
                />
                <View style={styles.reviewUserMeta}>
                  <Text style={styles.reviewUserName}>
                    Maysa <Text style={styles.reviewRatedText}>rated it</Text>{" "}
                    <Text style={{ color: "#EA580C" }}>★★★★★</Text>
                  </Text>
                  <Text style={styles.reviewTimestamp}>2 years ago</Text>
                </View>
                <Feather name="more-horizontal" size={18} color="#8D7E73" />
              </View>
              <Text style={styles.reviewBody}>Absolute cinema :)</Text>
              <View style={styles.reviewFooterRow}>
                <Text style={styles.reviewActionText}>Like · Comment</Text>
                <TouchableOpacity
                  onPress={() => toggleReviewLike("r3")}
                  style={styles.likeCommentCounts}
                >
                  <Feather
                    name="thumbs-up"
                    size={14}
                    color={likedReviews["r3"] ? "#EA580C" : "#7D6E63"}
                  />
                  <Text style={styles.countNumberText}>
                    {likedReviews["r3"] ? 979 : 978}
                  </Text>
                  <Feather name="message-square" size={14} color="#7D6E63" style={{ marginLeft: 8 }} />
                  <Text style={styles.countNumberText}>244</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Full-width button: More community ratings and reviews */}
            <TouchableOpacity style={styles.moreReviewsBar} activeOpacity={0.7}>
              <Text style={styles.moreReviewsBarText}>More community ratings and reviews</Text>
              <Feather name="chevron-right" size={18} color="#8D7E73" />
            </TouchableOpacity>
          </View>

          {/* OTHER BOOKS IN THIS SERIES */}
          <View style={styles.carouselSection}>
            <View style={styles.sectionHeaderCol}>
              <Text style={styles.sectionHeading}>OTHER BOOKS IN THIS SERIES</Text>
              <View style={styles.headingUnderline} />
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollRow}>
              {seriesBooks.map((item) => (
                <View key={item.id} style={styles.smallBookCard}>
                  <Image source={{ uri: item.cover }} style={styles.smallBookCover} contentFit="cover" />
                  <Text style={styles.smallBookTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* OTHER BOOKS BY THIS AUTHOR */}
          <View style={styles.carouselSection}>
            <View style={styles.sectionHeaderCol}>
              <Text style={styles.sectionHeading}>OTHER BOOKS BY THIS AUTHOR</Text>
              <View style={styles.headingUnderline} />
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollRow}>
              {authorBooks.map((item) => (
                <View key={item.id} style={styles.smallBookCard}>
                  <Image source={{ uri: item.cover }} style={styles.smallBookCover} contentFit="cover" />
                  <Text style={styles.smallBookTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* READERS ALSO ENJOYED */}
          <View style={styles.carouselSection}>
            <View style={styles.sectionHeaderCol}>
              <Text style={styles.sectionHeading}>READERS ALSO ENJOYED</Text>
              <View style={styles.headingUnderline} />
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollRow}>
              {readersEnjoyed.map((item) => (
                <View key={item.id} style={styles.smallBookCard}>
                  <Image source={{ uri: item.cover }} style={styles.smallBookCover} contentFit="cover" />
                  <Text style={styles.smallBookTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.smallBookAuthor} numberOfLines={1}>
                    {item.author}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* GENRES TAG PILLS */}
          <View style={styles.contentSection}>
            <View style={styles.sectionHeaderCol}>
              <Text style={styles.sectionHeading}>GENRES</Text>
              <View style={styles.headingUnderline} />
            </View>

            <View style={styles.genresGrid}>
              {genres.map((g, idx) => (
                <View key={idx} style={styles.genrePill}>
                  <Text style={styles.genrePillText}>{g}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* LISTS FEATURING THIS BOOK */}
          <View style={styles.carouselSection}>
            <View style={styles.sectionHeaderCol}>
              <Text style={styles.sectionHeading}>LISTS FEATURING THIS BOOK</Text>
              <View style={styles.headingUnderline} />
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollRow}>
              {featuredLists.map((item) => (
                <View key={item.id} style={styles.listCard}>
                  {/* Overlapping Book Previews */}
                  <View style={styles.listCoversWrapper}>
                    {item.covers.map((c, cIdx) => (
                      <Image
                        key={cIdx}
                        source={{ uri: c }}
                        style={[
                          styles.listCoverThumb,
                          {
                            marginLeft: cIdx > 0 ? 8 : 0,
                            zIndex: cIdx + 1,
                          },
                        ]}
                        contentFit="cover"
                      />
                    ))}
                  </View>

                  <Text style={styles.listCardTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={styles.listCardCount}>{item.count}</Text>
                </View>
              ))}
            </ScrollView>

            {/* SEE ALL Button */}
            <TouchableOpacity style={styles.seeAllButton} activeOpacity={0.8}>
              <Text style={styles.seeAllButtonText}>SEE ALL</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* BOTTOM NAVIGATION BAR */}
      <View style={styles.bottomNavContainer}>
        {[
          { icon: "compass-outline", label: "Discover", key: "discover", route: "/search" },
          { icon: "bookmark-outline", label: "Saved", key: "saved", route: "/saved" },
        ].map((item) => (
          <TouchableOpacity
            key={item.key}
            style={styles.bottomNavItem}
            onPress={() => router.push(item.route as any)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={item.icon as any}
              size={22}
              color="#554438"
            />
            <Text style={styles.bottomNavLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#422515",
  },
  topAppBar: {
    backgroundColor: "#422515",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    zIndex: 10,
  },
  topAppTitleCol: {
    flex: 1,
    marginHorizontal: 12,
    alignItems: "center",
  },
  topAppTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
  topAppAuthor: {
    color: "#D7CCC8",
    fontSize: 11,
    textAlign: "center",
    marginTop: 1,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#ECE7DF",
  },
  carouselContainer: {
    backgroundColor: "#422515",
    paddingBottom: 16,
    position: "relative",
  },
  slidesWrapper: {
    height: 250,
  },
  slide: {
    height: 250,
    alignItems: "center",
    justifyContent: "center",
  },
  coverShadowBox: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 8,
  },
  bookCover: {
    width: 130,
    height: 195,
    borderRadius: 6,
  },
  textSlide: {
    paddingHorizontal: 32,
    justifyContent: "center",
  },
  editionText: {
    fontSize: 14,
    color: "#E8DDD2",
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 4,
  },
  publishedDateText: {
    fontSize: 13,
    color: "#D7CCC2",
    textAlign: "center",
    marginBottom: 2,
  },
  publisherText: {
    fontSize: 13,
    color: "#D7CCC2",
    textAlign: "center",
    marginBottom: 16,
  },
  outlinedButton: {
    borderWidth: 1,
    borderColor: "#D7CCC2",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 4,
    alignSelf: "center",
    marginTop: 8,
  },
  outlinedButtonText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  authorAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginBottom: 10,
    alignSelf: "center",
    borderWidth: 1.5,
    borderColor: "#E8DDD2",
  },
  authorBioText: {
    fontSize: 12,
    color: "#E8DDD2",
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    gap: 8,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  activeDot: {
    backgroundColor: "#FFFFFF",
  },
  inactiveDot: {
    backgroundColor: "rgba(255, 255, 255, 0.35)",
  },
  lowerSection: {
    backgroundColor: "#ECE7DF",
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 40,
    alignItems: "center",
  },
  titleText: {
    fontSize: 22,
    fontWeight: "800",
    color: "#281D17",
    textAlign: "center",
    fontFamily: "serif",
    lineHeight: 28,
  },
  seriesText: {
    fontSize: 14,
    color: "#7D6E63",
    marginTop: 3,
    textAlign: "center",
    fontFamily: "serif",
  },
  authorText: {
    fontSize: 13,
    color: "#5C4A3E",
    marginTop: 4,
    textAlign: "center",
    fontWeight: "500",
  },
  ratingSummaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    gap: 6,
    flexWrap: "wrap",
  },
  starsRow: {
    flexDirection: "row",
    gap: 2,
  },
  starIcon: {
    marginRight: 1,
  },
  ratingCountText: {
    fontSize: 11,
    color: "#7D6E63",
    fontWeight: "500",
  },
  shelfDropdownWrapper: {
    marginTop: 16,
    position: "relative",
    zIndex: 20,
    alignItems: "center",
  },
  wantToReadButton: {
    backgroundColor: "#1F6B38",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 22,
    width: 210,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  wantToReadText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  shelfMenu: {
    position: "absolute",
    top: 46,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    width: 210,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 30,
  },
  shelfMenuItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  shelfMenuText: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "500",
  },
  shelfMenuTextActive: {
    color: "#1F6B38",
    fontWeight: "700",
  },
  userRatingSection: {
    marginTop: 18,
    alignItems: "center",
  },
  interactiveStarsRow: {
    flexDirection: "row",
    gap: 8,
  },
  interactiveStarTouch: {
    padding: 4,
  },
  rateThisBookLabel: {
    fontSize: 12,
    color: "#7D6E63",
    marginTop: 4,
    fontWeight: "500",
  },
  labeledActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginTop: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#D8D0C5",
  },
  labeledActionItem: {
    alignItems: "center",
    flex: 1,
  },
  verticalActionDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#D8D0C5",
  },
  actionCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#8E887E",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  actionItemLabel: {
    fontSize: 11,
    color: "#6B5D52",
    fontWeight: "600",
    marginTop: 6,
  },
  contentSection: {
    width: "100%",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderColor: "#D8D0C5",
  },
  sectionHeaderCol: {
    alignItems: "center",
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    color: "#281D17",
  },
  headingUnderline: {
    width: 60,
    height: 2,
    backgroundColor: "#5C4A3E",
    marginTop: 4,
  },
  descriptionParagraph: {
    fontSize: 13,
    lineHeight: 20,
    color: "#3E2E25",
    textAlign: "left",
  },
  readMoreTouch: {
    marginTop: 6,
    alignSelf: "flex-end",
  },
  readMoreText: {
    fontSize: 12,
    color: "#281D17",
    fontWeight: "700",
  },
  reviewsHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  reviewsTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#281D17",
  },
  reviewsRatingSubRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 3,
  },
  ratingSubText: {
    fontSize: 11,
    color: "#7D6E63",
    fontWeight: "500",
  },
  breakdownContainer: {
    gap: 6,
    marginTop: 6,
  },
  breakdownRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  breakdownLabel: {
    fontSize: 11,
    color: "#6B5D52",
    width: 36,
  },
  barBackground: {
    flex: 1,
    height: 3,
    backgroundColor: "#DFD8CE",
    borderRadius: 2,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 2,
  },
  communityHeading: {
    fontSize: 13,
    fontWeight: "700",
    color: "#281D17",
    marginBottom: 14,
  },
  reviewCard: {
    marginBottom: 18,
  },
  reviewUserRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviewAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  reviewUserMeta: {
    flex: 1,
    marginLeft: 8,
  },
  reviewUserName: {
    fontSize: 12,
    fontWeight: "700",
    color: "#281D17",
  },
  reviewRatedText: {
    fontWeight: "400",
    color: "#6B5D52",
  },
  reviewTimestamp: {
    fontSize: 10,
    color: "#8D7E73",
    marginTop: 1,
  },
  reviewBody: {
    fontSize: 12,
    color: "#3E2E25",
    lineHeight: 18,
    marginTop: 8,
  },
  reviewFooterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  reviewActionText: {
    fontSize: 11,
    color: "#7D6E63",
    fontWeight: "500",
  },
  likeCommentCounts: {
    flexDirection: "row",
    alignItems: "center",
  },
  countNumberText: {
    fontSize: 11,
    color: "#7D6E63",
    marginLeft: 4,
    fontWeight: "600",
  },
  moreReviewsBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    marginTop: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#D8D0C5",
  },
  moreReviewsBarText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#281D17",
  },
  carouselSection: {
    width: "100%",
    paddingVertical: 18,
  },
  horizontalScrollRow: {
    gap: 14,
    paddingTop: 8,
    paddingBottom: 4,
  },
  smallBookCard: {
    width: 90,
  },
  smallBookCover: {
    width: 90,
    height: 130,
    borderRadius: 4,
  },
  smallBookTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#281D17",
    marginTop: 6,
    lineHeight: 14,
  },
  smallBookAuthor: {
    fontSize: 10,
    color: "#7D6E63",
    marginTop: 2,
  },
  genresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
  },
  genrePill: {
    backgroundColor: "#C2D9CD",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  genrePillText: {
    fontSize: 12,
    color: "#2D4438",
    fontWeight: "600",
  },
  listCard: {
    backgroundColor: "#DCD5CA",
    borderRadius: 14,
    padding: 12,
    width: 175,
  },
  listCoversWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 105,
    marginBottom: 8,
  },
  listCoverThumb: {
    width: 65,
    height: 98,
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  listCardTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#281D17",
    lineHeight: 16,
  },
  listCardCount: {
    fontSize: 11,
    color: "#7D6E63",
    marginTop: 3,
  },
  seeAllButton: {
    borderWidth: 1.5,
    borderColor: "#3E2E25",
    paddingVertical: 10,
    paddingHorizontal: 40,
    alignSelf: "center",
    marginTop: 20,
    borderRadius: 2,
  },
  seeAllButtonText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#281D17",
    letterSpacing: 1,
  },
  bottomNavContainer: {
    flexDirection: "row",
    backgroundColor: "#DFD9CF",
    borderTopWidth: 1,
    borderTopColor: "#D1C9BD",
    paddingVertical: 8,
    paddingHorizontal: 12,
    justifyContent: "space-around",
    alignItems: "center",
  },
  bottomNavItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
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
