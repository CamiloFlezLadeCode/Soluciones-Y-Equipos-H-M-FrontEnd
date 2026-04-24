export interface NotifyOptions {
    message: string;
    type?: 'success' | 'error' | 'info' | 'loading';
    position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}