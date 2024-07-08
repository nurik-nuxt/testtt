const layoutConfig = reactive({
    ripple: true,
    darkTheme: false,
    inputStyle: 'outlined',
    menuMode: 'static',
    theme: 'aura-light-green',
    scale: 14,
    activeMenuItem: null
});

const layoutState = reactive({
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    profileSidebarVisible: false,
    configSidebarVisible: false,
    staticMenuMobileActive: false,
    menuHoverActive: false,
    languageDialog: false,
    chatVisible: false
});
const languageDialog = ref(false);
const chatVisible = ref(false)
export const useLayout = () => {
    const setScale = (scale: number) => {
        layoutConfig.scale = scale;
    };
    const setToggleChat = (isVisible: boolean) => {
        chatVisible.value = isVisible;
    };
    const showLanguageDialog = (show: boolean) => {
        languageDialog.value = show;
    }
    const setActiveMenuItem = (item: any) => {
        layoutConfig.activeMenuItem = item.value || item;
    };

    const onMenuToggle = () => {
        if (layoutConfig.menuMode === 'overlay') {
            layoutState.overlayMenuActive = !layoutState.overlayMenuActive;
        }

        if (window.innerWidth > 991) {
            layoutState.staticMenuDesktopInactive = !layoutState.staticMenuDesktopInactive;
        } else {
            layoutState.staticMenuMobileActive = !layoutState.staticMenuMobileActive;
        }
    };

    const isSidebarActive = computed(() => layoutState.overlayMenuActive || layoutState.staticMenuMobileActive);

    const isDarkTheme = computed(() => layoutConfig.darkTheme);

    return { layoutConfig: toRefs(layoutConfig), layoutState: toRefs(layoutState), setScale, onMenuToggle, showLanguageDialog, languageDialog, chatVisible, isSidebarActive, isDarkTheme, setActiveMenuItem, setToggleChat };
}