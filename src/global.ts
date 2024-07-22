export {};

declare global {
    interface Window {
        mountWidget: () => void;
    }
}
