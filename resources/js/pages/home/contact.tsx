import type { PortfolioContent } from '@/types';
import { LazyIcon } from '@/components/admin-form-utils';
import { ParallaxSection } from '@/components/ParallaxSection';

const Contact = ({ content }: { content: PortfolioContent['contact'] | any[] | null }) => {
    const contentObj = Array.isArray(content)
        ? {
              eyebrow: content[0]?.section_eyebrow ?? 'Get In Touch',
              title: content[0]?.section_title ?? "Let's work together",
              formAction: content[0]?.form_action ?? content[0]?.formAction ?? '#',
              submitLabel: content[0]?.submit_label ?? content[0]?.submitLabel ?? 'Send Message',
              items: content.map((c: any) => ({
                  label: c.label,
                  value: c.value,
                  href: c.href,
                  iconPath: c.icon_path ?? c.iconPath,
              })),
          }
        : (content ?? {
              eyebrow: 'Get In Touch',
              title: "Let's work together",
              formAction: '#',
              submitLabel: 'Send Message',
              items: [],
          });

    return (
        <ParallaxSection id="contact" showParticles particleCount={150} intensity="strong">
            <div className="container mx-auto max-w-7xl px-6 md:px-12">
                <div className="mb-16 text-center">
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                        {contentObj.eyebrow}
                    </h3>
                    <h1 className="mt-2 text-4xl font-bold text-gray-900 md:text-5xl dark:text-white">
                        {contentObj.title}
                    </h1>
                </div>

                <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-2 lg:gap-24">
                    <div className="contact-left order-2 lg:order-1">
                        <form action={contentObj.formAction} method="POST" className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 ml-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Your Name"
                                        name="name"
                                        required
                                        className="w-full rounded-2xl border-2 border-transparent bg-gray-50 p-4 text-gray-900 outline-none transition-all duration-300 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10 dark:bg-gray-800 dark:text-white dark:focus:bg-gray-700"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 ml-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="Your Email"
                                        name="email"
                                        required
                                        className="w-full rounded-2xl border-2 border-transparent bg-gray-50 p-4 text-gray-900 outline-none transition-all duration-300 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10 dark:bg-gray-800 dark:text-white dark:focus:bg-gray-700"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="mb-2 ml-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Message
                                </label>
                                <textarea
                                    name="message"
                                    rows={6}
                                    placeholder="How can I help you?"
                                    required
                                    className="w-full resize-none rounded-2xl border-2 border-transparent bg-gray-50 p-4 text-gray-900 outline-none transition-all duration-300 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10 dark:bg-gray-800 dark:text-white dark:focus:bg-gray-700"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full rounded-2xl bg-blue-600 py-5 font-bold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-700 active:scale-[0.98]"
                            >
                                {contentObj.submitLabel}
                            </button>
                        </form>
                    </div>

                    <div className="contact-right order-1 space-y-12 lg:order-2">
                        {contentObj.items.map((item: any) => (
                            <div key={item.label} className="flex items-start gap-6">
                                <div className="rounded-2xl bg-blue-50 p-4 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                    <LazyIcon name={item.iconPath} className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                                        {item.label}
                                    </h4>
                                    <a
                                        href={item.href}
                                        className="mt-2 block text-gray-600 hover:text-blue-600 dark:text-gray-400"
                                    >
                                        {item.value}
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </ParallaxSection>
    );
};

export default Contact;
