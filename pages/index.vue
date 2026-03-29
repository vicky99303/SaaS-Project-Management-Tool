<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 px-4">
    <div class="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
      <h1 class="text-3xl font-bold text-slate-900">SaaS Project Management Tool</h1>
      <p class="mt-3 text-slate-600">
        Nuxt 3 + Nitro + Prisma + PostgreSQL
      </p>

      <div class="mt-6 flex flex-wrap gap-3">
        <NuxtLink
          to="/register"
          class="rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800"
        >
          Get Started
        </NuxtLink>

        <NuxtLink
          to="/login"
          class="rounded-lg border border-slate-300 px-4 py-2 hover:bg-slate-50"
        >
          Login
        </NuxtLink>
      </div>
    </div>
  </div>
</template>