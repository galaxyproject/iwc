<template>
    <header class="p-8 bg-ebony-clay-800 border-b text-white">
        <div class="flex">
            <div class="flex flex-grow space-x-2">
                <NuxtLink to="/" class="flex items-center space-x-2 hover:text-hokey-pokey">
                    <img src="/iwc_logo_white.png" alt="IWC Logo" width="128" height="128" />
                    <span class="text-4xl font-mono font-semibold px-4"> Galaxy IWC - Workflow Library </span>
                </NuxtLink>
            </div>
            <div class="flex items-center space-x-8 font-mono">
                <NuxtLink
                    to="https://github.com/galaxyproject/iwc/blob/main/workflows/README.md#adding-workflows"
                    class="hover:text-hokey-pokey">
                    Contribute
                </NuxtLink>
                <NuxtLink to="https://github.com/galaxyproject/iwc/" class="hover:text-hokey-pokey">
                    GitHub <Icon name="uil:github" />
                </NuxtLink>
            </div>
        </div>
    </header>
</template>
