import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import { Book, ShelfType } from "../../lib/types";
import { Colors } from "@/src/theme/colors";
import { ProgressBar } from "@/src/components/Global/ProgressBar";

export interface ProgressModalProps {
  book: Book | null;
  visible: boolean;
  onClose: () => void;
  onUpdateShelf: (bookId: string, newShelf: Exclude<ShelfType, "all">) => void;
  onUpdateProgress: (bookId: string, page: number) => void;
  onUpdateRating: (bookId: string, rating: number) => void;
  onToggleFavorite: (bookId: string) => void;
  onRemoveBook: (bookId: string) => void;
}

const SHELVES: { key: Exclude<ShelfType, "all">; label: string; icon: string }[] = [
  { key: "reading", label: "Reading", icon: "📖" },
  { key: "want_to_read", label: "Want to Read", icon: "🔖" },
  { key: "completed", label: "Completed", icon: "✅" },
];

export function ProgressModal({
  book,
  visible,
  onClose,
  onUpdateShelf,
  onUpdateProgress,
  onUpdateRating,
  onToggleFavorite,
  onRemoveBook,
}: ProgressModalProps) {
  const [pageInput, setPageInput] = useState<string>("0");

  useEffect(() => {
    if (book) {
      setPageInput(book.currentPage.toString());
    }
  }, [book]);

  if (!book) return null;

  const handleSavePage = () => {
    const pageNum = parseInt(pageInput, 10);
    if (!isNaN(pageNum)) {
      onUpdateProgress(book.id, pageNum);
    }
  };

  const handleQuickPageStep = (delta: number) => {
    const current = parseInt(pageInput, 10) || 0;
    const next = Math.max(0, Math.min(book.totalPages, current + delta));
    setPageInput(next.toString());
    onUpdateProgress(book.id, next);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <View style={styles.handleBar} />

              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Book Header */}
                <View style={styles.bookHeader}>
                  <Image
                    source={{ uri: book.coverUrl }}
                    style={styles.coverImage}
                    contentFit="cover"
                  />
                  <View style={styles.headerInfo}>
                    <Text style={styles.title} numberOfLines={2}>
                      {book.title}
                    </Text>
                    <Text style={styles.author}>{book.author}</Text>
                    <View style={styles.genreBadge}>
                      <Text style={styles.genreText}>{book.genre}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.favoriteToggle}
                      onPress={() => onToggleFavorite(book.id)}
                    >
                      <Text style={styles.favoriteToggleText}>
                        {book.isFavorite ? "❤️ In Favorites" : "🤍 Add to Favorites"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Shelf Selection */}
                <Text style={styles.sectionTitle}>Shelf Status</Text>
                <View style={styles.shelfSelectorRow}>
                  {SHELVES.map((shelf) => {
                    const isSelected = book.shelf === shelf.key;
                    return (
                      <TouchableOpacity
                        key={shelf.key}
                        style={[
                          styles.shelfOption,
                          isSelected && styles.shelfOptionSelected,
                        ]}
                        onPress={() => onUpdateShelf(book.id, shelf.key)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.shelfIcon}>{shelf.icon}</Text>
                        <Text
                          style={[
                            styles.shelfLabel,
                            isSelected && styles.shelfLabelSelected,
                          ]}
                        >
                          {shelf.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Progress Tracking (especially for Reading or any shelf) */}
                <Text style={styles.sectionTitle}>Reading Progress</Text>
                <View style={styles.progressBox}>
                  <ProgressBar
                    current={parseInt(pageInput, 10) || 0}
                    total={book.totalPages}
                    showText
                    color={Colors.primary}
                    height={8}
                  />

                  <View style={styles.pageInputRow}>
                    <TouchableOpacity
                      style={styles.stepBtn}
                      onPress={() => handleQuickPageStep(-10)}
                    >
                      <Text style={styles.stepBtnText}>-10</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.stepBtn}
                      onPress={() => handleQuickPageStep(-1)}
                    >
                      <Text style={styles.stepBtnText}>-1</Text>
                    </TouchableOpacity>

                    <View style={styles.inputWrapper}>
                      <TextInput
                        style={styles.pageInput}
                        keyboardType="number-pad"
                        value={pageInput}
                        onChangeText={setPageInput}
                        onBlur={handleSavePage}
                        selectTextOnFocus
                      />
                      <Text style={styles.totalPagesText}>/ {book.totalPages} p.</Text>
                    </View>

                    <TouchableOpacity
                      style={styles.stepBtn}
                      onPress={() => handleQuickPageStep(1)}
                    >
                      <Text style={styles.stepBtnText}>+1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.stepBtn}
                      onPress={() => handleQuickPageStep(10)}
                    >
                      <Text style={styles.stepBtnText}>+10</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Rating */}
                <Text style={styles.sectionTitle}>Your Rating</Text>
                <View style={styles.ratingRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => onUpdateRating(book.id, star === book.rating ? 0 : star)}
                      style={styles.starBtn}
                    >
                      <Text style={[styles.starIcon, book.rating >= star && styles.starActive]}>
                        ★
                      </Text>
                    </TouchableOpacity>
                  ))}
                  <Text style={styles.ratingLabel}>
                    {book.rating > 0 ? `${book.rating} of 5 Stars` : "Not rated yet"}
                  </Text>
                </View>

                {/* Danger Zone: Remove */}
                <View style={styles.dangerZone}>
                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() => {
                      onRemoveBook(book.id);
                      onClose();
                    }}
                  >
                    <Text style={styles.removeBtnText}>🗑️ Remove from Library</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 36,
    maxHeight: "85%",
  },
  handleBar: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#CBD5E1",
    alignSelf: "center",
    marginBottom: 16,
  },
  bookHeader: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 20,
  },
  coverImage: {
    width: 80,
    height: 120,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
  },
  headerInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    lineHeight: 22,
  },
  author: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: "500",
    marginTop: 2,
  },
  genreBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 4,
  },
  genreText: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "600",
  },
  favoriteToggle: {
    alignSelf: "flex-start",
    marginTop: 6,
  },
  favoriteToggleText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.text,
    marginTop: 14,
    marginBottom: 8,
  },
  shelfSelectorRow: {
    flexDirection: "row",
    gap: 8,
  },
  shelfOption: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: "#F8FAFC",
  },
  shelfOptionSelected: {
    backgroundColor: Colors.primaryLight,
    borderColor: "#BFDBFE",
  },
  shelfIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  shelfLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  shelfLabelSelected: {
    color: Colors.primary,
    fontWeight: "700",
  },
  progressBox: {
    backgroundColor: "#F8FAFC",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pageInputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 14,
  },
  stepBtn: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  stepBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.text,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    minWidth: 110,
    justifyContent: "center",
  },
  pageInput: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.text,
    textAlign: "right",
    padding: 0,
    minWidth: 35,
  },
  totalPagesText: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
  },
  starBtn: {
    padding: 4,
  },
  starIcon: {
    fontSize: 28,
    color: "#CBD5E1",
  },
  starActive: {
    color: Colors.star,
  },
  ratingLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginLeft: 8,
    fontWeight: "500",
  },
  dangerZone: {
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 16,
    alignItems: "center",
  },
  removeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  removeBtnText: {
    fontSize: 13,
    color: Colors.danger,
    fontWeight: "600",
  },
});
