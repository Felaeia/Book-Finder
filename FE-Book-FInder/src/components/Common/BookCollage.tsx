import { View, Image, StyleSheet, ViewStyle } from "react-native";

type BookEntry = {
  id: number;
  uri: string;
  style: {
    top: ViewStyle["top"];
    left: ViewStyle["left"];
    width: number;
    height: number;
    rotate: `${number}deg`;
    zIndex: number;
  };
};

const BOOKS: BookEntry[] = [
  {
    //Top left
    id: 1,
    uri: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200",
    style: { top: "0%", left: "2%", width: 90, height: 135, rotate: "0deg", zIndex: 1 },
  },
  {
    //Top mid
    id: 2,
    uri: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200",
    style: { top: "10%", left: "30%", width: 105, height: 155, rotate: "0deg", zIndex: 2 },
  },
  {
    //Top right
    id: 3,
    uri: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=200",
    style: { top: "0%", left: "68%", width: 90, height: 135, rotate: "0deg", zIndex: 1 },
  },
  {
    // Middle left
    id: 4,
    uri: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=200",
    style: { top: "26%", left: "5%", width: 95, height: 140, rotate: "0deg", zIndex: 3 },
  },
  {
    // Middle mid
    id: 5,
    uri: "https://images.unsplash.com/photo-1618666012174-83b56e2fcb05?w=200",
    style: { top: "32%", left: "28%", width: 110, height: 160, rotate: "0deg", zIndex: 4 },
  },
  {
    //Middle right
    id: 6,
    uri: "https://images.unsplash.com/photo-1555448248-2571daf6344b?w=200",
    style: { top: "34%", left: "68%", width: 90, height: 135, rotate: "0deg", zIndex: 3 },
  },
  {
    //Bottom left
    id: 7,
    uri: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=200",
    style: { top: "54%", left: "-5%", width: 95, height: 140, rotate: "0deg", zIndex: 5 },
  },
  {
    //Bottom mid
    id: 8,
    uri: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=200",
    style: { top: "58%", left: "26%", width: 115, height: 165, rotate: "0deg", zIndex: 6 },
  },
  {
    //Bottom right
    id: 9,
    uri: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200",
    style: { top: "56%", left: "68%", width: 95, height: 140, rotate: "0deg", zIndex: 4 },
  },
];

export default function BookCollage() {
  return (
    <View style={styles.collageContainer}>
      {BOOKS.map((book) => (
        <Image
          key={book.id}
          source={{ uri: book.uri }}
          style={[
            styles.bookImage,
            {
              top: book.style.top,
              left: book.style.left,
              width: book.style.width,
              height: book.style.height,
              transform: [{ rotate: book.style.rotate }],
              zIndex: book.style.zIndex,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  collageContainer: {
    width: "100%",
    height: "65%",
    position: "relative",
    marginTop: 20,
  },
  bookImage: {
    position: "absolute",
    borderRadius: 8,
    resizeMode: "cover",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});