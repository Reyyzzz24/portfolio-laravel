import React from 'react';
import { motion } from 'framer-motion';
import type { PortfolioContent } from '@/types';
import { LazyIcon } from '@/components/admin-form-utils';

const Contact = ({ content }: { content: PortfolioContent['contact'] | any[] | null }) => {
  const contentObj = Array.isArray(content)
    ? {
      eyebrow: content[0]?.section_eyebrow ?? 'Get In Touch',
      title: content[0]?.section_title ?? "Let's work together",
      formAction: content[0]?.form_action ?? content[0]?.formAction ?? '#',
      submitLabel: content[0]?.submit_label ?? content[0]?.submitLabel ?? 'Send Message',
      items: content.map((c: any) => ({ label: c.label, value: c.value, href: c.href, iconPath: c.icon_path ?? c.iconPath })),
    }
    : (content ?? { eyebrow: 'Get In Touch', title: "Let's work together", formAction: '#', submitLabel: 'Send Message', items: [] });

  return (
    <section id="contact" className="py-24 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto max-w-7xl px-6 md:px-12">
        {/* Header Section dengan animasi */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-widest text-sm">
            {contentObj.eyebrow}
          </h3>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 text-gray-900 dark:text-white">
            {contentObj.title}
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Kolom Kiri: Form dengan animasi slide-in dari kiri */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="contact-left order-2 lg:order-1"
          >
            <form action={contentObj.formAction} method="POST" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ml-1">Name</label>
                  <input type="text" placeholder="Your Name" name="name" required className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-600 focus:bg-white dark:focus:bg-gray-700 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all duration-300 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ml-1">Email</label>
                  <input type="email" placeholder="Your Email" name="email" required className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-600 focus:bg-white dark:focus:bg-gray-700 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all duration-300 text-gray-900 dark:text-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ml-1">Message</label>
                <textarea name="message" rows={6} placeholder="How can I help you?" required className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-600 focus:bg-white dark:focus:bg-gray-700 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all duration-300 resize-none text-gray-900 dark:text-white"></textarea>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-5 rounded-2xl hover:bg-blue-700 transform hover:-translate-y-1 transition-all duration-300 active:scale-[0.98] shadow-lg shadow-blue-600/20">
                {contentObj.submitLabel}
              </button>
            </form>
          </motion.div>

          {/* Kolom Kanan: Info Kontak dengan animasi slide-in dari kanan */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="contact-right space-y-12 order-1 lg:order-2"
          >
            {contentObj.items.map((item: any) => (
              <div key={item.label} className="flex items-start gap-6 group">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-2xl text-blue-600 dark:text-blue-400 shadow-sm transition-all duration-300 shrink-0">
                  <LazyIcon name={item.iconPath} className="h-6 w-6" style={{ color: item.iconColor || 'currentColor' }} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white">{item.label}</h4>
                  {item.href ? (
                    <a href={item.href} className="text-gray-600 dark:text-gray-400 mt-2 block hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400 mt-2 leading-relaxed whitespace-pre-line">
                      {item.value}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;