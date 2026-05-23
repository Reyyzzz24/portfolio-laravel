import { useState } from 'react';
import { useDarkMode } from '@/hooks/use-dark-mode';
import type { PortfolioContent } from '@/types';

// Accept either the aggregated navbar object or raw navbar model rows
const Navbar = ({ content }: { content: PortfolioContent['navbar'] | any[] | null }) => {
    const contentObj = Array.isArray(content)
        ? {
              brand: content[0]?.brand ?? '',
              links: (content as any[]).filter(i => i.item_type === 'link').map(i => ({ label: i.label, href: i.href })),
              resumeLabel: content[0]?.resume_label ?? content[0]?.resumeLabel ?? 'Resume',
              documentsLabel: content[0]?.documents_label ?? content[0]?.documentsLabel ?? 'Documents',
              resumeLinks: (content as any[]).filter(i => i.item_type === 'resume').map(i => ({ label: i.label, href: i.href })),
          }
        : (content ?? { brand: '', links: [], resumeLabel: '', documentsLabel: '', resumeLinks: [] });
    const [theme, setTheme] = useDarkMode();
    const isDark = theme === 'dark';

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isResumeOpenMobile, setIsResumeOpenMobile] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleTheme = () => setTheme(isDark ? 'light' : 'dark');

    return (
        <header className="top-0 z-50 bg-white dark:bg-gray-900">
            <div className="container mx-auto flex items-center justify-between px-4 py-4">
                <div className="text-3xl font-bold tracking-tighter">
                    <a href="#/" className="text-blue-600 dark:text-blue-400">
                        {contentObj.brand}
                    </a>
                </div>

                <nav className="hidden md:block">
                    <ul className="flex items-center space-x-8 font-medium">
                        {contentObj.links.map((link: any) => (
                            <li key={link.href}>
                                <a
                                    href={link.href}
                                    className="transition hover:text-blue-600 dark:text-gray-200"
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}

                        <li>
                            <button
                                onClick={toggleTheme}
                                className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full p-2 transition hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transform transition-all duration-500 ${isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" className={`absolute h-5 w-5 transform text-yellow-400 transition-all duration-500 ${isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            </button>
                        </li>

                        <li className="group relative">
                            <button className="rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700">
                                    {contentObj.resumeLabel}
                            </button>
                            <div className="invisible absolute right-0 top-full w-48 pt-2 opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100">
                                <div className="overflow-hidden rounded-lg border bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
                                    {contentObj.resumeLinks.map((link: any) => (
                                        <a
                                            key={link.href}
                                            href={link.href}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="block px-4 py-2 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                                        >
                                            {link.label}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </li>
                    </ul>
                </nav>

                <button
                    onClick={toggleMenu}
                    className="fixed right-4 top-4 z-[70] flex cursor-pointer flex-col space-y-1.5 p-3 md:hidden"
                >
                    <div className={`h-0.5 w-6 bg-gray-800 transition-all duration-300 dark:bg-gray-100 ${isMenuOpen ? 'translate-y-2 rotate-45' : ''}`}></div>
                    <div className={`h-0.5 w-6 bg-gray-800 transition-all duration-300 dark:bg-gray-100 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
                    <div className={`h-0.5 w-6 bg-gray-800 transition-all duration-300 dark:bg-gray-100 ${isMenuOpen ? '-translate-y-2 -rotate-45' : ''}`}></div>
                </button>
            </div>

            <div
                onClick={toggleMenu}
                className={`fixed inset-0 z-[50] bg-black/50 transition-opacity duration-500 md:hidden ${isMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
            ></div>

            <div className={`fixed right-0 top-0 z-[60] flex h-screen w-72 flex-col space-y-6 bg-white p-8 pt-24 text-xl font-medium shadow-2xl transition-all duration-500 dark:bg-gray-900 md:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                {contentObj.links.map((link: any) => (
                    <a
                        key={link.href}
                        href={link.href}
                        onClick={toggleMenu}
                        className="border-b pb-2 transition hover:text-blue-600 dark:border-gray-800 dark:text-gray-200"
                    >
                        {link.label}
                    </a>
                ))}

                <div className="pt-2">
                    <p className="mb-4 text-sm uppercase tracking-widest text-gray-500">
                        {contentObj.documentsLabel}
                    </p>
                    <div className="relative">
                        <button
                            onClick={() => setIsResumeOpenMobile(!isResumeOpenMobile)}
                            className="flex w-full items-center justify-between rounded-xl bg-blue-600 p-4 text-base text-white transition-all duration-300"
                        >
                            <span>{contentObj.resumeLabel}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-300 ${isResumeOpenMobile ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        <div className={`mt-2 flex flex-col overflow-hidden rounded-xl bg-gray-50 transition-all duration-500 ease-in-out dark:bg-gray-800 ${isResumeOpenMobile ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                            {contentObj.resumeLinks.map((link: any) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block border-b px-4 py-4 text-base hover:bg-blue-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-blue-900/20"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <p className="mb-4 text-sm uppercase tracking-widest text-gray-500">
                        Settings
                    </p>
                    <button
                        onClick={toggleTheme}
                        className="flex w-full items-center space-x-3 rounded-xl bg-gray-100 p-4 transition-colors dark:bg-gray-800"
                    >
                        <div className="relative h-6 w-6 shrink-0">
                            {isDark ? (
                                <svg className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" /></svg>
                            ) : (
                                <svg className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                            )}
                        </div>
                        <span className="text-sm font-medium dark:text-gray-200">
                            Switch to {isDark ? 'Light' : 'Dark'} Mode
                        </span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
