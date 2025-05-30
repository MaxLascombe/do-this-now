import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useState } from 'react'
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { handleSignIn } from '../../helpers/auth'

type RootStackParamList = {
  Login: undefined
  Main: undefined
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>

const LoginScreen = () => {
  const [password, setPassword] = useState('')
  const navigation = useNavigation<NavigationProp>()

  const login = async () => {
    try {
      const result = await handleSignIn(password)
      if (
        typeof result === 'object' &&
        result &&
        'challengeName' in result &&
        result.challengeName === 'NEW_PASSWORD_REQUIRED'
      ) {
        throw new Error('New password required')
      } else {
        navigation.navigate('Main')
      }
    } catch (error) {
      Alert.alert('Error', error.message)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder='Password'
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          onSubmitEditing={login}
          returnKeyType='done'
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={login}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#000',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
})

export default LoginScreen
