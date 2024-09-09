import { defineStore } from 'pinia';
import {useApi} from "~/composable";

interface TimeZone {
    title: string;
    id: string
}

interface Reminder {
    id: number,
    quantity: number,
    message: string,
    timeframe: string,
    type: string,
    isSchedule: boolean,
    schedule: {
        start?: string,
        end?: string,
        timezone?: string | null
    }
}
export const useBotReminder = defineStore('reminder', {
    state: () => {
        return {
            workingZones: [
                { title: 'UTC -12:00 Baker Island, Howland Island', id: 'utc-12' },
                { title: 'UTC -11:00 American Samoa, Niue', id: 'utc-11' },
                { title: 'UTC -10:00 Hawaii-Aleutian Standard Time', id: 'utc-10' },
                { title: 'UTC -9:30 Marquesas Islands', id: 'utc-9_30' },
                { title: 'UTC -9:00 Alaska', id: 'utc-9' },
                { title: 'UTC -8:00 Pacific Time (US & Canada)', id: 'utc-8' },
                { title: 'UTC -7:00 Mountain Time (US & Canada)', id: 'utc-7' },
                { title: 'UTC -6:00 Central Time (US & Canada), Mexico City', id: 'utc-6' },
                { title: 'UTC -5:00 Eastern Time (US & Canada), Bogota', id: 'utc-5' },
                { title: 'UTC -4:00 Atlantic Time (Canada), Caracas', id: 'utc-4' },
                { title: 'UTC -3:30 Newfoundland', id: 'utc-3_30' },
                { title: 'UTC -3:00 Buenos Aires, Greenland', id: 'utc-3' },
                { title: 'UTC -2:00 South Georgia and the South Sandwich Islands', id: 'utc-2' },
                { title: 'UTC -1:00 Azores, Cape Verde', id: 'utc-1' },
                { title: 'UTC 00:00 Western Europe Time, London', id: 'utc0' },
                { title: 'UTC +1:00 Central European Time, West Africa Time', id: 'utc+1' },
                { title: 'UTC +2:00 Eastern European Time, Central Africa Time', id: 'utc+2' },
                { title: 'UTC +3:00 Moscow, East Africa Time', id: 'utc+3' },
                { title: 'UTC +3:30 Tehran', id: 'utc+3_30' },
                { title: 'UTC +4:00 Gulf Standard Time, Samara', id: 'utc+4' },
                { title: 'UTC +4:30 Kabul', id: 'utc+4_30' },
                { title: 'UTC +5:00 Pakistan Standard Time, Yekaterinburg', id: 'utc+5' },
                { title: 'UTC +5:30 Indian Standard Time, Sri Lanka', id: 'utc+5_30' },
                { title: 'UTC +5:45 Nepal Time', id: 'utc+5_45' },
                { title: 'UTC +6:00 Bangladesh Standard Time, Bhutan', id: 'utc+6' },
                { title: 'UTC +6:30 Cocos Islands, Myanmar', id: 'utc+6_30' },
                { title: 'UTC +7:00 Indochina Time (Bangkok, Vietnam)', id: 'utc+7' },
                { title: 'UTC +8:00 China Standard Time, Australian Western Standard Time', id: 'utc+8' },
                { title: 'UTC +8:45 Australian Central Western Standard Time', id: 'utc+8_45' },
                { title: 'UTC +9:00 Japan Standard Time, Korea Standard Time', id: 'utc+9' },
                { title: 'UTC +9:30 Australian Central Standard Time', id: 'utc+9_30' },
                { title: 'UTC +10:00 Australian Eastern Standard Time, Vladivostok', id: 'utc+10' },
                { title: 'UTC +10:30 Lord Howe Island', id: 'utc+10_30' },
                { title: 'UTC +11:00 Solomon Islands, New Caledonia', id: 'utc+11' },
                { title: 'UTC +12:00 Fiji, Gilbert Islands', id: 'utc+12' },
                { title: 'UTC +12:45 Chatham Islands', id: 'utc+12_45' },
                { title: 'UTC +13:00 Samoa, Tonga', id: 'utc+13' },
                { title: 'UTC +14:00 Line Islands, Kiribati', id: 'utc+14' }
            ] as TimeZone[]
        }
    },

    getters: {
        getAllTimeZones: (state) => state.workingZones
    },

    actions: {
        async saveBotReminder(id: string, reminders: Reminder[]){
            try {
                const response = await useApi(`/bot/${id}/reminders`, {
                    method: 'POST',
                    body: reminders
                })
                console.log(response);
            } catch (e) {
                console.error(e)
            }
        }
    }
})