import { StyleSheet, Text, View } from 'react-native'

const NewTaskScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>New Task Screen</Text>
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

export default NewTaskScreen
