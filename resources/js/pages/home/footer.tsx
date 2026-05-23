import React from 'react';
import { motion } from 'framer-motion';
import type { PortfolioContent } from '@/types';
import { LazyIcon } from '@/components/admin-form-utils'; 

const Footer = ({ content = [] }: { content: PortfolioContent['footer'] | any[] | null }) => {
  const currentYear = new Date().getFullYear();

  const safeContent = Array.isArray(content)
    ? content
    : (content && (content as any).socialLinks) ? (content as any).socialLinks : [];

  const copyrightText =
    (!Array.isArray(content) && content && (content as any).copyright)
      ? (content as any).copyright
      : (safeContent[0]?.copyright || "All Rights Reserved");

  return (
    <footer className="py-12 border-t border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-900 text-center transition-colors duration-300">
      <div className="container mx-auto px-6">
        
        {/* Social Links Row dengan animasi stagger */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
          className="flex justify-center items-center space-x-6 mb-8"
        >
          {safeContent.map((social: any) => (
            <motion.a
              key={social.id || social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              variants={{
                hidden: { opacity: 0, scale: 0.5 },
                visible: { opacity: 1, scale: 1 }
              }}
              className={`group p-3 bg-gray-50 dark:bg-gray-800 rounded-full text-gray-400 transition-all duration-300 ${social.hover_class || social.hoverClass || ''}`}
              aria-label={social.name}
            >
              <LazyIcon 
                name={social.icon_path || social.iconPath} 
                className="h-5 w-5" 
                style={{ color: social.icon_color || 'currentColor' }} 
              />
            </motion.a>
          ))}
        </motion.div>

        {/* Copyright Text dengan animasi fade-in */}
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xs md:text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest font-medium"
        >
          &#169; {currentYear} {copyrightText}
        </motion.p>
      </div>
    </footer>
  );
};

export default Footer;