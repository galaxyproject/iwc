<template>
    <div class="h-svh flex flex-col">
        <NuxtLoadingIndicator />
        <IWCHeader />
        <main class="flex overflow-hidden">
            <NuxtLayout>
                <NuxtPage />
            </NuxtLayout>
        </main>
    </div>
</template>
