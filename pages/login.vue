<script setup lang="ts">
const form = reactive({
  email: '',
  password: '',
})

const loading = ref(false)
const errorMessage = ref('')

const submitForm = async () => {
  errorMessage.value = ''
  loading.value = true

  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: form.email,
        password: form.password,
      },
      credentials: 'include',
    })

    window.location.href = '/dashboard'
  } catch (error: any) {
    errorMessage.value =
      error?.data?.statusMessage ||
      error?.data?.message ||
      error?.message ||
      'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
      <h1 class="text-2xl font-bold text-gray-900">Login</h1>

      <form class="mt-6 space-y-4" @submit.prevent="submitForm">
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">Email</label>
          <input
            v-model="form.email"
            type="email"
            class="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">Password</label>
          <input
            v-model="form.password"
            type="password"
            class="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>

        <p v-if="errorMessage" class="text-sm text-red-600">
          {{ errorMessage }}
        </p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full rounded-lg bg-black py-2 text-white"
        >
          {{ loading ? 'Signing in...' : 'Login' }}
        </button>
      </form>
      <p class="mt-4 text-sm text-slate-600">
        Don’t have an account?
        <NuxtLink to="/register" class="font-medium text-slate-900 underline">
          Register
        </NuxtLink>
      </p>
    </div>
  </div>
</template>