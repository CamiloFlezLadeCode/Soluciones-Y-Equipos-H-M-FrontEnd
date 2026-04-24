import { Toaster, toast, type ToastOptions, type ToastPosition } from 'react-hot-toast'

type NotifyType = 'success' | 'error' | 'info' | 'loading'

export interface NotifyOptions {
    message: string
    type?: NotifyType
    position?: ToastPosition
    duration?: number
}

const DEFAULT_POSITION: ToastPosition = 'top-center'

const getToastMethod = (type: NotifyType = 'info') => {
    if (type === 'success') return toast.success
    if (type === 'error') return toast.error
    if (type === 'loading') return toast.loading
    return toast
}

export const notify = ({ message, type = 'info', position = DEFAULT_POSITION, duration }: NotifyOptions) => {
    const toastOptions: ToastOptions = { position }

    if (typeof duration === 'number') {
        toastOptions.duration = duration
    }

    return getToastMethod(type)(message, toastOptions)
}

export const dismissNotify = (toastId?: string) => {
    toast.dismiss(toastId)
}

export const AppToaster = () => (
    <Toaster
        position={DEFAULT_POSITION}
        toastOptions={{
            duration: 3500,
            style: {
                borderRadius: '10px',
                fontSize: '14px',
            },
        }}
    />
)
