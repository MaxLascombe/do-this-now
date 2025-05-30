import { useRoute } from '@react-navigation/native'
import { StyleSheet, Text, View } from 'react-native'

const UpdateTaskScreen = () => {
  const route = useRoute()
  const { taskTitle } = route.params as { taskTitle: string }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Update Task: {taskTitle}</Text>
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

export default UpdateTaskScreen
