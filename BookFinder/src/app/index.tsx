import { StyleSheet, View } from 'react-native';

export default function App() {
  return (
    <view style={styles.container}> 
      <view style={styles.card}>

      </view>
    </view>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  backgroundColor: '#f8eeee',
  justifyContent: 'center',
  alignItems: 'center',
  },
  card: {
    width: 300,
    height: 200,
    backgroundColor: '#fff',
  },
});