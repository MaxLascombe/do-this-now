import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { useQuerySnoozeTask } from '../hooks/useQuerySnoozeTask'
import { useQueryTaskDelete } from '../hooks/useQueryTaskDelete'
import { useQueryTaskDone } from '../hooks/useQueryTaskDone'
import { useQueryTasksTop } from '../hooks/useQueryTasksTop'
import { Task } from '../shared-logic/task'
import { isSnoozed } from '../shared-logic/task-sorting'

type RootStackParamList = {
  Home: undefined
  Tasks: undefined
  NewTask: undefined
  History: undefined
  UpdateTask: { taskTitle: string }
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>()
  const queryClient = useQueryClient()
  const [selectedTaskIndex, setSelectedTaskIndex] = useState<0 | 1 | 2>(0)

  const topTasksQuery = useQueryTasksTop()
  const tasks = (topTasksQuery.data ?? []).filter(t => !isSnoozed(t))
  const selectedTask = !tasks
    ? null
    : tasks.length > selectedTaskIndex
    ? tasks[selectedTaskIndex]
    : tasks[-1]

  if (tasks && tasks.length > 0 && tasks.length <= selectedTaskIndex) {
    setSelectedTaskIndex(tasks.length === 2 ? 1 : 0)
  }

  const doneMutation = useQueryTaskDone()
  const deleteMutation = useQueryTaskDelete()
  const snoozeMutation = useQuerySnoozeTask()

  const completeTask = () => {
    if (!selectedTask) return
    doneMutation.mutate(selectedTask)
  }

  const snoozeTask = () => {
    if (!selectedTask) return
    snoozeMutation.mutate({ task: selectedTask })
  }

  const snoozeAllSubtasks = () => {
    if (!selectedTask) return
    snoozeMutation.mutate({ task: selectedTask, allSubtasks: true })
  }

  const deleteTask = () => {
    if (!selectedTask) return
    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete '${selectedTask.title}'?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteMutation.mutate(selectedTask),
        },
      ]
    )
  }

  const updateTask = () => {
    if (!selectedTask) return
    queryClient.setQueryData(['tasks', 'get', selectedTask.title], selectedTask)
    navigation.navigate('UpdateTask', { taskTitle: selectedTask.title })
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate('Tasks')}>
          <Text style={styles.headerButtonText}>All Tasks</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate('NewTask')}>
          <Text style={styles.headerButtonText}>New Task</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate('History')}>
          <Text style={styles.headerButtonText}>History</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.taskList}>
        {tasks.slice(0, 3).map((task: Task, i: number) => (
          <TouchableOpacity
            key={task.title}
            style={[
              styles.taskItem,
              selectedTaskIndex === i && styles.selectedTask,
            ]}
            onPress={() => setSelectedTaskIndex(i as 0 | 1 | 2)}>
            <Text style={styles.taskTitle}>{task.title}</Text>
            {task.subtasks.length > 0 && (
              <Text style={styles.subtaskCount}>
                {task.subtasks.length} subtasks
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedTask && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.completeButton]}
            onPress={completeTask}>
            <Text style={styles.actionButtonText}>Complete</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.snoozeButton]}
            onPress={snoozeTask}>
            <Text style={styles.actionButtonText}>Snooze</Text>
          </TouchableOpacity>
          {selectedTask.subtasks.length > 0 && (
            <TouchableOpacity
              style={[styles.actionButton, styles.snoozeButton]}
              onPress={snoozeAllSubtasks}>
              <Text style={styles.actionButtonText}>Snooze All</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.actionButton, styles.updateButton]}
            onPress={updateTask}>
            <Text style={styles.actionButtonText}>Update</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={deleteTask}>
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#1a1a1a',
  },
  headerButton: {
    padding: 10,
  },
  headerButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  taskList: {
    flex: 1,
    padding: 10,
  },
  taskItem: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedTask: {
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  taskTitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 5,
  },
  subtaskCount: {
    color: '#666',
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#1a1a1a',
  },
  actionButton: {
    padding: 10,
    borderRadius: 5,
    margin: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  completeButton: {
    backgroundColor: '#34C759',
  },
  snoozeButton: {
    backgroundColor: '#FF9500',
  },
  updateButton: {
    backgroundColor: '#007AFF',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
})

export default HomeScreen
