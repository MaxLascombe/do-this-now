import { StyleSheet, Text, View } from 'react-native'

const HistoryScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>History Screen</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  text: {
    color: '#fff',
    fontSize: 20,
  },
})

export default HistoryScreen
