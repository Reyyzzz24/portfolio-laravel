import { router } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import type { FlashToast } from '@/types/ui';

export function useFlashToast(): void {
    useEffect(() => {
        return router.on('flash', (event) => {
            const flash = (event as CustomEvent).detail?.flash;
            // Preferred shape: flash.toast = { type: 'success'|'error'|'info'|'warning', message: string }
            const data = flash?.toast as FlashToast | undefined;

            if (data && data.message) {
                toast[data.type](data.message);
                return;
            }

            // Fallbacks: common flash keys used by controllers: 'success', 'error', 'message', 'status'
            if (flash?.success) {
                toast.success(String(flash.success));
                return;
            }

            if (flash?.error) {
                toast.error(String(flash.error));
                return;
            }

            if (flash?.message) {
                toast.info(String(flash.message));
                return;
            }

            if (flash?.status) {
                // status is sometimes used for simple success messages
                toast.success(String(flash.status));
                return;
            }
        });
    }, []);
}
