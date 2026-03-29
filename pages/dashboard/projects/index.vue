<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
})

const headers = process.server ? useRequestHeaders(['cookie']) : undefined

const { data: meData, error: meError } = await useFetch('/api/auth/me', {
  headers,
  credentials: 'include',
})

if (meError.value) {
  await navigateTo('/login')
}

const workspaces = computed(() => meData.value?.data?.workspaces || [])

const { projects, fetchProjects, createProject } = useProjects()

await fetchProjects()

const showCreateForm = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const form = reactive({
  workspaceId: '',
  name: '',
  description: '',
})

watch(
  workspaces,
  (value) => {
    if (value.length && !form.workspaceId) {
      form.workspaceId = value[0].id
    }
  },
  { immediate: true }
)

const submitProject = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  loading.value = true

  try {
    await createProject({
      workspaceId: form.workspaceId,
      name: form.name,
      description: form.description,
    })

    successMessage.value = 'Project created successfully.'
    form.name = ''
    form.description = ''
    showCreateForm.value = false
  } catch (error: any) {
    errorMessage.value =
      error?.data?.statusMessage ||
      error?.message ||
      'Failed to create project'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Projects</h1>
        <p class="mt-1 text-slate-500">
          Manage all workspace projects from one place.
        </p>
      </div>

      <button
        class="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        @click="showCreateForm = !showCreateForm"
      >
        {{ showCreateForm ? 'Close Form' : '+ Create Project' }}
      </button>
    </div>

    <div v-if="showCreateForm" class="rounded-2xl bg-white p-6 shadow-sm">
      <h2 class="text-xl font-semibold text-slate-900">Create New Project</h2>
      <p class="mt-1 text-sm text-slate-500">
        Add a new project to your workspace.
      </p>

      <form class="mt-6 space-y-4" @submit.prevent="submitProject">
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">Workspace</label>
          <select
            v-model="form.workspaceId"
            class="w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            <option value="" disabled>Select workspace</option>
            <option
              v-for="workspace in workspaces"
              :key="workspace.id"
              :value="workspace.id"
            >
              {{ workspace.name }} ({{ workspace.role }})
            </option>
          </select>
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">Project Name</label>
          <input
            v-model="form.name"
            type="text"
            class="w-full rounded-lg border border-slate-300 px-3 py-2"
            placeholder="Enter project name"
          />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">Description</label>
          <textarea
            v-model="form.description"
            rows="4"
            class="w-full rounded-lg border border-slate-300 px-3 py-2"
            placeholder="Enter project description"
          />
        </div>

        <p v-if="errorMessage" class="text-sm text-red-600">
          {{ errorMessage }}
        </p>

        <p v-if="successMessage" class="text-sm text-green-600">
          {{ successMessage }}
        </p>

        <button
          type="submit"
          :disabled="loading"
          class="rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {{ loading ? 'Creating...' : 'Create Project' }}
        </button>
      </form>
    </div>

    <div class="rounded-2xl bg-white p-6 shadow-sm">
      <div class="mb-4 flex items-center justify-between">
        <div>
          <h2 class="text-xl font-semibold text-slate-900">Project List</h2>
          <p class="mt-1 text-sm text-slate-500">
            All projects from your accessible workspaces.
          </p>
        </div>
      </div>

      <div v-if="projects.length" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div
          v-for="project in projects"
          :key="project.id"
          class="rounded-2xl border border-slate-200 bg-slate-50 p-5"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <h3 class="text-lg font-semibold text-slate-900">
                {{ project.name }}
              </h3>
              <p class="mt-1 text-sm text-slate-500">
                Workspace: {{ project.workspace?.name || 'N/A' }}
              </p>
            </div>

            <span class="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
              {{ project.status }}
            </span>
          </div>

          <p class="mt-4 line-clamp-3 text-sm text-slate-600">
            {{ project.description || 'No description added yet.' }}
          </p>

          <div class="mt-5 flex items-center justify-between">
            <p class="text-xs text-slate-400">
              {{ new Date(project.createdAt).toLocaleDateString() }}
            </p>

            <div class="flex gap-2">
              <button class="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-white">
                View
              </button>
              <button class="rounded-lg bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-800">
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="rounded-xl border border-dashed border-slate-300 p-10 text-center">
        <p class="text-slate-500">No projects found. Create your first one.</p>
      </div>
    </div>
  </div>
</template>