import { createInertiaApp } from '@inertiajs/react';
import MotionGraphicPageLayout, {
    isPublicPortfolioComponent,
    MotionGraphicTransitionProvider,
} from '@/components/MotionGraphicPageTransition';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';
const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),

    layout: (name) => {
        if (isPublicPortfolioComponent(name)) {
            return MotionGraphicPageLayout;
        }

        switch (true) {
            case name === 'welcome':
                return null;

            case name.startsWith('auth/'):
                return AuthLayout;

            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];

            case name.startsWith('admin/'):
                return AppLayout;

            default:
                return AppLayout;
        }
    },

    strictMode: true,

    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                <MotionGraphicTransitionProvider>{app}</MotionGraphicTransitionProvider>
                <Toaster />
            </TooltipProvider>
        );
    },

    progress: false,
});

initializeTheme();
