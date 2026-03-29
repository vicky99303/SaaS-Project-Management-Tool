type Task = {
    id: string
    projectId: string
    title: string
    description?: string | null
    status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'
    priority: 'LOW' | 'MEDIUM' | 'HIGH'
    dueDate?: string | null
    createdAt: string
    updatedAt: string
}

export const useTasks = () => {
    const tasks = useState<Task[]>('tasks', () => [])

    const fetchTasks = async (projectId: string) => {
        const headers = process.server ? useRequestHeaders(['cookie']) : undefined

        const response = await $fetch<{
            success: boolean
            data: Task[]
        }>(`/api/tasks?projectId=${projectId}`, {
            headers,
            credentials: 'include',
        })

        tasks.value = response.data
        return response.data
    }

    const createTask = async (payload: {
        projectId: string
        title: string
        description?: string
        status?: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'
        priority?: 'LOW' | 'MEDIUM' | 'HIGH'
        dueDate?: string
    }) => {
        const response = await $fetch<{
            success: boolean
            data: Task
        }>('/api/tasks', {
            method: 'POST',
            body: payload,
            credentials: 'include',
        })

        await fetchTasks(payload.projectId)
        return response.data
    }

    const groupedTasks = computed(() => ({
        TODO: tasks.value.filter((task) => task.status === 'TODO'),
        IN_PROGRESS: tasks.value.filter((task) => task.status === 'IN_PROGRESS'),
        REVIEW: tasks.value.filter((task) => task.status === 'REVIEW'),
        DONE: tasks.value.filter((task) => task.status === 'DONE'),
    }))

    return {
        tasks,
        groupedTasks,
        fetchTasks,
        createTask,
    }
}