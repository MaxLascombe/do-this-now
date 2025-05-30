import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Amplify } from 'aws-amplify'
import awsconfig from './aws-exports'

// Initialize Amplify
Amplify.configure(awsconfig)

// Create a client for React Query
const queryClient = new QueryClient()

// Create navigators
const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

// Placeholder screens - we'll create these next
const HomeScreen = () => null
const LoginScreen = () => null
const NewTaskScreen = () => null
const TasksScreen = () => null
const UpdateTaskScreen = () => null
const HistoryScreen = () => null

// Main tab navigator
const MainTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name='Home' component={HomeScreen} />
      <Tab.Screen name='Tasks' component={TasksScreen} />
      <Tab.Screen name='History' component={HistoryScreen} />
    </Tab.Navigator>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name='Login'
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='Main'
            component={MainTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='NewTask'
            component={NewTaskScreen}
            options={{ title: 'New Task' }}
          />
          <Stack.Screen
            name='UpdateTask'
            component={UpdateTaskScreen}
            options={{ title: 'Update Task' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  )
}
