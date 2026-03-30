<script setup lang="ts">
const headers = process.server ? useRequestHeaders(['cookie']) : undefined

const { data, error, refresh } = await useFetch('/api/auth/me', {
  headers,
  credentials: 'include',
})

if (error.value) {
  await navigateTo('/login')
}

const user = computed(() => data.value?.data?.user || null)
const route = useRoute()

const pageBreadcrumbs = computed(() => {
  const metaCrumbs = route.meta.breadcrumbs as Array<{ label: string; to?: string }> | undefined

  if (metaCrumbs?.length) {
    return metaCrumbs
  }

  const segments = route.path.split('/').filter(Boolean)
  const crumbs: Array<{ label: string; to?: string }> = []

  let currentPath = ''

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`

    let label = segment

    if (segment === 'dashboard') label = 'Dashboard'
    else if (segment === 'projects') label = 'Projects'
    else if (segment === 'tasks') label = 'Tasks'
    else if (segment === 'settings') label = 'Settings'
    else if (segment.endsWith('-edit')) label = 'Edit Project'
    else if (index > 1 && segments[index - 1] === 'projects') label = 'Project Details'

    crumbs.push({
      label,
      to: index === segments.length - 1 ? undefined : currentPath,
    })
  })

  return crumbs
})

const handleLogout = async () => {
  await $fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  })

  await navigateTo('/login')
}
</script>

<template>
  <div class="min-h-screen bg-slate-100">
    <header class="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div class="flex items-center gap-8">
          <NuxtLink to="/dashboard" class="text-xl font-bold text-slate-900">
            SaaS PM
          </NuxtLink>

          <nav class="hidden items-center gap-6 md:flex">
            <NuxtLink to="/dashboard" class="text-sm font-medium text-slate-700 hover:text-slate-900">
              Dashboard
            </NuxtLink>
            <NuxtLink to="/dashboard/projects" class="text-sm font-medium text-slate-700 hover:text-slate-900">
              Projects
            </NuxtLink>
            <NuxtLink to="/dashboard/tasks" class="text-sm font-medium text-slate-700 hover:text-slate-900">
              Tasks
            </NuxtLink>
            <NuxtLink to="/dashboard/settings" class="text-sm font-medium text-slate-700 hover:text-slate-900">
              Settings
            </NuxtLink>
          </nav>
        </div>

        <div class="flex items-center gap-3">
          <div class="hidden text-right sm:block">
            <p class="text-sm font-semibold text-slate-900">
              {{ user?.name || 'User' }}
            </p>
            <p class="text-xs text-slate-500">
              {{ user?.email || 'user@email.com' }}
            </p>
          </div>

          <button
            class="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
            @click="refresh()"
          >
            Refresh
          </button>

          <button
            class="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition"
            @click="handleLogout"
          >
            Logout
          </button>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-7xl px-6 pb-8 pt-28">
      <div
        v-if="pageBreadcrumbs.length"
        class="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500"
      >
        <template
          v-for="(item, index) in pageBreadcrumbs"
          :key="`${item.label}-${index}`"
        >
          <NuxtLink
            v-if="item.to && index !== pageBreadcrumbs.length - 1"
            :to="item.to"
            class="hover:text-slate-900"
          >
            {{ item.label }}
          </NuxtLink>

          <span
            v-else
            class="font-semibold text-slate-900"
          >
            {{ item.label }}
          </span>

          <span v-if="index !== pageBreadcrumbs.length - 1">/</span>
        </template>
      </div>

      <slot />
    </main>
  </div>
</template>