<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
})

const route = useRoute()
const projectId = String(route.params.id)
const headers = process.server ? useRequestHeaders(['cookie']) : undefined

const { data, error, refresh } = await useFetch(`/api/projects/${projectId}`, {
  headers,
  credentials: 'include',
})

if (error.value?.statusCode === 401) {
  await navigateTo('/login')
}

const project = computed(() => data.value?.data || null)

const { groupedTasks, fetchTasks, createTask } = useTasks()

await fetchTasks(projectId)

const showTaskForm = ref(false)
const loading = ref(false)
const taskError = ref('')
const taskSuccess = ref('')

const taskForm = reactive({
  title: '',
  description: '',
  status: 'TODO' as 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE',
  priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH',
  dueDate: '',
})

const submitTask = async () => {
  taskError.value = ''
  taskSuccess.value = ''
  loading.value = true

  try {
    await createTask({
      projectId,
      title: taskForm.title,
      description: taskForm.description,
      status: taskForm.status,
      priority: taskForm.priority,
      dueDate: taskForm.dueDate || undefined,
    })

    taskSuccess.value = 'Task created successfully.'

    Object.assign(taskForm, {
      title: '',
      description: '',
      status: 'TODO',
      priority: 'MEDIUM',
      dueDate: '',
    })

    showTaskForm.value = false
  } catch (err: any) {
    taskError.value =
      err?.data?.statusMessage ||
      err?.data?.message ||
      err?.message ||
      'Failed to create task'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <NuxtPage />
  <div class="space-y-6">
    <div class="bg-white p-6 rounded-2xl shadow-sm flex justify-between">
      <div>
        <h1 class="text-3xl font-bold">
          {{ project?.name }}
        </h1>
        <p class="text-slate-500 mt-2">
          {{ project?.description || 'No description' }}
        </p>
      </div>

      <div class="flex gap-2">
        <button
          @click="refresh"
          class="border px-4 py-2 rounded-lg"
        >
          Refresh
        </button>

       <NuxtLink
        :to="`/dashboard/projects/${project?.id}-edit`"
        class="bg-slate-900 text-white px-4 py-2 rounded-lg"
      >
        Edit Project
      </NuxtLink>
      </div>
    </div>

    <div class="bg-white p-6 rounded-2xl shadow-sm">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold">Tasks</h2>

        <button
          @click="showTaskForm = !showTaskForm"
          class="bg-slate-900 text-white px-4 py-2 rounded-lg"
        >
          + Add Task
        </button>
      </div>

      <form v-if="showTaskForm" @submit.prevent="submitTask" class="mt-4 space-y-3">
        <input v-model="taskForm.title" placeholder="Title" class="w-full border px-3 py-2 rounded-lg" />
        <textarea v-model="taskForm.description" placeholder="Description" class="w-full border px-3 py-2 rounded-lg" />

        <div class="grid grid-cols-3 gap-3">
          <select v-model="taskForm.status" class="border px-2 py-2 rounded-lg">
            <option value="TODO">Todo</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="REVIEW">Review</option>
            <option value="DONE">Done</option>
          </select>

          <select v-model="taskForm.priority" class="border px-2 py-2 rounded-lg">
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>

          <input type="date" v-model="taskForm.dueDate" class="border px-2 py-2 rounded-lg" />
        </div>

        <p class="text-red-600 text-sm" v-if="taskError">{{ taskError }}</p>
        <p class="text-green-600 text-sm" v-if="taskSuccess">{{ taskSuccess }}</p>

        <button class="bg-slate-900 text-white px-4 py-2 rounded-lg">
          Create Task
        </button>
      </form>

      <div class="grid grid-cols-4 gap-4 mt-6">
        <div v-for="(tasks, key) in groupedTasks" :key="key" class="bg-slate-50 p-4 rounded-xl">
          <h3 class="font-semibold mb-3">{{ key }}</h3>

          <div v-for="task in tasks" :key="task.id" class="bg-white p-3 rounded-lg border mb-2">
            <p class="font-medium">{{ task.title }}</p>
            <p class="text-sm text-gray-500">{{ task.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>