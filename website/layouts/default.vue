<template>
    <div class="flex w-full">
        <!-- Left sidebar -->
        <div class="w-1/4 p-4 overflow-y-auto">
            <h1>sidebar</h1>
            <slot name="sidebar"></slot>
        </div>

        <!-- Right side content -->
        <div class="w-3/4 p-4 overflow-y-auto">
            <h1>content</h1>
            <slot name="content"></slot>
        </div>
    </div>
</template>
