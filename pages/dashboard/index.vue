<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
})

const headers = process.server ? useRequestHeaders(['cookie']) : undefined

const { data } = await useFetch('/api/auth/me', {
  headers,
  credentials: 'include',
})

const user = computed(() => data.value?.data?.user || null)
const workspaces = computed(() => data.value?.data?.workspaces || [])

const stats = ref([
  {
    title: 'Total Projects',
    value: 12,
    icon: '📁',
    description: 'Active workspace projects',
  },
  {
    title: 'Open Tasks',
    value: 34,
    icon: '✅',
    description: 'Tasks in progress',
  },
  {
    title: 'Completed Tasks',
    value: 18,
    icon: '🎯',
    description: 'Finished this week',
  },
  {
    title: 'Team Members',
    value: workspaces.value.length || 1,
    icon: '👥',
    description: 'Workspace access',
  },
])

const recentActivities = ref([
  {
    title: 'Project "Website Redesign" created',
    time: '2 hours ago',
  },
  {
    title: 'Task "Setup authentication flow" completed',
    time: '4 hours ago',
  },
  {
    title: 'New workspace member invited',
    time: 'Yesterday',
  },
  {
    title: 'Dashboard UI updated',
    time: '2 days ago',
  },
])
</script>

<template>
  <div>
    <section class="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-700 p-6 text-white shadow-sm">
      <p class="text-sm uppercase tracking-wide text-slate-300">SaaS Project Management Tool</p>
      <h2 class="mt-2 text-3xl font-bold">
        Hi, {{ user?.name || 'User' }} 👋
      </h2>
      <p class="mt-2 max-w-2xl text-sm text-slate-200">
        Manage projects, track tasks, collaborate with your team, and monitor productivity from one place.
      </p>

      <div class="mt-5 flex flex-wrap gap-3">
        <NuxtLink
          to="/dashboard/projects"
          class="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100"
        >
          View Projects
        </NuxtLink>

        <button
          class="rounded-lg border border-slate-400 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
        >
          Create Project
        </button>
      </div>
    </section>

    <section class="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div
        v-for="item in stats"
        :key="item.title"
        class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm font-medium text-slate-500">{{ item.title }}</p>
            <h3 class="mt-2 text-3xl font-bold text-slate-900">{{ item.value }}</h3>
            <p class="mt-2 text-sm text-slate-500">{{ item.description }}</p>
          </div>
          <div class="text-2xl">
            {{ item.icon }}
          </div>
        </div>
      </div>
    </section>

    <section class="mt-8 grid gap-6 xl:grid-cols-3">
      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-semibold text-slate-900">Your Workspaces</h3>
            <p class="mt-1 text-sm text-slate-500">
              Manage your organizations and access levels.
            </p>
          </div>
        </div>

        <div v-if="workspaces.length" class="mt-6 grid gap-4 md:grid-cols-2">
          <div
            v-for="workspace in workspaces"
            :key="workspace.id"
            class="rounded-xl border border-slate-200 bg-slate-50 p-4"
          >
            <div class="flex items-start justify-between">
              <div>
                <h4 class="text-lg font-semibold text-slate-900">
                  {{ workspace.name }}
                </h4>
                <p class="mt-1 text-sm text-slate-500">
                  Workspace role: {{ workspace.role }}
                </p>
              </div>
              <span class="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                Active
              </span>
            </div>

            <div class="mt-4 flex gap-2">
              <button class="rounded-lg bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-800">
                Open
              </button>
              <button class="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">
                Settings
              </button>
            </div>
          </div>
        </div>

        <div v-else class="mt-6 rounded-xl border border-dashed border-slate-300 p-6 text-center">
          <p class="text-slate-500">No workspaces found.</p>
        </div>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 class="text-xl font-semibold text-slate-900">Quick Actions</h3>
        <p class="mt-1 text-sm text-slate-500">
          Fast shortcuts for common tasks.
        </p>

        <div class="mt-6 space-y-3">
          <button class="w-full rounded-xl bg-slate-900 px-4 py-3 text-left text-white hover:bg-slate-800">
            <div class="font-medium">+ Create New Project</div>
            <div class="text-sm text-slate-300">Start a fresh project workspace</div>
          </button>

          <button class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-left hover:bg-slate-50">
            <div class="font-medium text-slate-900">+ Add New Task</div>
            <div class="text-sm text-slate-500">Create and assign a task</div>
          </button>

          <button class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-left hover:bg-slate-50">
            <div class="font-medium text-slate-900">+ Invite Team Member</div>
            <div class="text-sm text-slate-500">Add collaborators to workspace</div>
          </button>
        </div>
      </div>
    </section>

    <section class="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h3 class="text-xl font-semibold text-slate-900">Recent Activity</h3>
        <p class="mt-1 text-sm text-slate-500">
          Latest updates from your workspace.
        </p>
      </div>

      <div class="mt-6 space-y-4">
        <div
          v-for="activity in recentActivities"
          :key="activity.title"
          class="flex items-center justify-between rounded-xl border border-slate-200 p-4"
        >
          <div>
            <p class="font-medium text-slate-900">{{ activity.title }}</p>
            <p class="mt-1 text-sm text-slate-500">{{ activity.time }}</p>
          </div>
          <span class="text-lg">📌</span>
        </div>
      </div>
    </section>
  </div>
</template>