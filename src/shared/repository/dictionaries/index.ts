import { useAppQuery as useQuery } from "~/plugins/vue-query";
import { useApi } from "~/composable";

export function queryGetModelList() {
    return useQuery({
        queryKey: ["models"],
        queryFn: () => useApi('/info/models', { method: 'GET' }),
        select: (data) => {
            return data?.models || []
        }
    })
}
export function queryGetUserDataFields() {
    return useQuery({
        queryKey: ["userFields"],
        queryFn: () => useApi('/info/user_data_fields', { method: 'GET' }),
        select: (data) => {
            return data || []
        }
    })
}

