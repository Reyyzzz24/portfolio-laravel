import React from 'react';
import { motion } from 'framer-motion';

type ResumeSection = {
  section_eyebrow: string;
  section_title: string;
  section_description: string;
};

type SkillItem = {
  id: number | string;
  name: string;
  display_order: number;
};

type EducationItem = {
  id: number | string;
  institution: string;
  degree: string;
  period: string;
  is_current: boolean;
  display_order: number;
};

type SkillsProps = {
  section: ResumeSection | null;
  skills: SkillItem[];
  education: EducationItem[];
};

const Skills = ({ section, skills = [], education = [] }: SkillsProps) => {

  const actualSkills = Array.isArray(skills) ? skills : [];
  const actualEducation = Array.isArray(education) ? education : [];

  const midpoint = Math.ceil(actualSkills.length / 2);
  const skillListLeft = actualSkills.slice(0, midpoint);
  const skillListRight = actualSkills.slice(midpoint);

  const eyebrow = section?.section_eyebrow || "My Resume";
  const title = section?.section_title || "Skills & Education";
  const description = section?.section_description || "";

  return (
    <section id="skills" className="bg-gray-50 dark:bg-gray-800/50 py-24 transition-colors duration-300">
      <div className="container mx-auto max-w-7xl px-6 md:px-12">
        {/* Header dengan animasi fade-up */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h3 className="text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-widest text-sm">
            {eyebrow}
          </h3>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 text-gray-900 dark:text-white">
            {title}
          </h1>
          <div className="h-1.5 w-20 bg-blue-600 mx-auto mt-6 rounded-full"></div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Sisi Kiri: Timeline Pendidikan */}
          <div className="space-y-0">
            {actualEducation.map((item, index) => (
              <motion.div 
                key={item.id} 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-6"
              >
                <div className="flex flex-col items-center">
                  <div className={`w-4 h-4 rounded-full bg-blue-600 shrink-0 shadow-[0_0_0_4px_rgba(37,99,235,0.2)] ${item.is_current ? 'animate-pulse' : ''}`}></div>
                  <div className={`w-0.5 h-full ${index === actualEducation.length - 1 ? 'bg-transparent' : 'bg-blue-200 dark:bg-gray-700'}`}></div>
                </div>
                <div className="pb-12">
                  <h4 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
                    {item.institution}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 mt-3">{item.degree}</p>
                  <p className="text-blue-600 dark:text-blue-400 font-semibold mt-2 text-sm bg-blue-50 dark:bg-blue-900/20 inline-block px-3 py-1 rounded-full">
                    {item.period}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Sisi Kanan: Card Skills */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-[2rem] border border-gray-200 dark:border-gray-700 transition-all duration-300"
          >
            <p className="text-gray-600 dark:text-gray-400 mb-10 leading-relaxed text-lg">
              {description}
            </p>

            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              <ul className="space-y-5">
                {skillListLeft.map((skill) => (
                  <motion.li 
                    key={skill.id} 
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-4 text-gray-700 dark:text-gray-300 group"
                  >
                    <span className="w-2.5 h-2.5 bg-blue-600 rounded-full group-hover:scale-125 transition-transform"></span>
                    <span className="font-medium">{skill.name}</span>
                  </motion.li>
                ))}
              </ul>
              <ul className="space-y-5">
                {skillListRight.map((skill) => (
                  <motion.li 
                    key={skill.id} 
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-4 text-gray-700 dark:text-gray-300 group"
                  >
                    <span className="w-2.5 h-2.5 bg-blue-600 rounded-full group-hover:scale-125 transition-transform"></span>
                    <span className="font-medium">{skill.name}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Skills;