import { PlusCircle } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'

import styles from './App.module.css'

import { Button } from './components/Button'
import { Header } from './components/Header'
import { Input } from './components/Input'
import { Empty } from './components/List/Empty'
import { Header as ListHeader } from './components/List/Header'
import { Item } from './components/List/Item'
import { api } from './libs/axios'

export interface ITask {
  id: number
  todo: string
  isChecked: boolean
}



export function App() {
  const [tasks, setTasks] = useState<ITask[]>([])
  const [loading, setLoading] = useState<Boolean>(false)
  const [inputValue, setInputValue] = useState('')

  const checkedTasksCounter = tasks.reduce((prevValue, currentTask) => {
    if (currentTask.isChecked) {
      return prevValue + 1
    }

    return prevValue
  }, 0)

  async function getTodos() {
    await api.get('/todos').then(response => {
      console.log(response)
      setTasks(response.data.todos)
    }).catch(error => { console.log(error) })
  }


  function handleAddTask() {
    if (!inputValue) {
      return
    }

    const newTask: ITask = {
      id: new Date().getTime(),
      todo: inputValue,
      isChecked: false,
    }

    setTasks((state) => [...state, newTask])
    setInputValue('')
  }

  function handleRemoveTask(id: number) {
    setLoading(true)

    const filteredTasks = tasks.filter((task) => task.id !== id)

    setTimeout(() => {
      setLoading(false)
      setTasks(filteredTasks)
    }, 1000)

  }

  function handleToggleTask({ id, value }: { id: number; value: boolean }) {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, isChecked: value }
      }

      return { ...task }
    })

    setTasks(updatedTasks)
  }

  useEffect(() => {
    getTodos()
  }, [])

  return (
    <main>
      {loading && (
        <div className={styles.overlay}>
          <h2>Carregando...</h2>
        </div>
      )}

      <Header />
      <section className={styles.content}>


        <div className={styles.taskInfoContainer}>
          <Input
            onChange={(e) => setInputValue(e.target.value)}
            value={inputValue}
          />
          <Button onClick={handleAddTask}>
            Criar
            <PlusCircle size={16} color="#f2f2f2" weight="bold" />
          </Button>
        </div>

        <div className={styles.tasksList}>
          <ListHeader
            tasksCounter={tasks.length}
            checkedTasksCounter={checkedTasksCounter}
          />

          {tasks.length > 0 ? (
            <div>
              {tasks.map((task) => (
                <Item
                  key={task.id}
                  data={task}
                  removeTask={handleRemoveTask}
                  toggleTaskStatus={handleToggleTask}
                />
              ))}
            </div>
          ) : (
            <Empty />
          )}
        </div>
      </section>
    </main>
  )
}
