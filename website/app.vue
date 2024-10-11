<template>
    <div class="h-dvh flex flex-col">
        <NuxtLoadingIndicator />
        <IWCHeader />
        <main class="flex overflow-hidden">
            <NuxtLayout>
                <NuxtPage />
            </NuxtLayout>
        </main>
    </div>
</template>
