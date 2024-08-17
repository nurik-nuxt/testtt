import { defineStore } from "pinia";
import { useApi } from "~/composable";

interface FileItem {
    filename?: string;
    mimeType?: string;
    originalName?: string;
    filePath?: string;
    filenameEncodeFull: string;
}
export const useUploadFileStore = defineStore('uploadFile', {
    state: () => {
        return {
            currentFile: '' as string,
            files: [] as FileItem[]
        }
    },

    getters: {
        getFiles: (state) => state.files
    },

    actions: {
        async loadFile(file: any) {
            try {
                const body = new FormData();
                body.append('file', file);
                const response = await useApi('/upload', {
                    method: 'POST',
                    body
                }, false, true, false)
                this.files.push({ filename: response?.filename, mimeType: response?.mimeType?.includes('image') ? 'picture' : response?.mimeType?.includes('pdf') ? 'pdf' : response?.mimeType?.includes('spreadsheetml')  ? 'excel' : response?.mimeType?.includes('wordprocessingml') ? 'docs' : 'file', originalName: decodeURIComponent(escape(response?.originalName)), filePath: response?.filePath, filenameEncodeFull: response?.filenameEncodeFull })
                return response;
            } catch (e) {
                console.log(e);
            }
        },

        deleteFileByIndex(index: number) {
            console.log(index)
            if (index >= 0 && index < this.files.length) {
                this.files.splice(index, 1);
            } else {
                console.error('Index out of bounds');
            }
        },

        setFiles(files: FileItem[]) {
            this.files = files
        }
    }
})