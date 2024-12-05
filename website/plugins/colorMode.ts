// Forces light color mode even if localStorage already contains saved preference.
// `colorMode.preference` setting from `nuxt.config.ts` is not enough in this case.
export default defineNuxtPlugin((nuxtApp) => {
    const colorMode = useColorMode();
    nuxtApp.hook("app:mounted", () => {
        colorMode.preference = "light";
        colorMode.value = "light";
    });
});
