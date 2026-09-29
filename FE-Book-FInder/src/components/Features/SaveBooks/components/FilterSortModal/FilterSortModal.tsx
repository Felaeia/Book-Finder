import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { SortOption } from "../../lib/types";
import { Colors } from "@/src/theme/colors";

export interface FilterSortModalProps {
  visible: boolean;
  onClose: () => void;
  currentSort: SortOption;
  onSelectSort: (sort: SortOption) => void;
}

const SORT_OPTIONS: { key: SortOption; label: string; icon: string }[] = [
  { key: "recent", label: "Recently Added", icon: "🕒" },
  { key: "title", label: "Title (A - Z)", icon: "🔤" },
  { key: "author", label: "Author (A - Z)", icon: "✍️" },
  { key: "rating", label: "Highest Rating", icon: "⭐" },
  { key: "progress", label: "Reading Progress", icon: "📊" },
];

export function FilterSortModal({
  visible,
  onClose,
  currentSort,
  onSelectSort,
}: FilterSortModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <View style={styles.header}>
                <Text style={styles.title}>Sort & Organize</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.optionsList}>
                {SORT_OPTIONS.map((option) => {
                  const isSelected = currentSort === option.key;
                  return (
                    <TouchableOpacity
                      key={option.key}
                      style={[styles.optionItem, isSelected && styles.selectedOptionItem]}
                      onPress={() => {
                        onSelectSort(option.key);
                        onClose();
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={styles.optionLeft}>
                        <Text style={styles.optionIcon}>{option.icon}</Text>
                        <Text
                          style={[
                            styles.optionLabel,
                            isSelected && styles.selectedOptionLabel,
                          ]}
                        >
                          {option.label}
                        </Text>
                      </View>
                      {isSelected && <Text style={styles.checkmark}>✓</Text>}
                    </TouchableOpacity>
                  );
                })}
              </View>
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
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
  },
  closeBtn: {
    padding: 6,
  },
  closeText: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: "700",
  },
  optionsList: {
    gap: 8,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "transparent",
  },
  selectedOptionItem: {
    backgroundColor: Colors.primaryLight,
    borderColor: "#BFDBFE",
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  optionIcon: {
    fontSize: 16,
  },
  optionLabel: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: "500",
  },
  selectedOptionLabel: {
    color: Colors.primary,
    fontWeight: "700",
  },
  checkmark: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: "700",
  },
});
