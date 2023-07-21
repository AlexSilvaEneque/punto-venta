<template>
    <div class="fixed w-96 h-16 rounded bg-white z-50 inset-y-1 right-2">
        <div class="flex w-full h-full items-center px-3 gap-5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="text-green-500 w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="font-semibold text-md text-gray-700">
                <slot />
            </span>
        </div>
    </div>
</template>