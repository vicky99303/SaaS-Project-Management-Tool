<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
})

const route = useRoute()
const projectId = String(route.params.id)
const headers = process.server ? useRequestHeaders(['cookie']) : undefined

const { data, error } = await useFetch(`/api/projects/${projectId}`, {
  headers,
  credentials: 'include',
})

if (error.value?.statusCode === 401) {
  await navigateTo('/login')
}

const project = computed(() => data.value?.data || null)

const form = reactive({
  name: '',
  description: '',
  status: 'ACTIVE',
})

watch(
  () => data.value?.data,
  (project) => {
    if (project) {
      form.name = project.name || ''
      form.description = project.description || ''
      form.status = project.status || 'ACTIVE'
    }
  },
  { immediate: true }
)

const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const submit = async () => {
  loading.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    await $fetch(`/api/projects/${projectId}`, {
      method: 'PUT',
      body: {
        name: form.name,
        description: form.description,
        status: form.status,
      },
      credentials: 'include',
    })

    successMessage.value = 'Project updated successfully'

    setTimeout(() => {
      navigateTo(`/dashboard/projects/${projectId}`)
    }, 700)
  } catch (err: any) {
    errorMessage.value =
      err?.data?.statusMessage ||
      err?.data?.message ||
      err?.message ||
      'Update failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="rounded-2xl bg-white p-6 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-slate-900">Edit Project</h1>
          <p class="mt-2 text-slate-500">
            {{ form.name || 'Loading...' }}
          </p>
        </div>

        <NuxtLink
          :to="`/dashboard/projects/${projectId}`"
          class="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
        >
          Back
        </NuxtLink>
      </div>
    </div>

    <div class="rounded-2xl bg-white p-6 shadow-sm">
      <div v-if="!project && !error" class="text-slate-500">
        Loading project...
      </div>

      <div
        v-else-if="error"
        class="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700"
      >
        Failed to load project.
      </div>

      <form v-else class="space-y-4" @submit.prevent="submit">
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">
            Project Name
          </label>
          <input
            v-model="form.name"
            type="text"
            class="w-full rounded-lg border border-slate-300 px-3 py-2"
            placeholder="Enter project name"
          />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            v-model="form.description"
            rows="5"
            class="w-full rounded-lg border border-slate-300 px-3 py-2"
            placeholder="Enter project description"
          />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">
            Status
          </label>
          <select
            v-model="form.status"
            class="w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            <option value="ACTIVE">Active</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        <p v-if="successMessage" class="text-sm text-green-600">
          {{ successMessage }}
        </p>

        <p v-if="errorMessage" class="text-sm text-red-600">
          {{ errorMessage }}
        </p>

        <div class="flex gap-3">
          <button
            type="submit"
            :disabled="loading"
            class="rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {{ loading ? 'Saving...' : 'Save Changes' }}
          </button>

          <NuxtLink
            :to="`/dashboard/projects/${projectId}`"
            class="rounded-lg border border-slate-300 px-4 py-2 hover:bg-slate-50"
          >
            Cancel
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
  <NuxtPage />
</template>