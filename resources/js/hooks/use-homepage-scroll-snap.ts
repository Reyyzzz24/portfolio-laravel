import { useEffect } from 'react';

const RULER_SELECTOR = '.homepage-ruler .homepage-snap-section';
const SNAP_SECTION_SELECTOR = '.homepage-snap-section'; 

const FOOTER_SELECTOR = '.homepage-chrome-footer';
const SNAP_THRESHOLD_PX = 56;
const SCROLL_IDLE_MS = 160;

function isNearFooter(): boolean {
    const footer = document.querySelector<HTMLElement>(FOOTER_SELECTOR);

    if (!footer) {
        return false;
    }

    const rect = footer.getBoundingClientRect();

    return rect.top < window.innerHeight * 0.92;
}

/**
 * Ruler snap only for sections inside `.homepage-ruler`.
 * Navbar and footer stay in normal document flow and are never snap targets.
 */
export function useHomepageScrollSnap(): void {
    useEffect(() => {
        const ruler = document.querySelector<HTMLElement>('.homepage-ruler');

        if (!ruler) {
            return;
        }

        const sections = Array.from(ruler.querySelectorAll<HTMLElement>(SNAP_SECTION_SELECTOR));

        if (sections.length === 0) {
            return;
        }

        let idleTimer: ReturnType<typeof setTimeout>;
        let isSnapping = false;

        const getViewportCenterY = (): number => window.scrollY + window.innerHeight / 2;

        const getElementCenterY = (element: HTMLElement): number => {
            const rect = element.getBoundingClientRect();

            return window.scrollY + rect.top + rect.height / 2;
        };

        const snapToElement = (element: HTMLElement): void => {
            const targetTop = getElementCenterY(element) - window.innerHeight / 2;
            const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
            const clampedTop = Math.min(maxScroll, Math.max(0, targetTop));

            if (Math.abs(window.scrollY - clampedTop) < SNAP_THRESHOLD_PX) {
                return;
            }

            isSnapping = true;
            window.scrollTo({ top: clampedTop, behavior: 'smooth' });

            window.setTimeout(() => {
                isSnapping = false;
            }, 500);
        };

        const snapToNearest = (): void => {
            if (isSnapping || isNearFooter()) {
                return;
            }

            const viewportCenter = getViewportCenterY();
            let nearest: HTMLElement | null = null;
            let nearestDistance = Infinity;

            for (const section of sections) {
                const distance = Math.abs(getElementCenterY(section) - viewportCenter);

                if (distance < nearestDistance) {
                    nearestDistance = distance;
                    nearest = section;
                }
            }

            if (!nearest || nearestDistance < SNAP_THRESHOLD_PX) {
                return;
            }

            snapToElement(nearest);
        };

        const scheduleSnap = (): void => {
            if (isSnapping) {
                return;
            }

            clearTimeout(idleTimer);
            idleTimer = setTimeout(snapToNearest, SCROLL_IDLE_MS);
        };

        const onScroll = (): void => scheduleSnap();
        const onScrollEnd = (): void => snapToNearest();

        const onAnchorClick = (event: MouseEvent): void => {
            const target = event.target;

            if (!(target instanceof Element)) {
                return;
            }

            const link = target.closest<HTMLAnchorElement>('a[href^="#"]');

            if (!link || !link.hash) {
                return;
            }

            const section = ruler.querySelector<HTMLElement>(link.hash);

            if (!section?.classList.contains('homepage-snap-section')) {
                return;
            }

            event.preventDefault();
            snapToElement(section);
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('scrollend', onScrollEnd);
        document.addEventListener('click', onAnchorClick);

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('scrollend', onScrollEnd);
            document.removeEventListener('click', onAnchorClick);
            clearTimeout(idleTimer);
        };
    }, []);
}
