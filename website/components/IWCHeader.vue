<template>
    <header class="py-2 px-6 bg-ebony-clay text-white">
        <div class="flex">
            <div class="flex flex-grow space-x-2">
                <NuxtLink to="/" class="flex items-center space-x-2 hover:text-hokey-pokey">
                    <img src="/iwc_logo_white.png" alt="IWC Logo" width="64" height="64" />
                    <span class="text-xl font-semibold px-4"> Galaxy IWC - Workflow Library </span>
                </NuxtLink>
            </div>
            <div class="flex items-center space-x-8">
                <NuxtLink to="/about" class="hover:text-hokey-pokey"> About </NuxtLink>
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
