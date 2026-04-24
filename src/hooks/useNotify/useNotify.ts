import { notify as notifyService } from '@services/notify'
import type { NotifyOptions } from '@hooks/useNotify/useNotify.types'

export default function useNotify() {
    const notify = (message: NotifyOptions) => {
        return notifyService(message)
    }
    return { notify }
}
