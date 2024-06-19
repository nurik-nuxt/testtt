export const useMainStore = defineStore('main', {
    state: () => {
        return {
            chatBotActiveTab: 0 as number
        }
    },

    actions: {
        setChatBotActiveTab(index: number) {
            this.chatBotActiveTab = index;
        }
    }
})