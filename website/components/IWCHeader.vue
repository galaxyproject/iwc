<template>
    <header class="p-16 bg-ebony-clay-800">
        <div class="flex">
            <div class="flex flex-grow space-x-2">
                <NuxtLink to="/" class="flex items-center space-x-2">
                    <img src="/iwc_logo_white.png" alt="IWC Logo" width="128" height="128" />
                    <span class="text-4xl font-mono font-semibold text-chicago-50 px-4">
                        Galaxy IWC - Workflow Library
                    </span>
                </NuxtLink>
            </div>
            <div class="flex items-center space-x-8 px-12 font-mono text-chicago-50">
                <NuxtLink to="https://github.com/galaxyproject/iwc/blob/main/workflows/README.md#adding-workflows">
                    Contribute
                </NuxtLink>
                <NuxtLink to="https://github.com/galaxyproject/iwc/">GitHub <Icon name="uil:github" /></NuxtLink>
            </div>
        </div>
    </header>
</template>
