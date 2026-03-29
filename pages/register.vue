<script setup lang="ts">
const { register } = useAuth()

const form = reactive({
  name: '',
  email: '',
  password: '',
  workspaceName: '',
})

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const submitForm = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  loading.value = true

  try {
    await register({
      name: form.name,
      email: form.email,
      password: form.password,
      workspaceName: form.workspaceName,
    })

    successMessage.value = 'Account created successfully! Redirecting...'

    setTimeout(() => {
      navigateTo('/dashboard')
    }, 1000)

  } catch (error: any) {
    errorMessage.value =
      error?.data?.statusMessage ||
      error?.message ||
      'Registration failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="w-full max-w-md bg-white p-8 rounded-2xl shadow border border-gray-200">
      
      <!-- Title -->
      <h1 class="text-2xl font-bold text-gray-900">Create Account</h1>
      <p class="mt-2 text-sm text-gray-600">
        Start managing your projects with ease.
      </p>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="mt-6 space-y-4">

        <!-- Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            v-model="form.name"
            type="text"
            placeholder="Enter your name"
            class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="Enter your email"
            class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            v-model="form.password"
            type="password"
            placeholder="Enter your password"
            class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <!-- Workspace -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Workspace Name</label>
          <input
            v-model="form.workspaceName"
            type="text"
            placeholder="My Workspace"
            class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <!-- Error -->
        <p v-if="errorMessage" class="text-sm text-red-600">
          {{ errorMessage }}
        </p>

        <!-- Success -->
        <p v-if="successMessage" class="text-sm text-green-600">
          {{ successMessage }}
        </p>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition disabled:opacity-60"
        >
          {{ loading ? 'Creating...' : 'Register' }}
        </button>

      </form>

      <!-- Footer -->
      <p class="mt-6 text-sm text-gray-600 text-center">
        Already have an account?
        <NuxtLink to="/login" class="text-black font-medium underline">
          Login
        </NuxtLink>
      </p>

    </div>
  </div>
</template>