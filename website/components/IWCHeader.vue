<template>
    <header class="shadow-md">
        <UContainer class="py-4">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                    <NuxtLink to="/" class="flex items-center space-x-2">
                        <div class="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                            <span class="text-white text-xl font-bold">IWC</span>
                        </div>
                        <span class="text-xl font-semibold">Galaxy IWC - Workflow Library</span>
                    </NuxtLink>
                </div>
                <div class="flex items-center space-x-2">
                    <NuxtLink to="/about" class="text-gray-600 hover:text-primary">About</NuxtLink>
                    <NuxtLink to="/docs" class="text-gray-600 hover:text-primary">Docs</NuxtLink>
                    <NuxtLink to="/help" class="text-gray-600 hover:text-primary">Help</NuxtLink>
                </div>
            </div>
        </UContainer>
    </header>
</template>
